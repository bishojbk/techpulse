"use client";

import { Article, getCategoryMeta } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { getSourceGradient } from "@/lib/sources";
import { openUrl } from "@/lib/open-url";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/bookmark-button";

interface ArticleCardProps {
  article: Article;
  index?: number;
  showCategoryBadge?: boolean;
}

export function ArticleCard({ article, index = 0, showCategoryBadge = true }: ArticleCardProps) {
  const cat = getCategoryMeta(article.category);
  const delay = Math.min(index * 50, 400);

  return (
    <article
      className="animate-fade-in-up group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:border-foreground/15"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => openUrl(article.url)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openUrl(article.url);
        }
      }}
      aria-label={`${article.title} — ${article.source}`}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {article.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Dark gradient overlay on real images */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </>
        ) : (
          <div
            className="noise-overlay relative flex h-full w-full items-center justify-center"
            style={{ background: getSourceGradient(article.source, index) }}
          >
            {/* Source logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.sourceIcon}
              alt=""
              className="relative z-10 h-10 w-10 rounded opacity-30"
              loading="lazy"
            />
            {/* Category watermark */}
            <span className="absolute bottom-2 right-3 z-10 text-[10px] font-semibold uppercase tracking-widest text-white/15">
              {cat.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Source row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.sourceIcon}
            alt=""
            className="h-4 w-4 rounded"
            loading="lazy"
          />
          <span className="font-medium">{article.source}</span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{relativeTime(article.publishedAt)}</time>
        </div>

        {/* Title */}
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {showCategoryBadge && (
              <Badge variant="outline" className={`text-[10px] px-2 py-0 border ${cat.color}`}>
                {cat.label}
              </Badge>
            )}
            {article.hnUrl && (
              <span
                role="link"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  openUrl(article.hnUrl!);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    openUrl(article.hnUrl!);
                  }
                }}
                className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`${article.commentCount} comments on Hacker News`}
              >
                💬 {article.commentCount}
              </span>
            )}
          </div>
          <BookmarkButton article={article} />
        </div>
      </div>
    </article>
  );
}
