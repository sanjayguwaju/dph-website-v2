import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Eye, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/RichText";
import { formatDate, formatReadTime, formatNumber } from "@/utils/format";
import { getImageUrl, getImageAlt } from "@/utils/image";
import { getCategoryUrl, getAuthorUrl, absoluteUrl, getArticleUrl } from "@/utils/url";

interface ArticleContentProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: any;
    featuredImage?: any | null;
    publishedDate: string;
    readTime?: number | null;
    views?: number | null;
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
          role?: string | null;
          bio?: string | null;
          avatar?: any;
        }
      | string;
    tags?: Array<{ id: string; name: string; slug: string } | string> | null;
  };
}

export function ArticleContent({ article }: ArticleContentProps) {
  const category = typeof article.category === "object" ? article.category : null;
  const author = typeof article.author === "object" ? article.author : null;
  const tags = article.tags?.filter(
    (tag): tag is { id: string; name: string; slug: string } => typeof tag === "object",
  );

  const shareUrl = absoluteUrl(getArticleUrl(article.slug));
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="px-page container mx-auto">
      {/* Header */}
      <header className="mx-auto max-w-4xl pt-8 lg:pt-12">
        <div className="mb-4 flex items-center gap-3">
          {category && (
            <Link href={getCategoryUrl(category.slug)}>
              <Badge variant="category" color={category.color || "#3b82f6"}>
                {category.name}
              </Badge>
            </Link>
          )}
        </div>

        <h1 className="text-ink-50 text-3xl leading-tight font-bold text-balance sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <p className="text-ink-300 mt-4 text-lg text-pretty lg:text-xl">{article.excerpt}</p>

        {/* Meta */}
        <div className="border-ink-800 mt-6 flex flex-wrap items-center gap-4 border-y py-4">
          {author && (
            <Link
              href={getAuthorUrl(author.slug)}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              {author.avatar && (
                <Image
                  src={getImageUrl(author.avatar, "thumbnail")}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <span className="text-ink-100 block text-sm font-medium">{author.name}</span>
                {author.role && <span className="text-ink-400 block text-xs">{author.role}</span>}
              </div>
            </Link>
          )}

          <div className="text-ink-400 ml-auto flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedDate}>
                {formatDate(article.publishedDate, "short")}
              </time>
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatReadTime(article.readTime)}
              </span>
            )}
            {article.views && article.views > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {formatNumber(article.views)} views
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <figure className="mx-auto mt-8 max-w-5xl">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={getImageUrl(article.featuredImage, "desktop")}
            alt={getImageAlt(article.featuredImage)}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
        {article.featuredImage?.caption && (
          <figcaption className="text-ink-400 mt-3 text-center text-sm">
            {article.featuredImage.caption}
            {article.featuredImage.credit && (
              <span className="text-ink-500 ml-1">({article.featuredImage.credit})</span>
            )}
          </figcaption>
        )}
      </figure>

      {/* Content */}
      <div className="mx-auto mt-8 max-w-3xl lg:mt-12">
        <div className="prose-editorial">
          <RichText data={article.content} className="text-ink-200 text-lg leading-relaxed" />
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="border-ink-800 mt-8 flex flex-wrap items-center gap-2 border-t pt-8">
            <span className="text-ink-400 mr-2 text-sm">Tags:</span>
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="bg-ink-800 text-ink-300 hover:bg-ink-700 rounded-full px-3 py-1 text-sm transition-colors hover:text-white"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="border-ink-800 mt-8 flex items-center justify-between gap-4 border-t py-6">
          <div className="text-ink-400 flex items-center gap-2 text-sm">
            <Share2 className="h-4 w-4" />
            <span>Share this article</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-400 hover:bg-ink-800 rounded-lg p-2 transition-colors hover:text-white"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-400 hover:bg-ink-800 rounded-lg p-2 transition-colors hover:text-white"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-400 hover:bg-ink-800 rounded-lg p-2 transition-colors hover:text-white"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Author bio */}
        {author && (
          <div className="border-ink-800 bg-ink-900 mt-8 rounded-xl border p-6">
            <div className="flex items-start gap-4">
              {author.avatar && (
                <Image
                  src={getImageUrl(author.avatar, "thumbnail")}
                  alt={author.name}
                  width={64}
                  height={64}
                  className="shrink-0 rounded-full object-cover"
                />
              )}
              <div>
                <Link
                  href={getAuthorUrl(author.slug)}
                  className="text-ink-100 text-lg font-semibold transition-colors hover:text-white"
                >
                  {author.name}
                </Link>
                {author.role && <p className="text-ink-400 mt-0.5 text-sm">{author.role}</p>}
                {author.bio && (
                  <p className="text-ink-300 mt-2 text-sm leading-relaxed">{author.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
