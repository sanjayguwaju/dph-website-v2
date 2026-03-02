import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";
import { ArticleContent, RelatedArticles } from "@/components/article";
import { NewsletterSection } from "@/components/sections";
import { getSiteSettings } from "@/lib/queries/globals";

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { getLocale } from "@/utils/locale-server";
import { PageLayout } from "@/components/layout/page-layout";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await getArticleBySlug(slug);
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  if (!article) {
    return {
      title: locale === "ne" ? `लेख फेला परेन | ${hospitalName}` : `Article Not Found | ${hospitalName}`,
    };
  }

  const category = typeof article.category === "object" ? article.category : null;
  const featuredImage = typeof article.featuredImage === "object" ? article.featuredImage : null;

  return {
    title: `${article.title} | ${hospitalName}`,
    description: article.excerpt,
    openGraph: {
      title: article.title as string,
      description: article.excerpt as string,
      type: "article",
      publishedTime: article.publishedDate as string,
      section: category?.name as string,
      images: featuredImage?.url
        ? [
          {
            url: featuredImage.url as string,
            width: 1200,
            height: 630,
            alt: (featuredImage.alt as string) || (article.title as string),
          },
        ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title as string,
      description: article.excerpt as string,
      images: featuredImage?.url ? [featuredImage.url as string] : [],
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

  return (
    <PageLayout
      breadcrumbs={[
        { label: article.title as string },
      ]}
      className="bg-[#fbfcff]"
      maxWidth="max-w-4xl"
    >
      <ArticleContent article={article} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}

      {/* Newsletter Section */}
      <NewsletterSection />
    </PageLayout>
  );
}
