import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // On Vercel, __dirname is inside the function bundle; use project root.
  const distPath = process.env.VERCEL
    ? path.join(process.cwd(), "dist", "public")
    : path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    if (process.env.VERCEL) {
      // On Vercel, dist/public may not be in the function bundle; don't crash so /api/* still works.
      console.warn("[static] Build directory not found on Vercel:", distPath);
      return;
    }
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
