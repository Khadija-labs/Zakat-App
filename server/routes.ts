import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import { api } from "@shared/routes";
import { chatRequestSchema } from "@shared/schema";
import { calculateZakat } from "./zakatCalc";
import { getZakatAssistantSystemPrompt, getDefaultRates, ZAKATGPT_CALCULATE_TOOL } from "./prompts/zakatgpt";
import { z } from "zod";

/** Normalize user message for parsing (collapse spaces, trim). */
function normalizeMessage(text: string): string {
  return String(text).replace(/\s+/g, " ").trim();
}

/** Parse user message for gold/silver tolas. "X tolas" without "silver" = gold. "tolas gold" with no number = 1 tola. */
function parseTolasFromMessage(text: string): { goldQty: number; silverQty: number } {
  const t = normalizeMessage(text);
  const goldMatch =
    t.match(/(\d+(?:\.\d+)?)\s*tolas?\s*(?:of\s+)?gold/i) ??
    t.match(/(\d+(?:\.\d+)?)\s*tolas?\s*gold/i) ??
    t.match(/(\d+(?:\.\d+)?)\s*gold/i);
  const silverMatch = t.match(/(\d+(?:\.\d+)?)\s*tolas?\s*silver/i) ?? t.match(/(\d+(?:\.\d+)?)\s*silver/i);
  const plainTolas = t.match(/(\d+(?:\.\d+)?)\s*tolas?(?!\s*silver)/i);
  let goldQty = goldMatch ? Number(goldMatch[1]) : 0;
  const silverQty = silverMatch ? Number(silverMatch[1]) : 0;
  if (goldQty === 0 && plainTolas && !/silver/i.test(t)) goldQty = Number(plainTolas[1]);
  if (goldQty === 0 && /\d+/.test(t) && /gold/i.test(t) && /tola/i.test(t)) {
    const numMatch = t.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) goldQty = Number(numMatch[1]);
  }
  // "tolas gold" or "tola gold" (with or without "of") and no number = 1 tola when asking for calculation
  if (goldQty === 0 && /tolas?\s*(?:of\s+)?gold|gold.*tolas?/i.test(t) && /zakat|calculate|amount|give|tell|how much|my zakat/i.test(t))
    goldQty = 1;
  return { goldQty, silverQty };
}

/** True if we should always use server-side calculation (no LLM). */
function isDirectCalculationRequest(content: string): boolean {
  const t = normalizeMessage(content);
  if (!/tola/i.test(t) && !/gold/i.test(t)) return false;
  if (!/zakat|calculate|amount|give|tell|how much|my zakat/i.test(t)) return false;
  const { goldQty, silverQty } = parseTolasFromMessage(t);
  return goldQty > 0 || silverQty > 0;
}

function formatNum(n: number): string {
  return n.toLocaleString("en-PK", { maximumFractionDigits: 0 });
}

/** Build breakdown text from calculation result and env rates (no LLM). */
function formatZakatBreakdown(
  result: { netWealth: number; nisabThreshold: number; isEligible: boolean; zakatAmount: number; currency: string },
  goldQty: number,
  silverQty: number,
  rates: { goldPerTola: number; silverPerTola: number; currency: string }
): string {
  const sym = rates.currency === "PKR" ? "Rs. " : rates.currency === "USD" ? "$" : rates.currency + " ";
  const parts: string[] = [];
  if (goldQty > 0) {
    const goldVal = goldQty * rates.goldPerTola;
    parts.push(`Gold: ${goldQty} tola(s) × ${formatNum(rates.goldPerTola)} per tola = ${sym}${formatNum(goldVal)}.`);
  }
  if (silverQty > 0) {
    const silverVal = silverQty * rates.silverPerTola;
    parts.push(`Silver: ${silverQty} tola(s) × ${formatNum(rates.silverPerTola)} per tola = ${sym}${formatNum(silverVal)}.`);
  }
  parts.push(`Nisab (52.5 tolas silver): ${formatNum(rates.silverPerTola)} × 52.5 = ${sym}${formatNum(result.nisabThreshold)}.`);
  if (result.isEligible) {
    parts.push(`Your net wealth ${sym}${formatNum(result.netWealth)} is above Nisab, so Zakat applies.`);
    parts.push(`Zakat (2.5%) = ${sym}${formatNum(result.zakatAmount)}.`);
  } else {
    parts.push(`Your net wealth ${sym}${formatNum(result.netWealth)} is below Nisab, so no Zakat is due.`);
  }
  parts.push("You can share your own gold/silver rates if you want a different calculation.");
  return parts.join(" ");
}

const MAIL_TO = process.env.MAIL_TO || "khadija.amin.dev@gmail.com";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET) return true;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token }).toString(),
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch (e) {
    console.error("[contact] reCAPTCHA verify error:", e);
    return false;
  }
}

function getMailer() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://zakat-ai-calc.vercel.app/</loc><lastmod>2025-03-12</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://zakat-ai-calc.vercel.app/calculator</loc><lastmod>2025-03-12</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://zakat-ai-calc.vercel.app/about</loc><lastmod>2025-03-12</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://zakat-ai-calc.vercel.app/contact</loc><lastmod>2025-03-12</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://zakat-ai-calc.vercel.app/terms-and-conditions</loc><lastmod>2025-03-12</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>https://zakat-ai-calc.vercel.app/privacy-policy</loc><lastmod>2025-03-12</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
</urlset>`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/sitemap.xml", (_req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).end(SITEMAP_XML);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const token = typeof input.recaptchaToken === "string" ? input.recaptchaToken.trim() : "";

      if (RECAPTCHA_SECRET) {
        if (!token) {
          return res.status(400).json({
            success: false,
            message: "Please complete the reCAPTCHA verification.",
          });
        }
        const valid = await verifyRecaptcha(token);
        if (!valid) {
          return res.status(400).json({
            success: false,
            message: "reCAPTCHA verification failed. Please try again.",
          });
        }
      }

      const transporter = getMailer();

      if (!transporter) {
        console.warn("[contact] SMTP not configured. Set SMTP_USER and SMTP_PASS (e.g. Gmail App Password) so emails reach", MAIL_TO);
        return res.status(503).json({
          success: false,
          message: "Email is not configured on the server. Your message was not sent. Please try again later or contact the site owner.",
        });
      }

      await transporter.sendMail({
        from: process.env.MAIL_FROM || `Zakat AI Calc Contact <${process.env.SMTP_USER}>`,
        to: MAIL_TO,
        replyTo: input.email,
        subject: `Zakat AI Calc Contact from ${input.name}`,
        text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
        html: `<p><strong>Name:</strong> ${input.name}</p><p><strong>Email:</strong> ${input.email}</p><p><strong>Message:</strong></p><p>${input.message.replace(/\n/g, "<br>")}</p>`,
      });

      console.log("[contact] Email sent successfully to", MAIL_TO);
      res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("[contact] Send failed:", err);
      res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again later.",
      });
    }
  });

  // ZakatGPT chat: answers Zakat questions and can calculate Zakat via tool
  const CHAT_PATH = "/api/chat";

  // Status check: verify chat API is up and OPENAI_API_KEY is set (no key value exposed)
  app.get("/api/chat/status", (_req, res) => {
    res.status(200).json({
      ok: true,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
    });
  });

  app.post(CHAT_PATH, async (req, res) => {
    const sendError = (status: number, message: string) => {
      if (!res.headersSent) res.status(status).json({ error: message });
    };
    try {
      if (!req.body || typeof req.body !== "object") {
        return sendError(400, "Request body is required (JSON with messages array).");
      }
      const body = chatRequestSchema.parse(req.body);
      const lastMsg = body.messages[body.messages.length - 1];
      const lastContent = (lastMsg?.role === "user" && typeof lastMsg.content === "string") ? lastMsg.content : "";
      const { goldQty, silverQty } = parseTolasFromMessage(lastContent);
      const useDirectPath = isDirectCalculationRequest(lastContent);
      const looksLikeCalculation = /\b(gold|silver|tolas?|grams?|zakat|calculate|amount|give me|tell me|how much)\b/i.test(lastContent);

      // Direct path: answer with server-side calculation only; never call LLM for "X tolas gold" type requests
      if (useDirectPath && (goldQty > 0 || silverQty > 0)) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[chat] direct path: gold=" + goldQty + " silver=" + silverQty);
        }
        const rates = getDefaultRates();
        const goldValue = goldQty * rates.goldPerTola;
        const silverValue = silverQty * rates.silverPerTola;
        const result = calculateZakat({
          goldValue,
          silverValue,
          silverRatePerTola: rates.silverPerTola,
          currency: rates.currency,
        });
        const reply = formatZakatBreakdown(result, goldQty, silverQty, rates);
        return res.status(200).json({
          message: { role: "assistant" as const, content: reply },
        });
      }

      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return sendError(503, "ZakatGPT is not configured. Please set OPENAI_API_KEY in Vercel project settings.");
      }
      const openai = new OpenAI({ apiKey: openaiKey });
      const systemPrompt = getZakatAssistantSystemPrompt();
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...body.messages.map((m) => ({ role: m.role, content: m.content })),
      ];
      const forceTool = looksLikeCalculation ? { type: "function" as const, function: { name: "calculate_zakat" as const } } : "auto";
      let response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools: [ZAKATGPT_CALCULATE_TOOL],
        tool_choice: forceTool,
      });
      const choice = response.choices[0];
      if (!choice?.message) {
        return sendError(502, "No response from assistant.");
      }
      let assistantMessage = choice.message;
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolCall = assistantMessage.tool_calls[0];
        if (toolCall.function?.name === "calculate_zakat") {
          let args = JSON.parse(toolCall.function.arguments || "{}");
          if (looksLikeCalculation) {
            const rates = getDefaultRates();
            const goldMatch = lastContent.match(/(\d+(?:\.\d+)?)\s*tolas?\s*gold/i) ?? lastContent.match(/(\d+(?:\.\d+)?)\s*gold/i);
            const silverMatch = lastContent.match(/(\d+(?:\.\d+)?)\s*tolas?\s*silver/i) ?? lastContent.match(/(\d+(?:\.\d+)?)\s*silver/i);
            const plainTolasMatch = lastContent.match(/(\d+(?:\.\d+)?)\s*tolas?(?!\s*silver)/i);
            let goldQty = goldMatch ? Number(goldMatch[1]) : 0;
            const silverQty = silverMatch ? Number(silverMatch[1]) : 0;
            if (goldQty === 0 && plainTolasMatch && !/silver/i.test(lastContent)) goldQty = Number(plainTolasMatch[1]);
            if (goldQty > 0 && (args.goldValue == null || args.goldValue === 0)) args.goldValue = goldQty * rates.goldPerTola;
            if (silverQty > 0 && (args.silverValue == null || args.silverValue === 0)) args.silverValue = silverQty * rates.silverPerTola;
            if (args.silverRatePerTola == null || args.silverRatePerTola === 0) args.silverRatePerTola = rates.silverPerTola;
            if (!args.currency) args.currency = rates.currency;
          }
          const result = calculateZakat({
            cash: args.cash,
            savings: args.savings,
            investments: args.investments,
            digitalAssets: args.digitalAssets,
            goldValue: args.goldValue,
            silverValue: args.silverValue,
            otherAssets: args.otherAssets,
            liabilities: args.liabilities,
            silverRatePerTola: args.silverRatePerTola,
            nisabThreshold: args.nisabThreshold,
            currency: args.currency,
          });
          messages.push(assistantMessage);
          messages.push({
            role: "tool" as const,
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
          response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            tools: [ZAKATGPT_CALCULATE_TOOL],
            tool_choice: "auto",
          });
          const nextChoice = response.choices[0];
          if (nextChoice?.message?.content) assistantMessage = nextChoice.message;
        }
      }
      if (!res.headersSent) {
        res.status(200).json({
          message: {
            role: "assistant" as const,
            content: assistantMessage.content || "I couldn't generate a response. Please try again.",
          },
        });
      }
    } catch (err) {
      if (res.headersSent) return;
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid request",
          details: err.errors,
        });
      }
      const errObj = err as { status?: number; code?: string; message?: string; error?: { message?: string } };
      const status = errObj?.status ?? (errObj?.error as { status?: number })?.status;
      const rawMessage = err instanceof Error ? err.message : errObj?.message ?? errObj?.error?.message ?? String(err);
      let userMessage = "Something went wrong. Please try again.";
      if (status === 401) {
        userMessage = "Invalid OpenAI API key. Add or update OPENAI_API_KEY in Vercel → Settings → Environment Variables.";
      } else if (status === 429) {
        userMessage = "Rate limit reached. Please wait a moment and try again.";
      } else if (status === 500 || status === 502 || status === 503) {
        userMessage = "OpenAI service is temporarily unavailable. Please try again in a moment.";
      } else if (rawMessage && rawMessage.length > 0 && rawMessage.length <= 200) {
        userMessage = rawMessage;
      }
      console.error("[chat] Error:", err);
      res.status(500).json({ error: userMessage });
    }
  });

  return httpServer;
}
