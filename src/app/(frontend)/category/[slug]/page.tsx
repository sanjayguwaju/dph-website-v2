import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/queries/categories";
import { getArticles } from "@/lib/queries/articles";
import { ArticleGrid } from "@/components/article";
import { CategoryNav, Pagination, NewsletterSection } from "@/components/sections";
import { getSiteSettings } from "@/lib/queries/globals";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

import { getLocale } from "@/utils/locale-server";
import { PageLayout } from "@/components/layout/page-layout";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const category = await getCategoryBySlug(slug);
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  if (!category) {
    return {
      title: locale === "ne" ? `कोटी फेला परेन | ${hospitalName}` : `Category Not Found | ${hospitalName}`,
    };
  }

  return {
    title: locale === "ne" ? `${category.name} | ${hospitalName}` : `${category.name} | ${hospitalName}`,
    description: category.description || (locale === "ne" ? `${category.name} को कोटीमा नवीनतम समाचार र लेखहरू` : `Latest news and articles in ${category.name}`),
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const locale = await getLocale();

  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getCategories()]);

  if (!category) {
    notFound();
  }

  const page = parseInt(pageParam || "1");
  const articles = await getArticles({
    category: category.id,
    page,
    limit: 12,
  });

  const labels = {
    empty: locale === "ne" ? "यस कोटीमा कुनै लेखहरू फेला परेनन् अझै।" : "No articles found in this category yet.",
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: category.name as string },
      ]}
      maxWidth="max-w-7xl"
    >
      <CategoryNav categories={categories} activeSlug={slug} />

      <div className="py-8">
        {/* Category header */}
        <header className="mb-12">
          <h1 className="text-4xl font-[var(--font-display)] font-bold text-black lg:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              {category.description}
            </p>
          )}
        </header>

        {/* Articles grid */}
        {articles.docs.length > 0 ? (
          <>
            <ArticleGrid articles={articles.docs} columns={3} />
            <Pagination
              currentPage={page}
              totalPages={articles.totalPages}
              basePath={`/category/${slug}`}
            />
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400 font-bold">{labels.empty}</p>
          </div>
        )}
      </div>

      <NewsletterSection />
    </PageLayout>
  );
}
