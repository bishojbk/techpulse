import type { NextConfig } from "next";

const isTauri = process.env.TAURI_ENV === "1";

const nextConfig: NextConfig = {
  ...(isTauri ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
