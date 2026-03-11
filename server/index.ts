import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env from project root (folder that contains package.json)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");
const envResult = dotenv.config({ path: envPath });

if (process.env.NODE_ENV !== "production") {
  if (envResult.error) {
    console.warn("[env] .env file NOT found at:", envPath);
    console.warn("[env] Create a file named .env in the project root with SMTP_USER and SMTP_PASS.");
  } else {
    console.log("[env] Loaded .env from:", envPath);
    const hasUser = !!process.env.SMTP_USER;
    const hasPass = !!process.env.SMTP_PASS;
    console.log("[env] SMTP_USER:", hasUser ? `set (${process.env.SMTP_USER})` : "NOT SET");
    console.log("[env] SMTP_PASS:", hasPass ? "set (hidden)" : "NOT SET");
    if (!hasUser || !hasPass) {
      console.warn("[env] Add SMTP_USER and SMTP_PASS to .env (use Gmail App Password for SMTP_PASS).");
    }
  }
}

import { createApp, log } from "./app";

// On Vercel, the server is run via api/index.ts; do not start a listener here.
if (!process.env.VERCEL) {
  (async () => {
    const { app, httpServer } = await createApp();

    const smtpOk = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    if (smtpOk) {
      log(`Contact form: email configured (messages will go to ${process.env.MAIL_TO || "khadija.amin.dev@gmail.com"})`);
    } else {
      console.warn("[contact] SMTP not configured. Add SMTP_USER and SMTP_PASS to .env in the project root and restart.");
    }

    if (process.env.NODE_ENV !== "production") {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    const listenOpts =
      process.platform === "win32"
        ? { port, host: "127.0.0.1" as const }
        : { port, host: "0.0.0.0" as const, reusePort: true };
    httpServer.listen(listenOpts, () => {
      log(`serving on port ${port}`);
    });
  })();
}
