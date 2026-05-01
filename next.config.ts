import type { NextConfig } from "next";

const isTauri = process.env.TAURI_ENV === "1";

const nextConfig: NextConfig = {
  ...(isTauri ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // `*.web.ts` files (e.g. dynamic API routes) are picked up only on the
  // Vercel build. The Tauri static export can't include force-dynamic
  // routes, and the desktop app calls Rust via invoke() instead.
  pageExtensions: isTauri
    ? ["ts", "tsx", "js", "jsx"]
    : ["web.ts", "web.tsx", "ts", "tsx", "js", "jsx"],
};

export default nextConfig;
