"use client";

import { useBookmarks } from "@/hooks/use-bookmarks";
import { ArticleListItem } from "@/components/article-list-item";
import { EmptyState } from "@/components/empty-state";

export default function BookmarksPage() {
  const { bookmarks, clearAll, count } = useBookmarks();

  if (count === 0) {
    return (
      <EmptyState
        title="No saved articles"
        description="Articles you bookmark will appear here. Click the bookmark icon on any article to save it."
        showBackLink
      />
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-start justify-between border-b border-border pb-6">
        <div>
          <div className="section-divider mb-3 w-16" />
          <h1 className="text-3xl font-extrabold tracking-tight">Saved Articles</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {count} saved article{count === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={clearAll}
          className="mt-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          Clear all
        </button>
      </div>

      <div>
        {bookmarks.map((article, i) => (
          <ArticleListItem key={article.id} article={article} index={i} />
        ))}
      </div>
    </div>
  );
}
