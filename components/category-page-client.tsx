"use client";

import { useParams } from "next/navigation";
import { useArticlesContext } from "@/hooks/articles-context";
import { ArticleGrid } from "@/components/article-grid";
import { ArticleSkeletonGrid } from "@/components/article-skeleton";
import { PageHeading } from "@/components/page-heading";
import { EmptyState } from "@/components/empty-state";
import { CATEGORIES, type CategoryType } from "@/lib/types";

const validSlugs = CATEGORIES.map((c) => c.slug);

export function CategoryPageClient() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { articles: allArticles, loading } = useArticlesContext();

  const cat = CATEGORIES.find((c) => c.slug === slug);

  if (loading) return <ArticleSkeletonGrid />;

  if (!cat || !validSlugs.includes(slug as CategoryType)) {
    return (
      <EmptyState
        title="Category not found"
        description="This category doesn't exist."
        showBackLink
      />
    );
  }

  const articles = allArticles.filter((a) => a.category === slug);

  if (articles.length === 0) {
    return (
      <EmptyState
        title={`No ${cat.label} articles right now`}
        description="Feeds refresh every 10 minutes — check back soon!"
        category={slug as CategoryType}
        showBackLink
      />
    );
  }

  return (
    <>
      <PageHeading
        title={cat.label}
        subtitle={`${articles.length} article${articles.length === 1 ? "" : "s"}`}
      />
      <ArticleGrid articles={articles} showCategoryBadge={false} />
    </>
  );
}
