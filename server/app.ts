import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from project root
const envPath = path.resolve(__dirname, "..", ".env");
dotenv.config({ path: envPath });

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

/** Creates and configures the Express app (used by both standalone server and Vercel serverless). */
export async function createApp(): Promise<{ app: Express; httpServer: Server }> {
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req: express.Request, _res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const pathName = req.path;
    let capturedJsonResponse: Record<string, unknown> | undefined;

    const originalResJson = res.json.bind(res);
    res.json = function (bodyJson: unknown, ...args: unknown[]) {
      capturedJsonResponse = bodyJson as Record<string, unknown>;
      return (originalResJson as (...a: unknown[]) => express.Response).apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (pathName.startsWith("/api")) {
        let logLine = `${req.method} ${pathName} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    const status = (err as any)?.status ?? (err as any)?.statusCode ?? 500;
    const message = (err as Error)?.message ?? "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }

  return { app, httpServer };
}
