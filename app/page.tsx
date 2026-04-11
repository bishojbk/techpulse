"use client";

import { useArticlesContext } from "@/hooks/articles-context";
import { ArticleSkeletonGrid } from "@/components/article-skeleton";
import { LeadStory } from "@/components/lead-story";
import { TopStories } from "@/components/top-stories";
import { ArticleListItem } from "@/components/article-list-item";
import { TrendingSidebar } from "@/components/trending-sidebar";
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

  // Split articles into sections
  const lead = articles[0];
  const topStories = articles.slice(1, 5);
  const latestArticles = articles.slice(5);

  // "Trending" = articles with most comments/points (or just pick a different slice)
  const trending = [...articles]
    .sort((a, b) => (b.commentCount ?? 0) + (b.points ?? 0) - (a.commentCount ?? 0) - (a.points ?? 0))
    .slice(0, 8);

  return (
    <>
      {/* Lead story */}
      <section className="py-8">
        <LeadStory article={lead} />
      </section>

      {/* Top stories row */}
      {topStories.length > 0 && (
        <TopStories articles={topStories} />
      )}

      {/* Main content: Latest feed + Trending sidebar */}
      <div className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-3">
        {/* Latest feed — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="section-divider mb-4 w-full" />
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1">Latest</h2>
          <p className="text-[11px] text-muted-foreground mb-2">
            {articles.length} articles from {new Set(articles.map((a) => a.source)).size} sources
          </p>

          <div>
            {latestArticles.map((article, i) => (
              <ArticleListItem key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>

        {/* Trending sidebar — 1/3 width */}
        <div className="hidden lg:block">
          <TrendingSidebar articles={trending} />
        </div>
      </div>
    </>
  );
}
