import { Article } from "@/lib/types";
import { ArticleCard } from "@/components/article-card";

interface ArticleGridProps {
  articles: Article[];
  showCategoryBadge?: boolean;
}

export function ArticleGrid({ articles, showCategoryBadge = true }: ArticleGridProps) {
  return (
    <div className="article-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>:last-child:nth-child(3n+1)]:sm:col-span-2 [&>:last-child:nth-child(3n+1)]:lg:col-span-2">
      {articles.map((article, i) => (
        <ArticleCard
          key={article.id}
          article={article}
          index={i}
          showCategoryBadge={showCategoryBadge}
        />
      ))}
    </div>
  );
}
