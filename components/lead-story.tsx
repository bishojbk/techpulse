"use client";

import { Article, getCategoryMeta } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { openUrl } from "@/lib/open-url";
import { BookmarkButton } from "@/components/bookmark-button";

export function LeadStory({ article }: { article: Article }) {
  const cat = getCategoryMeta(article.category);
  const hasImage = !!article.imageUrl;

  return (
    <article
      className="group cursor-pointer border-b border-border pb-8"
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
      {hasImage ? (
        /* ── With image: side-by-side layout ── */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="eager"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="term-tag">{cat.label}</span>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              <span className="headline-hover">{article.title}</span>
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground line-clamp-3 lg:text-lg">
              {article.excerpt}
            </p>
            <LeadMeta article={article} />
          </div>
        </div>
      ) : (
        /* ── No image: full-width text hero ── */
        <div className="max-w-3xl">
          <span className="term-tag">{cat.label}</span>
          <h1 className="mt-2 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            <span className="headline-hover">{article.title}</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground line-clamp-3 lg:text-xl">
            {article.excerpt}
          </p>
          <LeadMeta article={article} />
        </div>
      )}
    </article>
  );
}

function LeadMeta({ article }: { article: Article }) {
  return (
    <div className="mt-4 flex items-center gap-3 text-[13px] text-muted-foreground">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.sourceIcon} alt="" className="h-4 w-4 rounded-sm" />
      <span className="font-medium text-foreground">{article.source}</span>
      <span>&middot;</span>
      <time dateTime={article.publishedAt}>{relativeTime(article.publishedAt)}</time>
      {article.commentCount != null && (
        <>
          <span>&middot;</span>
          <span
            role="link"
            tabIndex={0}
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
            className="cursor-pointer hover:text-foreground transition-colors"
          >
            {article.commentCount} comments
          </span>
        </>
      )}
      <div className="ml-auto">
        <BookmarkButton article={article} />
      </div>
    </div>
  );
}
