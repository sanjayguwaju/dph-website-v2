import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatReadTime } from "@/utils/format";
import { getImageUrl, getImageAlt } from "@/utils/image";
import { getArticleUrl, getCategoryUrl } from "@/utils/url";

interface FeaturedArticleProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: any;
    publishedDate: string;
    readTime?: number | null;
    breaking?: boolean | null;
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
        }
      | string;
  };
  variant?: "hero" | "large" | "standard";
  priority?: boolean;
}

export function FeaturedArticle({
  article,
  variant = "standard",
  priority = false,
}: FeaturedArticleProps) {
  const category = typeof article.category === "object" ? article.category : null;
  const author = typeof article.author === "object" ? article.author : null;

  if (variant === "hero") {
    return (
      <article className="group relative aspect-video overflow-hidden rounded-xl lg:aspect-21/9">
        <Link href={getArticleUrl(article.slug)}>
          <Image
            src={getImageUrl(article.featuredImage, "desktop")}
            alt={getImageAlt(article.featuredImage)}
            fill
            priority={priority}
            className="image-zoom object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              {article.breaking && <Badge variant="breaking">Breaking</Badge>}
              {category && (
                <Link href={getCategoryUrl(category.slug)}>
                  <Badge variant="category" color={category.color || "#3b82f6"}>
                    {category.name}
                  </Badge>
                </Link>
              )}
            </div>

            <Link href={getArticleUrl(article.slug)}>
              <h1 className="group-hover:text-ink-100 text-2xl leading-tight font-bold text-balance text-white transition-colors sm:text-3xl lg:text-4xl">
                {article.title}
              </h1>
            </Link>

            <p className="text-ink-200 mt-4 line-clamp-2 max-w-2xl text-base lg:text-lg">
              {article.excerpt}
            </p>

            <div className="text-ink-300 mt-6 flex items-center gap-4 text-sm">
              {author && <span className="font-medium text-white">{author.name}</span>}
              <time dateTime={article.publishedDate}>
                {formatDate(article.publishedDate, "relative")}
              </time>
              {article.readTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatReadTime(article.readTime)}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "large") {
    return (
      <article className="group relative aspect-4/3 overflow-hidden rounded-xl">
        <Link href={getArticleUrl(article.slug)}>
          <Image
            src={getImageUrl(article.featuredImage, "tablet")}
            alt={getImageAlt(article.featuredImage)}
            fill
            priority={priority}
            className="image-zoom object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-3 flex items-center gap-2">
            {article.breaking && <Badge variant="breaking">Breaking</Badge>}
            {category && (
              <Link href={getCategoryUrl(category.slug)}>
                <Badge variant="category" color={category.color || "#3b82f6"}>
                  {category.name}
                </Badge>
              </Link>
            )}
          </div>

          <Link href={getArticleUrl(article.slug)}>
            <h2 className="group-hover:text-ink-100 line-clamp-3 text-xl leading-tight font-bold text-white transition-colors">
              {article.title}
            </h2>
          </Link>

          <div className="text-ink-300 mt-3 flex items-center gap-3 text-xs">
            {author && <span className="font-medium text-white">{author.name}</span>}
            <time dateTime={article.publishedDate}>
              {formatDate(article.publishedDate, "relative")}
            </time>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative aspect-16/10 overflow-hidden rounded-lg">
      <Link href={getArticleUrl(article.slug)}>
        <Image
          src={getImageUrl(article.featuredImage, "card")}
          alt={getImageAlt(article.featuredImage)}
          fill
          priority={priority}
          className="image-zoom object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
      </Link>

      <div className="absolute inset-x-0 bottom-0 p-4">
        {category && (
          <Link href={getCategoryUrl(category.slug)} className="mb-2 block">
            <Badge variant="category" color={category.color || "#3b82f6"}>
              {category.name}
            </Badge>
          </Link>
        )}

        <Link href={getArticleUrl(article.slug)}>
          <h3 className="group-hover:text-ink-100 line-clamp-2 text-base leading-tight font-semibold text-white transition-colors">
            {article.title}
          </h3>
        </Link>
      </div>
    </article>
  );
}
