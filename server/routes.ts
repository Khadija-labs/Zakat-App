import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import { api } from "@shared/routes";
import { chatRequestSchema } from "@shared/schema";
import { calculateZakat } from "./zakatCalc";
import { ZAKATGPT_SYSTEM_PROMPT, ZAKATGPT_CALCULATE_TOOL } from "./prompts/zakatgpt";
import { z } from "zod";

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
  <url><loc>https://zakat-calculators.vercel.app/</loc><lastmod>2025-03-12</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://zakat-calculators.vercel.app/calculator</loc><lastmod>2025-03-12</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://zakat-calculators.vercel.app/about</loc><lastmod>2025-03-12</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://zakat-calculators.vercel.app/contact</loc><lastmod>2025-03-12</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://zakat-calculators.vercel.app/terms-and-conditions</loc><lastmod>2025-03-12</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>https://zakat-calculators.vercel.app/privacy-policy</loc><lastmod>2025-03-12</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
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
        from: process.env.MAIL_FROM || `ZakatCalc Contact <${process.env.SMTP_USER}>`,
        to: MAIL_TO,
        replyTo: input.email,
        subject: `ZakatCalc Contact from ${input.name}`,
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
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return sendError(503, "ZakatGPT is not configured. Please set OPENAI_API_KEY in Vercel project settings.");
      }
      const openai = new OpenAI({ apiKey: openaiKey });
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: ZAKATGPT_SYSTEM_PROMPT },
        ...body.messages.map((m) => ({ role: m.role, content: m.content })),
      ];
      let response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools: [ZAKATGPT_CALCULATE_TOOL],
        tool_choice: "auto",
      });
      const choice = response.choices[0];
      if (!choice?.message) {
        return sendError(502, "No response from assistant.");
      }
      let assistantMessage = choice.message;
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolCall = assistantMessage.tool_calls[0];
        if (toolCall.function?.name === "calculate_zakat") {
          const args = JSON.parse(toolCall.function.arguments || "{}");
          const result = calculateZakat({
            cash: args.cash,
            savings: args.savings,
            investments: args.investments,
            digitalAssets: args.digitalAssets,
            goldValue: args.goldValue,
            silverValue: args.silverValue,
            liabilities: args.liabilities,
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
