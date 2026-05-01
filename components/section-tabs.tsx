"use client";

import Link from "next/link";
import { CATEGORIES, type CategoryType } from "@/lib/types";
import { useArticlesContext } from "@/hooks/articles-context";
import { cn } from "@/lib/utils";

export function SectionTabs({
  active,
}: {
  active: "all" | CategoryType;
}) {
  const { articles } = useArticlesContext();

  const counts = new Map<string, number>();
  for (const a of articles) {
    counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  }

  return (
    <nav
      className="scrollbar-none flex items-stretch overflow-x-auto"
      style={{
        padding: "0 40px",
        borderBottom: "1px solid var(--rule)",
      }}
      aria-label="Sections"
    >
      <SectionTab href="/" label="Front Page" count={articles.length} active={active === "all"} isFirst />
      {CATEGORIES.map((c, i) => (
        <SectionTab
          key={c.slug}
          href={`/category/${c.slug}`}
          label={c.label}
          count={counts.get(c.slug) ?? 0}
          active={active === c.slug}
          isLast={i === CATEGORIES.length - 1}
        />
      ))}
    </nav>
  );
}

function SectionTab({
  href,
  label,
  count,
  active,
  isFirst,
  isLast,
}: {
  href: string;
  label: string;
  count: number;
  active?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex shrink-0 items-baseline gap-[8px] whitespace-nowrap transition-colors",
        "hover-accent",
      )}
      style={{
        padding: "14px 18px 14px 0",
        marginRight: 18,
        marginLeft: isFirst ? 0 : 0,
        fontFamily: "var(--serif)",
        fontSize: 14.5,
        fontWeight: active ? 500 : 500,
        letterSpacing: "-0.005em",
        color: active ? "var(--ink)" : "var(--ink-3)",
        borderRight: isLast ? "none" : "1px solid var(--rule-soft)",
      }}
    >
      {label}
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          fontWeight: 400,
          color: active ? "var(--accent)" : "var(--ink-4)",
        }}
      >
        {count}
      </span>
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 18,
            height: 2,
            background: "var(--accent)",
          }}
        />
      )}
    </Link>
  );
}
