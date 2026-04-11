"use client";

import { Article, getCategoryMeta } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { openUrl } from "@/lib/open-url";
import { BookmarkButton } from "@/components/bookmark-button";

export function ArticleListItem({ article, index = 0 }: { article: Article; index?: number }) {
  const cat = getCategoryMeta(article.category);
  const delay = Math.min(index * 30, 300);
  const hasImage = !!article.imageUrl;

  return (
    <article
      className="group flex gap-4 border-b border-border py-5 cursor-pointer animate-fade-in-up"
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
    >
      {/* Text content */}
      <div className="flex flex-1 flex-col min-w-0">
        <span className="term-tag">{cat.label}</span>

        <h3 className="mt-1 text-[15px] font-bold leading-snug line-clamp-2 sm:text-base">
          <span className="headline-hover">{article.title}</span>
        </h3>

        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground line-clamp-2 hidden sm:block">
          {article.excerpt}
        </p>

        <div className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.sourceIcon}
            alt=""
            className="h-3.5 w-3.5 rounded-sm"
            loading="lazy"
          />
          <span className="font-medium">{article.source}</span>
          <span>&middot;</span>
          <time dateTime={article.publishedAt}>{relativeTime(article.publishedAt)}</time>
          {article.commentCount != null && (
            <>
              <span>&middot;</span>
              <span
                role="link"
                tabIndex={0}
                className="hover:text-foreground transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (article.hnUrl) openUrl(article.hnUrl);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && article.hnUrl) {
                    e.stopPropagation();
                    openUrl(article.hnUrl);
                  }
                }}
              >
                {article.commentCount} comments
              </span>
            </>
          )}
        </div>
      </div>

      {/* Only show thumbnail if the article has an actual image */}
      {hasImage && (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-muted sm:h-24 sm:w-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Bookmark */}
      <div className="flex shrink-0 items-start pt-1">
        <BookmarkButton article={article} />
      </div>
    </article>
  );
}
