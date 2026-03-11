import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";
import { api } from "@shared/routes";
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

  return httpServer;
}
