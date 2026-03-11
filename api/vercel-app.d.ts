declare module "./vercel-app.js" {
  import type { IncomingMessage, ServerResponse } from "http";
  export function createApp(): Promise<{
    app: (req: IncomingMessage, res: ServerResponse) => void;
    httpServer: import("http").Server;
  }>;
}
