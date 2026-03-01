import { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatReadTime } from "@/utils/format";
import { getImageUrl, getImageAlt } from "@/utils/image";
import { getArticleUrl, getCategoryUrl } from "@/utils/url";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: any;
    publishedDate: string;
    readTime?: number | null;
    category?:
    | {
      id: string;
      name: string;
      slug: string;
      color?: string | null;
    }
    | string;
    author?:
    | {
      id: string;
      name: string;
      slug: string;
      avatar?: any;
    }
    | string;
  };
  variant?: "default" | "horizontal" | "compact";
  priority?: boolean;
}

export const ArticleCard = memo(function ArticleCard({ article, variant = "default", priority = false }: ArticleCardProps) {
  const category = useMemo(() => typeof article.category === "object" ? article.category : null, [article.category]);
  const author = useMemo(() => typeof article.author === "object" ? article.author : null, [article.author]);

  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4">
        <Link
          href={getArticleUrl(article.slug)}
          className="relative aspect-4/3 w-32 shrink-0 overflow-hidden rounded-lg"
        >
          <Image
            src={getImageUrl(article.featuredImage, "thumbnail")}
            alt={getImageAlt(article.featuredImage)}
            fill
            className="image-zoom object-cover"
            sizes="128px"
          />
        </Link>
        <div className="min-w-0 flex-1">
          {category && (
            <Link href={getCategoryUrl(category.slug)}>
              <Badge variant="category" color={category.color || "#3b82f6"} className="mb-2">
                {category.name}
              </Badge>
            </Link>
          )}
          <Link href={getArticleUrl(article.slug)}>
            <h3 className="text-ink-100 line-clamp-2 text-base font-semibold transition-colors group-hover:text-white">
              {article.title}
            </h3>
          </Link>
          <div className="text-ink-400 mt-2 flex items-center gap-2 text-xs">
            <time dateTime={article.publishedDate}>
              {formatDate(article.publishedDate, "relative")}
            </time>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link href={getArticleUrl(article.slug)}>
          <h3 className="text-ink-200 line-clamp-2 text-sm font-medium transition-colors group-hover:text-white">
            {article.title}
          </h3>
        </Link>
        <time dateTime={article.publishedDate} className="text-ink-500 mt-1 block text-xs">
          {formatDate(article.publishedDate, "relative")}
        </time>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      <Link
        href={getArticleUrl(article.slug)}
        className="relative mb-4 aspect-16/10 overflow-hidden rounded-lg"
      >
        <Image
          src={getImageUrl(article.featuredImage, "card")}
          alt={getImageAlt(article.featuredImage)}
          fill
          priority={priority}
          className="image-zoom object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        {category && (
          <Link href={getCategoryUrl(category.slug)} className="mb-2">
            <Badge variant="category" color={category.color || "#3b82f6"}>
              {category.name}
            </Badge>
          </Link>
        )}

        <Link href={getArticleUrl(article.slug)}>
          <h2 className="text-ink-100 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-white">
            {article.title}
          </h2>
        </Link>

        <p className="text-ink-400 mt-2 line-clamp-2 text-sm">{article.excerpt}</p>

        <div className="border-ink-800 mt-4 flex items-center gap-3 border-t pt-4">
          {author && <span className="text-ink-300 text-sm">{author.name}</span>}
          <div className="text-ink-500 flex items-center gap-3 text-xs">
            <time dateTime={article.publishedDate}>
              {formatDate(article.publishedDate, "relative")}
            </time>
            {article.readTime && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatReadTime(article.readTime)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});
