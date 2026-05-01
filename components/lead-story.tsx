"use client";

import { Article, getCategoryMeta } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { openUrl } from "@/lib/open-url";
import { BookmarkButton } from "@/components/bookmark-button";

const FILLER_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "of",
  "on",
  "in",
  "at",
  "to",
  "for",
  "with",
  "by",
  "as",
  "is",
  "are",
  "be",
  "this",
  "that",
  "from",
]);

/**
 * Pick a single content word from the title to render in italic accent —
 * roughly the article's strongest signal word. Falls back to the last word.
 * Used only for the typographic poster panel.
 */
function pickAccentWord(title: string): { lead: string; accent: string } {
  const words = title.replace(/[—–:|]/g, " ").trim().split(/\s+/);
  if (words.length <= 2) {
    return { lead: words[0] ?? "", accent: words.slice(1).join(" ") };
  }
  // Find the last meaningful word in the first half — gives a stronger feel
  // than just grabbing the last word, which tends to be a noun like "AI" or
  // a proper-name modifier.
  const firstHalf = words.slice(0, Math.ceil(words.length / 2));
  let pick = firstHalf.findLast?.(
    (w) => !FILLER_WORDS.has(w.toLowerCase()) && w.length > 3,
  );
  if (!pick) {
    pick = words.findLast?.(
      (w) => !FILLER_WORDS.has(w.toLowerCase()) && w.length > 3,
    );
  }
  if (!pick) pick = words[words.length - 1];

  // Split title into pre-pick and post-pick parts
  const idx = words.lastIndexOf(pick);
  const lead = words.slice(0, idx).join(" ");
  const accent = words.slice(idx).join(" ");
  return { lead, accent };
}

export function LeadStory({ article }: { article: Article }) {
  const cat = getCategoryMeta(article.category);
  const hasImage = !!article.imageUrl;
  const { lead, accent } = pickAccentWord(article.title);

  const handleOpen = () => openUrl(article.url);

  return (
    <article
      className="grid gap-[32px] pb-[32px]"
      style={{
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      {/* Poster panel */}
      <div
        className="relative cursor-pointer overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          border: "1px solid var(--rule)",
          background: hasImage
            ? "var(--paper)"
            : `
              radial-gradient(circle at 20% 20%, oklch(0.30 0.05 30 / 0.6), transparent 50%),
              radial-gradient(circle at 80% 80%, oklch(0.28 0.04 60 / 0.5), transparent 55%),
              var(--paper)
            `,
          containerType: "inline-size",
        }}
        onClick={handleOpen}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            background: "var(--accent)",
            color: "white",
            padding: "4px 8px",
            textTransform: "uppercase",
          }}
        >
          Lead Story
        </span>

        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col justify-between"
            style={{ padding: 22 }}
          >
            <div
              className="flex justify-between"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--ink-3)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <span>Poster · Lead</span>
              <span>{article.source}</span>
            </div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontVariationSettings: '"opsz" 144, "SOFT" 80',
                fontWeight: 400,
                fontSize: "clamp(28px, 11cqi, 84px)",
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                color: "var(--ink)",
                textWrap: "balance",
                wordBreak: "keep-all",
                overflowWrap: "normal",
                hyphens: "none",
              }}
            >
              {lead}
              {lead && " "}
              <em style={{ color: "var(--accent)" }}>{accent}</em>
              <span style={{ color: "var(--accent)" }}>.</span>
            </div>
            <div
              className="flex items-end justify-between"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--ink-3)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              <span>{cat.label}</span>
              <span className="flex items-end gap-[3px]">
                {[3, 5, 7, 10, 13, 16, 13].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: 4,
                      height: h,
                      background:
                        i < 5 ? "var(--accent)" : "var(--ink-3)",
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Text column */}
      <div className="flex min-w-0 flex-col">
        <div
          className="mb-[12px] flex items-center gap-[10px]"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10.5,
            letterSpacing: "0.08em",
            color: "var(--ink-3)",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "var(--ink-2)" }} className="flex items-center gap-1">
            ◆ {article.source}
          </span>
          <span style={{ color: "var(--ink-4)" }}>/</span>
          <span style={{ color: "var(--accent)" }}>{cat.label}</span>
          <span style={{ color: "var(--ink-4)" }}>/</span>
          <span>{relativeTime(article.publishedAt)}</span>
        </div>

        <h1
          onClick={handleOpen}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          className="hover-accent cursor-pointer"
          style={{
            fontFamily: "var(--serif)",
            fontVariationSettings: '"opsz" 144, "SOFT" 30',
            fontWeight: 500,
            fontSize: "clamp(32px, 3.4vw, 44px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            textWrap: "balance",
            marginBottom: 16,
          }}
        >
          {article.title}
        </h1>

        {article.excerpt && (
          <p
            style={{
              fontFamily: "var(--serif)",
              fontSize: 17,
              lineHeight: 1.5,
              color: "var(--ink-2)",
              textWrap: "pretty",
              marginBottom: 18,
              fontVariationSettings: '"opsz" 24',
            }}
            className="line-clamp-3"
          >
            {article.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-[8px]">
          <button className="btn primary" onClick={handleOpen}>
            Read original ↗
          </button>
          {article.hnUrl && (
            <button
              className="btn"
              onClick={() => article.hnUrl && openUrl(article.hnUrl)}
            >
              {article.commentCount} comments
            </button>
          )}
          <div className="ml-auto">
            <BookmarkButton article={article} />
          </div>
        </div>
      </div>
    </article>
  );
}
