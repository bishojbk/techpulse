"use client";

import { useBookmarks } from "@/hooks/use-bookmarks";
import { ArticleGrid } from "@/components/article-grid";
import { PageHeading } from "@/components/page-heading";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  const { bookmarks, clearAll, count } = useBookmarks();

  if (count === 0) {
    return (
      <EmptyState
        title="No bookmarks yet"
        description="Articles you bookmark will appear here. Click the heart icon on any article to save it."
        showBackLink
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <PageHeading
          title="Bookmarks"
          subtitle={`${count} saved article${count === 1 ? "" : "s"}`}
        />
        <Button variant="outline" size="sm" onClick={clearAll}>
          Clear all
        </Button>
      </div>
      <ArticleGrid articles={bookmarks} showCategoryBadge={true} />
    </>
  );
}
