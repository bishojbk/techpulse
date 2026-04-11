import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-baseline gap-0.5">
              <span className="text-lg font-extrabold tracking-tighter">Tech</span>
              <span className="text-lg font-extrabold tracking-tighter text-primary">Pulse</span>
            </Link>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Real-time tech news aggregated from the web&apos;s best sources.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sections</h3>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sources</h3>
            <ul className="mt-3 space-y-2">
              {["TechCrunch", "Hacker News", "The Verge", "Ars Technica", "Wired", "Engadget", "Reddit"].map((s) => (
                <li key={s}>
                  <span className="text-[13px] text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">About</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/bookmarks" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                  Saved Articles
                </Link>
              </li>
              <li>
                <span className="text-[13px] text-muted-foreground">Built with Next.js</span>
              </li>
              <li>
                <span className="text-[13px] text-muted-foreground">Powered by RSS</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-[11px] text-muted-foreground">
          TechPulse &middot; Data refreshes automatically every 10 minutes
        </div>
      </div>
    </footer>
  );
}
