"use client";

import { useParams } from "next/navigation";
import { useArticlesContext } from "@/hooks/articles-context";
import { ArticleSkeletonGrid } from "@/components/article-skeleton";
import { LeadStory } from "@/components/lead-story";
import { DenseRow } from "@/components/dense-row";
import { AsideRail } from "@/components/aside-rail";
import { EmptyState } from "@/components/empty-state";
import { SectionTabs } from "@/components/section-tabs";
import { CATEGORIES, type CategoryType } from "@/lib/types";

const validSlugs = CATEGORIES.map((c) => c.slug);

export function CategoryPageClient() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug as CategoryType;
  const { articles: allArticles, loading } = useArticlesContext();

  const cat = CATEGORIES.find((c) => c.slug === slug);

  if (loading) return <ArticleSkeletonGrid />;

  if (!cat || !validSlugs.includes(slug)) {
    return (
      <>
        <SectionTabs active="all" />
        <EmptyState
          title="Section not found"
          description="That category doesn't exist on the wire."
          showBackLink
        />
      </>
    );
  }

  const articles = allArticles.filter((a) => a.category === slug);

  if (articles.length === 0) {
    return (
      <>
        <SectionTabs active={slug} />
        <CatHero label={cat.label} index={CATEGORIES.indexOf(cat) + 1} count={0} weekly={0} />
        <EmptyState
          title={`A quiet day in ${cat.label}`}
          description="Nothing has cleared the signal threshold for this section today. Try another section, or wait — feeds refresh every 10 minutes."
          category={slug}
          showBackLink
        />
      </>
    );
  }

  const lead = articles[0];
  const rest = articles.slice(1);

  let pCeil = 1;
  let cCeil = 1;
  for (const a of allArticles) {
    if ((a.points ?? 0) > pCeil) pCeil = a.points!;
    if ((a.commentCount ?? 0) > cCeil) cCeil = a.commentCount!;
  }
  const signalCeiling = { points: pCeil, comments: cCeil };

  // Articles in this category in the last 7 days for the "this week" stat
  const weekly = allArticles.filter(
    (a) =>
      a.category === slug &&
      Date.now() - new Date(a.publishedAt).getTime() <
        7 * 24 * 60 * 60 * 1000,
  ).length;

  return (
    <>
      <SectionTabs active={slug} />
      <CatHero
        label={cat.label}
        index={CATEGORIES.indexOf(cat) + 1}
        count={articles.length}
        weekly={weekly}
      />

      <div className="xl:grid xl:[grid-template-columns:minmax(0,1fr)_320px]">
        <div className="min-w-0 px-6 pt-8 pb-20 md:px-10">
          <LeadStory article={lead} />

          {rest.length > 0 && (
            <>
              <div className="section-head-jazz">
                <h2>
                  More in {cat.label.toLowerCase()}
                  <span className="ampers"> ·</span>
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
            </>
          )}
        </div>

        <AsideRail articles={articles} />
      </div>
    </>
  );
}

function CatHero({
  label,
  index,
  count,
  weekly,
}: {
  label: string;
  index: number;
  count: number;
  weekly: number;
}) {
  return (
    <header
      className="grid items-end gap-[32px]"
      style={{
        gridTemplateColumns: "1fr auto",
        padding: "40px 40px 24px",
        borderBottom: "2px solid var(--ink)",
        margin: "0 0 0 0",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 500,
          fontSize: "clamp(56px, 8vw, 84px)",
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          color: "var(--ink)",
          fontVariationSettings: '"opsz" 144, "SOFT" 30',
          textWrap: "balance",
        }}
      >
        <em
          style={{
            color: "var(--accent)",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          {label}
        </em>
      </h2>
      <div
        className="text-right"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          color: "var(--ink-3)",
          lineHeight: 1.7,
        }}
      >
        <div>SECTION № {String(index).padStart(2, "0")}</div>
        <div>
          {count} STORIES TODAY · {weekly} THIS WEEK
        </div>
      </div>
    </header>
  );
}
