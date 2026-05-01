// Single source of truth for site URL + branding metadata. Used by layout,
// per-page metadata, sitemap, robots, and JSON-LD. Override in production by
// setting NEXT_PUBLIC_SITE_URL; otherwise we fall back to the Vercel-injected
// VERCEL_URL, then localhost in dev.
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

export const SITE = {
  name: "TechPulse",
  tagline: "The Daily Dispatch",
  description:
    "An editorial daily dispatch — tech, AI, security, hardware, and science aggregated from TechCrunch, Hacker News, The Verge, Ars Technica, MIT Tech Review, Hugging Face, Krebs on Security, Tom's Hardware, Quanta Magazine, and more.",
  url: fromEnv ?? "http://localhost:3000",
  twitter: "@techpulse",
  locale: "en_US",
} as const;
