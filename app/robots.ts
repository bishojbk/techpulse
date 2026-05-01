import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Required by `output: "export"` (Tauri build); harmless for the Vercel build.
export const dynamic = "force-static";

// Next's metadata file conventions resolve by exact filename, so this can't
// be excluded via the .web.ts pageExtensions trick. The Tauri static export
// will emit a robots.txt into out/ that nothing inside the desktop app
// reads — harmless.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/bookmarks"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
