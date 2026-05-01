"use client";

import { useState } from "react";
import { Article } from "@/lib/types";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function BookmarkButton({ article }: { article: Article }) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(article.id);
  const [pop, setPop] = useState(false);

  return (
    <button
      className="btn icon"
      style={{
        color: saved ? "var(--accent)" : "var(--ink-3)",
        background: "transparent",
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!saved) {
          setPop(true);
          setTimeout(() => setPop(false), 280);
        }
        toggle(article);
      }}
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
    >
      <svg
        viewBox="0 0 16 16"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        className={pop ? "animate-pulse-heart" : ""}
        style={{ width: 13, height: 13 }}
      >
        <path d="M3.5 2h9v12l-4.5-3-4.5 3z" />
      </svg>
    </button>
  );
}
