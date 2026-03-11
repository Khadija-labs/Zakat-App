import type { IncomingMessage, ServerResponse } from "http";

let appPromise: Promise<{ app: (req: IncomingMessage, res: ServerResponse) => void }> | null = null;

/**
 * Vercel serverless handler: forwards all requests to the Express app.
 * Uses dynamic import so load errors are caught; waits for response to finish before returning.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    if (!appPromise) {
      appPromise = import("../server/app").then((m) => m.createApp());
    }
    const { app } = await appPromise;
    await new Promise<void>((resolve, reject) => {
      res.once("finish", resolve);
      res.once("close", resolve);
      res.once("error", reject);
      app(req, res);
    });
  } catch (err) {
    console.error("[api] Handler error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "A server error has occurred" }));
    }
  }
}
