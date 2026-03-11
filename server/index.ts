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

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // So you can see in the terminal whether .env was loaded and contact email will work
  const smtpOk = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  if (smtpOk) {
    log(`Contact form: email configured (messages will go to ${process.env.MAIL_TO || "khadija.amin.dev@gmail.com"})`);
  } else {
    console.warn("[contact] SMTP not configured. Add SMTP_USER and SMTP_PASS to .env in the project root and restart.");
  }

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  // reusePort is not supported on Windows (ENOTSUP); use 0.0.0.0 only on Linux/macOS
  const listenOpts =
    process.platform === "win32"
      ? { port, host: "127.0.0.1" as const }
      : { port, host: "0.0.0.0" as const, reusePort: true };
  httpServer.listen(listenOpts, () => {
    log(`serving on port ${port}`);
  });
})();
