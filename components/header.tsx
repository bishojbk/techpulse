"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchCommand } from "@/components/search-command";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useArticlesContext } from "@/hooks/articles-context";

export function Header() {
  const { count } = useBookmarks();
  const { articles } = useArticlesContext();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="border-b border-border bg-background">
      {/* Top utility bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 sm:px-6">
          <span className="text-[11px] text-muted-foreground tracking-wide">
            {dateStr}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-500" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Live</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Auto-refreshes every 10m</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="text-2xl font-extrabold tracking-tighter">
            Tech
          </span>
          <span className="text-2xl font-extrabold tracking-tighter text-primary">
            Pulse
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <SearchCommand articles={articles} />

          <Link
            href="/bookmarks"
            className="relative flex h-9 items-center gap-1.5 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Bookmarks (${count})`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[18px] w-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
