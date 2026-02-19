import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";
import { formatDate } from "@/utils/format";
import { getArticleUrl } from "@/utils/url";

interface TrendingSectionProps {
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

export function TrendingSection({ articles }: TrendingSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-ink-800 py-section border-y">
      <div className="px-page container mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="text-crimson h-6 w-6" />
          <h2 className="text-ink-50 text-2xl font-bold">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {articles.map((article, index) => (
            <div key={article.id} className="group flex items-start gap-4">
              <span className="text-ink-700 group-hover:text-crimson shrink-0 text-4xl font-bold transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={getArticleUrl(article.slug)}>
                  <h3 className="text-ink-200 line-clamp-2 font-medium transition-colors group-hover:text-white">
                    {article.title}
                  </h3>
                </Link>
                <time dateTime={article.publishedDate} className="text-ink-500 mt-1 block text-xs">
                  {formatDate(article.publishedDate, "relative")}
                </time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
