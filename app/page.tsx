"use client";

import { useArticlesContext } from "@/hooks/articles-context";
import { ArticleGrid } from "@/components/article-grid";
import { ArticleSkeletonGrid } from "@/components/article-skeleton";
import { PageHeading } from "@/components/page-heading";
import { EmptyState } from "@/components/empty-state";

export default function HomePage() {
  const { articles, loading } = useArticlesContext();

  if (loading) return <ArticleSkeletonGrid />;

  if (articles.length === 0) {
    return (
      <EmptyState
        title="No articles yet"
        description="We're having trouble fetching news feeds right now. Check back in a few minutes."
      />
    );
  }

  const sourceCount = new Set(articles.map((a) => a.source)).size;

  return (
    <>
      <PageHeading
        title="Latest Tech News"
        subtitle={`${articles.length} articles from ${sourceCount} sources`}
      />
      <ArticleGrid articles={articles} showCategoryBadge={true} />
    </>
  );
}
