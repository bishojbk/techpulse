"use client";

import { useBookmarks } from "@/hooks/use-bookmarks";
import { DenseRow } from "@/components/dense-row";
import { EmptyState } from "@/components/empty-state";
import { useArticlesContext } from "@/hooks/articles-context";

export default function BookmarksClient() {
  const { bookmarks, clearAll, count } = useBookmarks();
  const { articles } = useArticlesContext();

  if (count === 0) {
    return (
      <EmptyState
        title="Nothing worth saving yet"
        description="Bookmark anything that's worth a second read — click the mark on any story, or hit the bookmark icon in the corner."
        showBackLink
      />
    );
  }

  // Compute signal ceiling from full feed when available, otherwise from bookmarks alone.
  let pCeil = 1;
  let cCeil = 1;
  const pool = articles.length > 0 ? articles : bookmarks;
  for (const a of pool) {
    if ((a.points ?? 0) > pCeil) pCeil = a.points!;
    if ((a.commentCount ?? 0) > cCeil) cCeil = a.commentCount!;
  }
  const signalCeiling = { points: pCeil, comments: cCeil };

  return (
    <div style={{ padding: "40px 40px 80px" }}>
      <header
        className="flex items-end justify-between pb-[24px]"
        style={{ borderBottom: "1px solid var(--rule)" }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              letterSpacing: "0.14em",
              color: "var(--ink-3)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Library · saved articles
          </div>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontVariationSettings: '"opsz" 144, "SOFT" 30',
              fontWeight: 500,
              fontSize: 56,
              letterSpacing: "-0.025em",
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            Worth a <em style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>second read</em>.
          </h1>
          <p
            className="mt-[8px]"
            style={{ fontSize: 13, color: "var(--ink-3)" }}
          >
            {count} saved article{count === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={clearAll}
          className="btn"
          style={{ color: "var(--ink-3)" }}
        >
          Clear all
        </button>
      </header>

      <div className="mt-[16px]">
        {bookmarks.map((article) => (
          <DenseRow
            key={article.id}
            article={article}
            signalCeiling={signalCeiling}
          />
        ))}
      </div>
    </div>
  );
}
