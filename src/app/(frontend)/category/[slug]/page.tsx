import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/queries/categories";
import { getArticles } from "@/lib/queries/articles";
import { ArticleGrid } from "@/components/article";
import { CategoryNav, Pagination, NewsletterSection } from "@/components/sections";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} News`,
    description: category.description || `Latest news and articles in ${category.name}`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

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

  return (
    <>
      <CategoryNav categories={categories} activeSlug={slug} />

      <div className="container mx-auto px-[var(--spacing-page)] py-[var(--spacing-section)]">
        {/* Category header */}
        <header className="mb-12">
          <h1 className="text-4xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)] lg:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-400)]">
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
            <p className="text-[var(--color-ink-400)]">No articles found in this category yet.</p>
          </div>
        )}
      </div>

      <NewsletterSection />
    </>
  );
}
