import type { IncomingMessage, ServerResponse } from "http";

let appPromise: Promise<{ app: (req: IncomingMessage, res: ServerResponse) => void }> | null = null;

/** Handle GET /api/chat/status without loading Express (so it works even when createApp fails). */
function handleChatStatus(res: ServerResponse): void {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      ok: true,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
    })
  );
}

/**
 * Vercel serverless handler: forwards all requests to the Express app.
 * GET /api/chat/status is handled here so it works even if the app fails to load.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = req.url || "";
  const isGet = req.method === "GET";
  if (isGet && (url === "/api/chat/status" || url.endsWith("/api/chat/status"))) {
    handleChatStatus(res);
    return;
  }

  try {
    if (!appPromise) {
      // vercel-app.js is generated at build time (script/build.ts); no .ts source for types
      // @ts-expect-error - generated ESM bundle has createApp export
      const mod = await import("./vercel-app.js");
      appPromise = mod.createApp();
    }
    const { app } = await appPromise!;
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
