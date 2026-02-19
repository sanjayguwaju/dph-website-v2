import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { getArticleUrl } from "@/utils/url";

interface BreakingNewsProps {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
}

export function BreakingNews({ articles }: BreakingNewsProps) {
  if (articles.length === 0) return null;

  return (
    <div className="overflow-hidden bg-[var(--color-crimson)] text-white">
      <div className="container mx-auto px-[var(--spacing-page)]">
        <div className="flex h-10 items-center">
          <div className="flex flex-shrink-0 items-center gap-2 border-r border-white/20 pr-4">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-bold tracking-wider uppercase">Breaking</span>
          </div>

          <div className="ml-4 flex-1 overflow-hidden">
            <div className="ticker-animation flex items-center gap-8 whitespace-nowrap">
              {/* Duplicate the articles for seamless loop */}
              {[...articles, ...articles].map((article, index) => (
                <Link
                  key={`${article.id}-${index}`}
                  href={getArticleUrl(article.slug)}
                  className="text-sm hover:underline"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
