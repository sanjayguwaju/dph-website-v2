import { ArticleCard } from "./article-card";

interface ArticleGridProps {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: any;
    publishedDate: string;
    readTime?: number | null;
    category?: any;
    author?: any;
  }>;
  columns?: 2 | 3 | 4;
}

export function ArticleGrid({ articles, columns = 4 }: ArticleGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} priority={index < 4} />
      ))}
    </div>
  );
}
