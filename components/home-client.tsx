"use client";

import { useArticlesContext } from "@/hooks/articles-context";
import { ArticleSkeletonGrid } from "@/components/article-skeleton";
import { LeadStory } from "@/components/lead-story";
import { DenseRow } from "@/components/dense-row";
import { AsideRail } from "@/components/aside-rail";
import { EmptyState } from "@/components/empty-state";
import { DispatchHero } from "@/components/dispatch-hero";
import { TickerTape } from "@/components/ticker-tape";
import { SectionTabs } from "@/components/section-tabs";

export default function HomeClient() {
  const { articles, loading } = useArticlesContext();

  if (loading) return <ArticleSkeletonGrid />;

  if (articles.length === 0) {
    return (
      <>
        <DispatchHero />
        <SectionTabs active="all" />
        <EmptyState
          title="No stories on the wire"
          description="We're having trouble fetching feeds right now. Check back in a few minutes — auto-refresh runs every ten."
        />
      </>
    );
  }

  const lead = articles[0];
  const rest = articles.slice(1);

  let pCeil = 1;
  let cCeil = 1;
  for (const a of articles) {
    if ((a.points ?? 0) > pCeil) pCeil = a.points!;
    if ((a.commentCount ?? 0) > cCeil) cCeil = a.commentCount!;
  }
  const signalCeiling = { points: pCeil, comments: cCeil };

  return (
    <>
      <DispatchHero />
      <TickerTape articles={articles} />
      <SectionTabs active="all" />

      <div className="xl:grid xl:[grid-template-columns:minmax(0,1fr)_320px]">
        <div className="min-w-0 px-6 pt-8 pb-20 md:px-10">
          <LeadStory article={lead} />

          <div className="section-head-jazz">
            <h2>
              The Rest <span className="ampers">of</span> the Wire
            </h2>
            <div className="rule" />
            <span className="ct">{rest.length} stories</span>
          </div>

          <div>
            {rest.map((a) => (
              <DenseRow
                key={a.id}
                article={a}
                signalCeiling={signalCeiling}
              />
            ))}
          </div>
        </div>

        <AsideRail articles={articles} />
      </div>
    </>
  );
}
