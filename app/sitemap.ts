import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/types";
import { SITE } from "@/lib/site";

// Required by `output: "export"` (Tauri build); harmless for the Vercel build.
export const dynamic = "force-static";

// Tauri static export emits a sitemap.xml into out/ alongside the desktop
// HTML; the file is unused by the desktop app.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    ...CATEGORIES.map((c) => ({
      url: `${SITE.url}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
