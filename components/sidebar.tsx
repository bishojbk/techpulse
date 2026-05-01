"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";
import { useArticlesContext } from "@/hooks/articles-context";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function Sidebar() {
  const pathname = usePathname();
  const { articles } = useArticlesContext();
  const { count } = useBookmarks();

  const isHome = pathname === "/";
  const isBookmarks = pathname === "/bookmarks";
  const activeCat = pathname?.startsWith("/category/")
    ? pathname.split("/")[2]
    : null;

  const sourceCounts = new Map<string, number>();
  for (const a of articles) {
    sourceCounts.set(a.source, (sourceCounts.get(a.source) ?? 0) + 1);
  }
  const sources = Array.from(sourceCounts.entries()).sort(
    ([, a], [, b]) => b - a,
  );

  const categoryCounts = new Map<string, number>();
  for (const a of articles) {
    categoryCounts.set(a.category, (categoryCounts.get(a.category) ?? 0) + 1);
  }

  return (
    <aside
      className="scrollbar-none sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-[18px] overflow-y-auto overscroll-contain border-r px-[18px] pt-[22px] pb-[18px] lg:flex"
      style={{ background: "var(--bg)", borderColor: "var(--rule-soft)" }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="flex items-baseline gap-2 px-1 pb-[14px]"
        style={{ borderBottom: "1px solid var(--rule-soft)" }}
      >
        <span
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: "-0.02em",
            fontVariationSettings: '"opsz" 144, "SOFT" 30',
            lineHeight: 1,
            color: "var(--ink)",
          }}
        >
          TechPulse
          <span style={{ color: "var(--accent)" }}>.</span>
        </span>
      </Link>
      <div
        className="px-1"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9.5,
          color: "var(--ink-3)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Daily Dispatch · Est. 2026
      </div>

      {/* READ */}
      <div className="flex flex-col gap-[2px]">
        <NavLabel>Read</NavLabel>
        <NavItem href="/" active={isHome}>
          Today&apos;s Feed
          <span className="num">{articles.length || ""}</span>
        </NavItem>
        {CATEGORIES.map((c) => (
          <NavItem
            key={c.slug}
            href={`/category/${c.slug}`}
            active={activeCat === c.slug}
            mono
          >
            {c.label}
            <span className="num">{categoryCounts.get(c.slug) ?? 0}</span>
          </NavItem>
        ))}
      </div>

      {/* LIBRARY */}
      <div className="flex flex-col gap-[2px]">
        <NavLabel>Library</NavLabel>
        <NavItem href="/bookmarks" active={isBookmarks}>
          Bookmarks
          <span className="num">{count || ""}</span>
        </NavItem>
      </div>

      {/* SOURCES */}
      {sources.length > 0 && (
        <div className="flex flex-col gap-[2px]">
          <NavLabel>Sources · {sources.length}</NavLabel>
          {sources.slice(0, 8).map(([src, n]) => (
            <div
              key={src}
              className="flex items-center gap-[10px] rounded-[6px] px-[10px] py-[7px]"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--ink-2)",
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: "var(--ink-4)",
                }}
              />
              <span className="truncate">{src}</span>
              <span
                className="ml-auto"
                style={{ fontSize: 10.5, color: "var(--ink-3)" }}
              >
                {n}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer — toggle + user */}
      <div
        className="mt-auto flex flex-col gap-[10px] pt-[14px]"
        style={{ borderTop: "1px solid var(--rule-soft)" }}
      >
        <ThemeSwitch />
        <UserCard />
      </div>
    </aside>
  );
}

function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-[10px] py-[6px]"
      style={{
        fontFamily: "var(--mono)",
        fontSize: 9.5,
        color: "var(--ink-4)",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function NavItem({
  href,
  active,
  mono = false,
  children,
}: {
  href: string;
  active?: boolean;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-[10px] rounded-[6px] px-[10px] py-[7px] transition-colors",
        "select-none",
      )}
      style={{
        fontFamily: mono ? "var(--mono)" : "var(--sans)",
        fontSize: mono ? 11 : 13.5,
        color: active ? "var(--ink)" : "var(--ink-2)",
        background: active ? "var(--paper)" : "transparent",
        border: active ? "1px solid var(--rule)" : "1px solid transparent",
      }}
    >
      <span
        className="inline-block rounded-full transition-colors"
        style={{
          width: 6,
          height: 6,
          background: active ? "var(--accent)" : "var(--ink-4)",
        }}
      />
      {children}
      <style jsx>{`
        a:hover {
          color: var(--ink);
          background: var(--paper);
        }
        a :global(.num) {
          margin-left: auto;
          font-family: var(--mono);
          font-size: 10.5px;
          color: var(--ink-3);
        }
      `}</style>
    </Link>
  );
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLight = mounted && theme === "light";

  return (
    <div
      className="flex items-center justify-between px-1"
      style={{ fontSize: 12, color: "var(--ink-3)" }}
    >
      <span>Dark / Light</span>
      <button
        onClick={() => setTheme(isLight ? "dark" : "light")}
        aria-label="Toggle theme"
        className="relative cursor-pointer transition-colors"
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: "var(--paper-2)",
          border: "1px solid var(--rule)",
        }}
      >
        <span
          className="absolute top-[2px] transition-all"
          style={{
            left: isLight ? 18 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: isLight ? "var(--accent)" : "var(--ink-2)",
          }}
        />
      </button>
    </div>
  );
}

function UserCard() {
  return (
    <div className="flex items-center gap-[10px] px-1 py-[6px]">
      <div
        className="grid place-items-center"
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "var(--paper-2)",
          border: "1px solid var(--rule)",
          fontFamily: "var(--serif)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--ink-2)",
        }}
      >
        E
      </div>
      <div>
        <div style={{ fontSize: 12.5, color: "var(--ink-2)" }}>Reader</div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            color: "var(--ink-4)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Made by EJR
        </div>
      </div>
    </div>
  );
}
