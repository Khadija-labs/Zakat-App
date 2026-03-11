import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import { api } from "@shared/routes";
import { chatRequestSchema } from "@shared/schema";
import { calculateZakat } from "./zakatCalc";
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
  const ZAKAT_SYSTEM_PROMPT = `You are ZakatGPT, a helpful and knowledgeable assistant for Zakat (Islamic obligatory charity) on the ZakatCalc website. You answer questions about:
- What Zakat is, who must pay it, and when
- Nisab (minimum wealth threshold), including silver (52.5 tolas / 612.36 grams) and gold
- Zakatable assets: cash, savings, investments, digital assets, gold, silver; and deductible liabilities
- The rate: 2.5% (1/40) on wealth above Nisab held for one lunar year (Hawl)
- General guidance only; always recommend users confirm with a qualified scholar for their situation

When the user asks you to calculate their Zakat, use the calculate_zakat tool with the amounts they provide (in their chosen currency). If they give partial info, ask for the missing amounts (cash, savings, investments, digital assets, gold value, silver value, liabilities). Default currency is PKR; default Nisab is 150,000 PKR if not specified. After getting the tool result, explain the result clearly and remind them they can use the main calculator on the site for a full breakdown.`;
  const ZAKAT_TOOL = {
    type: "function" as const,
    function: {
      name: "calculate_zakat",
      description:
        "Calculate Zakat amount from total assets and liabilities. Use when the user provides monetary amounts (cash, savings, gold, silver, etc.). All amounts in same currency.",
      parameters: {
        type: "object",
        properties: {
          cash: { type: "number", description: "Cash in hand and bank" },
          savings: { type: "number", description: "Savings and deposits" },
          investments: { type: "number", description: "Business investments / stock" },
          digitalAssets: { type: "number", description: "Digital assets (crypto, etc.)" },
          goldValue: { type: "number", description: "Total value of gold (in same currency)" },
          silverValue: { type: "number", description: "Total value of silver (in same currency)" },
          liabilities: { type: "number", description: "Immediate debts / loans to deduct" },
          nisabThreshold: { type: "number", description: "Nisab threshold in same currency (default 150000)" },
          currency: { type: "string", description: "Currency code e.g. PKR, USD" },
        },
      },
    },
  };

  app.post(CHAT_PATH, async (req, res) => {
    try {
      const body = chatRequestSchema.parse(req.body);
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return res.status(503).json({
          error: "ZakatGPT is not configured. Please set OPENAI_API_KEY on the server.",
        });
      }
      const openai = new OpenAI({ apiKey: openaiKey });
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: ZAKAT_SYSTEM_PROMPT },
        ...body.messages.map((m) => ({ role: m.role, content: m.content })),
      ];
      let response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools: [ZAKAT_TOOL],
        tool_choice: "auto",
      });
      const choice = response.choices[0];
      if (!choice?.message) {
        return res.status(502).json({ error: "No response from assistant." });
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
            tools: [ZAKAT_TOOL],
            tool_choice: "auto",
          });
          const nextChoice = response.choices[0];
          if (nextChoice?.message?.content) assistantMessage = nextChoice.message;
        }
      }
      res.status(200).json({
        message: {
          role: "assistant" as const,
          content: assistantMessage.content || "I couldn't generate a response. Please try again.",
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid request",
          details: err.errors,
        });
      }
      console.error("[chat] Error:", err);
      res.status(500).json({
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  });

  return httpServer;
}
