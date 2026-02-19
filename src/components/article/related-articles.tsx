import { ArticleCard } from "./article-card";

interface RelatedArticlesProps {
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
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="px-page py-section container mx-auto">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-ink-50 mb-8 text-2xl font-bold">Related Articles</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
