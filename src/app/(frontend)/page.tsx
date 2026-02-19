import { Metadata } from "next";
import { getArticles, getTrendingArticles } from "@/lib/queries/articles";
import { getCategories } from "@/lib/queries/categories";
import { getSiteSettings } from "@/lib/queries/globals";
import { FeaturedArticle, ArticleCard, ArticleGrid } from "@/components/article";
import {
  BreakingNews,
  TrendingSection,
  CategoryNav,
  NewsletterSection,
} from "@/components/sections";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.siteName || "The Daily Chronicle",
    description:
      settings.siteDescription || "Your trusted source for breaking news and in-depth reporting",
  };
}

export default async function HomePage() {
  // Parallel data fetching for optimal performance
  const [featuredArticles, breakingNews, latestArticles, trendingArticles, categories] =
    await Promise.all([
      getArticles({ featured: true, limit: 4 }),
      getArticles({ breaking: true, limit: 5 }),
      getArticles({ limit: 12 }),
      getTrendingArticles(5),
      getCategories(),
    ]);

  const heroArticle = featuredArticles.docs[0];
  const secondaryFeatured = featuredArticles.docs.slice(1, 4);

  return (
    <>
      {/* Breaking News Ticker */}
      {breakingNews.docs.length > 0 && <BreakingNews articles={breakingNews.docs} />}

      {/* Category Navigation */}
      <CategoryNav categories={categories} />

      {/* Hero Section */}
      <section className="container mx-auto px-[var(--spacing-page)] py-8">
        {heroArticle && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main hero article */}
            <div className="lg:col-span-2">
              <FeaturedArticle article={heroArticle} variant="hero" priority />
            </div>

            {/* Secondary featured articles */}
            <div className="flex flex-col gap-4">
              {secondaryFeatured.map((article, index) => (
                <FeaturedArticle
                  key={article.id}
                  article={article}
                  variant="standard"
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Trending Section */}
      {trendingArticles.length > 0 && <TrendingSection articles={trendingArticles} />}

      {/* Latest Articles */}
      <section className="container mx-auto px-[var(--spacing-page)] py-[var(--spacing-section)]">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)]">
            Latest News
          </h2>
          <a
            href="/category/all"
            className="text-sm text-[var(--color-ink-400)] transition-colors hover:text-white"
          >
            View all →
          </a>
        </div>

        <ArticleGrid articles={latestArticles.docs} columns={4} />
      </section>

      {/* Category Sections */}
      {categories.slice(0, 3).map(async (category) => {
        const categoryArticles = await getArticles({
          category: category.id,
          limit: 4,
        });

        if (categoryArticles.docs.length === 0) return null;

        return (
          <section
            key={category.id}
            className="container mx-auto border-t border-[var(--color-ink-800)] px-[var(--spacing-page)] py-[var(--spacing-section)]"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)]">
                {category.name}
              </h2>
              <a
                href={`/category/${category.slug}`}
                className="text-sm text-[var(--color-ink-400)] transition-colors hover:text-white"
              >
                More in {category.name} →
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Featured category article */}
              <div className="lg:col-span-2">
                <FeaturedArticle article={categoryArticles.docs[0]} variant="large" />
              </div>

              {/* Category article list */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {categoryArticles.docs.slice(1, 4).map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
}
