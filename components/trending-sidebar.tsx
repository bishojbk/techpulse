"use client";

import { Article, getCategoryMeta } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { openUrl } from "@/lib/open-url";

export function TrendingSidebar({ articles }: { articles: Article[] }) {
  return (
    <aside className="lg:sticky lg:top-12">
      <div className="section-divider mb-4 w-full" />
      <h2 className="text-xs font-bold uppercase tracking-wider mb-1">Most Popular</h2>
      <p className="text-[11px] text-muted-foreground mb-4">Based on reader engagement</p>

      <div className="divide-y divide-border">
        {articles.map((article, i) => (
          <TrendingItem key={article.id} article={article} rank={i + 1} />
        ))}
      </div>
    </aside>
  );
}

function TrendingItem({ article, rank }: { article: Article; rank: number }) {
  const cat = getCategoryMeta(article.category);

  return (
    <article
      className="group flex gap-4 py-4 cursor-pointer"
      onClick={() => openUrl(article.url)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openUrl(article.url);
        }
      }}
    >
      <span className="trending-number">{String(rank).padStart(2, "0")}</span>

      <div className="flex flex-col min-w-0">
        <span className="term-tag">{cat.label}</span>

        <h3 className="mt-0.5 text-[14px] font-bold leading-snug line-clamp-3">
          <span className="headline-hover">{article.title}</span>
        </h3>

        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{article.source}</span>
          <span>&middot;</span>
          <time dateTime={article.publishedAt}>{relativeTime(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
