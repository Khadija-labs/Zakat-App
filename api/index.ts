import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server/app";

let appPromise: ReturnType<typeof createApp> | null = null;

/**
 * Vercel serverless handler: forwards all requests to the Express app.
 * Rewrites in vercel.json send every path here so the app serves both API and SPA.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!appPromise) appPromise = createApp();
  const { app } = await appPromise;
  app(req, res);
}
