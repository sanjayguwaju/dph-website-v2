import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";
import { ArticleContent, RelatedArticles } from "@/components/article";
import { NewsletterSection } from "@/components/sections";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const category = typeof article.category === "object" ? article.category : null;
  const featuredImage = typeof article.featuredImage === "object" ? article.featuredImage : null;

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedDate,
      section: category?.name,
      images: featuredImage?.url
        ? [
            {
              url: featuredImage.url,
              width: 1200,
              height: 630,
              alt: featuredImage.alt || article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: featuredImage?.url ? [featuredImage.url] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get related articles
  const category = typeof article.category === "object" ? article.category : null;
  const relatedArticles = category ? await getRelatedArticles(article.id, category.id, 4) : [];

  // Increment views (non-blocking)
  // This would typically be done via a server action
  // incrementArticleViews(article.id).catch(console.error)

  return (
    <article>
      <ArticleContent article={article} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}

      {/* Newsletter Section */}
      <NewsletterSection />
    </article>
  );
}
