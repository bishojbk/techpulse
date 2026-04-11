"use client";

import { Article, getCategoryMeta } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { openUrl } from "@/lib/open-url";

export function TopStories({ articles }: { articles: Article[] }) {
  return (
    <section className="border-b border-border py-8">
      <div className="section-divider mb-4 w-full" />
      <h2 className="text-xs font-bold uppercase tracking-wider mb-5">Top Stories</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article, i) => (
          <TopStoryCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}

function TopStoryCard({ article, index }: { article: Article; index: number }) {
  const cat = getCategoryMeta(article.category);
  const hasImage = !!article.imageUrl;

  return (
    <article
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
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
      {/* Only show image if the article actually has one */}
      {hasImage && (
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-muted mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      )}

      {/* No image: show a colored top accent bar instead */}
      {!hasImage && (
        <div className="mb-3 h-[3px] w-10 bg-primary/40 group-hover:bg-primary transition-colors" />
      )}

      <span className="term-tag">{cat.label}</span>

      <h3 className="mt-1 text-[15px] font-bold leading-snug line-clamp-3">
        <span className="headline-hover">{article.title}</span>
      </h3>

      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
        {article.excerpt}
      </p>

      <div className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.sourceIcon} alt="" className="h-3.5 w-3.5 rounded-sm" loading="lazy" />
        <span className="font-medium">{article.source}</span>
        <span>&middot;</span>
        <time dateTime={article.publishedAt}>{relativeTime(article.publishedAt)}</time>
      </div>
    </article>
  );
}
