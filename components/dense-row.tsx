"use client";

import { Article, getCategoryMeta } from "@/lib/types";
import { openUrl } from "@/lib/open-url";
import { useBookmarks } from "@/hooks/use-bookmarks";

const SECTION_ABBREV: Record<string, string> = {
  ai: "AI",
  dev: "Dev",
  security: "Sec",
  hardware: "HW",
  startups: "Biz",
  science: "Sci",
  general: "Gen",
};

function clockFromIso(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  // For older articles, show e.g. "Mon" or "Apr 23"
  const diffMs = today.getTime() - d.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days < 7) {
    return d.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
  }
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

function signalFromArticle(
  a: Article,
  ceiling: { points: number; comments: number },
): number {
  // 0..1 normalized score combining HN points + comments. For non-HN
  // articles (no points/comments), this returns 0 — they get an empty
  // 5-bar meter, which honestly reads correctly.
  const p = a.points ?? 0;
  const c = a.commentCount ?? 0;
  const norm =
    (p / Math.max(ceiling.points, 1)) * 0.7 +
    (c / Math.max(ceiling.comments, 1)) * 0.3;
  return Math.max(0, Math.min(1, norm));
}

export function DenseRow({
  article,
  signalCeiling,
}: {
  article: Article;
  signalCeiling: { points: number; comments: number };
}) {
  const cat = getCategoryMeta(article.category);
  const sig = signalFromArticle(article, signalCeiling);
  const bars = Math.round(sig * 5);
  const time = clockFromIso(article.publishedAt);
  const score = article.points;
  const hot = sig > 0.6;

  const handle = () => openUrl(article.url);

  return (
    <div
      onClick={handle}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handle();
        }
      }}
      className="group cursor-pointer"
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 80px 80px 28px",
        alignItems: "baseline",
        gap: 16,
        padding: "14px 0",
        borderBottom: "1px solid var(--rule-soft)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          color: "var(--ink-4)",
          letterSpacing: "0.04em",
        }}
      >
        {time}
      </span>

      <div
        className="hover-accent min-w-0"
        style={{
          fontFamily: "var(--serif)",
          fontSize: 17,
          lineHeight: 1.3,
          color: "var(--ink)",
          fontVariationSettings: '"opsz" 24',
          letterSpacing: "-0.01em",
        }}
      >
        <span
          aria-hidden
          className="mr-[8px] inline-flex items-end gap-[2px] align-baseline"
          style={{ height: 12 }}
        >
          {[3, 5, 7, 9, 11].map((h, i) => (
            <span
              key={i}
              style={{
                width: 2,
                height: h,
                background:
                  i < bars ? "var(--accent)" : "var(--ink-4)",
                opacity: i < bars ? 1 : 0.55,
              }}
            />
          ))}
        </span>
        {article.title}
        <span
          className="ml-[8px]"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--ink-3)",
            letterSpacing: "0.04em",
          }}
        >
          — {article.source}
        </span>
      </div>

      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9.5,
          color: "var(--ink-3)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {SECTION_ABBREV[article.category] ?? cat.label}
      </span>

      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: hot ? "var(--accent)" : "var(--ink-2)",
          textAlign: "right",
        }}
      >
        {typeof score === "number" && score > 0 ? (
          <>
            ▲ {score.toLocaleString()}{" "}
            <small style={{ fontSize: 9, color: "var(--ink-4)" }}>HN</small>
          </>
        ) : (
          <span style={{ color: "var(--ink-4)" }}>—</span>
        )}
      </span>

      <BookmarkDot article={article} />
    </div>
  );
}

function BookmarkDot({ article }: { article: Article }) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(article.id);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(article);
      }}
      aria-label={saved ? "Remove bookmark" : "Save"}
      className="cursor-pointer"
      style={{
        width: 22,
        height: 22,
        display: "grid",
        placeItems: "center",
        color: saved ? "var(--accent)" : "var(--ink-4)",
        background: "transparent",
        border: "none",
        fontSize: 16,
        lineHeight: 1,
        transition: "color 120ms",
      }}
    >
      {saved ? "●" : "○"}
    </button>
  );
}
