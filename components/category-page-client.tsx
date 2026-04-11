"use client";

import { useParams } from "next/navigation";
import { useArticlesContext } from "@/hooks/articles-context";
import { ArticleSkeletonGrid } from "@/components/article-skeleton";
import { ArticleListItem } from "@/components/article-list-item";
import { TopStories } from "@/components/top-stories";
import { TrendingSidebar } from "@/components/trending-sidebar";
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
        title="Section not found"
        description="This section doesn't exist."
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

  const topStories = articles.slice(0, 4);
  const rest = articles.slice(4);

  // Trending for this category
  const trending = [...articles]
    .sort((a, b) => (b.commentCount ?? 0) + (b.points ?? 0) - (a.commentCount ?? 0) - (a.points ?? 0))
    .slice(0, 6);

  return (
    <>
      {/* Section header */}
      <div className="pt-8 pb-6 border-b border-border">
        <div className="section-divider mb-3 w-16" />
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{cat.label}</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {articles.length} article{articles.length === 1 ? "" : "s"} from across the web
        </p>
      </div>

      {/* Top stories for category */}
      {topStories.length >= 2 && (
        <TopStories articles={topStories} />
      )}

      {/* Latest + Sidebar */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="section-divider mb-4 w-full" />
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2">More {cat.label}</h2>
            <div>
              {rest.map((article, i) => (
                <ArticleListItem key={article.id} article={article} index={i} />
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <TrendingSidebar articles={trending} />
          </div>
        </div>
      )}
    </>
  );
}
