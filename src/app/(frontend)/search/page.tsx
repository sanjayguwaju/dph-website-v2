import { Metadata } from "next";
import { Search } from "lucide-react";
import { searchArticles } from "@/lib/queries/articles";
import { ArticleGrid } from "@/components/article";
import { NewsletterSection } from "@/components/sections";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: q ? `Search results for "${q}"` : "Search",
    description: "Search our articles",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const articles = query ? await searchArticles(query, 24) : [];

  return (
    <>
      <div className="container mx-auto px-[var(--spacing-page)] py-[var(--spacing-section)]">
        {/* Search header */}
        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <Search className="h-8 w-8 text-[var(--color-crimson)]" />
            <h1 className="text-3xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)] lg:text-4xl">
              Search Results
            </h1>
          </div>
          {query && (
            <p className="text-lg text-[var(--color-ink-400)]">
              {articles.length} results for "{query}"
            </p>
          )}
        </header>

        {/* Search form */}
        <form action="/search" method="GET" className="mb-12 max-w-xl">
          <div className="flex gap-3">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search articles..."
              className="h-12 flex-1 rounded-lg border border-[var(--color-ink-600)] bg-[var(--color-ink-800)] px-4 text-base text-[var(--color-ink-100)] placeholder:text-[var(--color-ink-500)] focus:ring-2 focus:ring-[var(--color-crimson)] focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 rounded-lg bg-[var(--color-crimson)] px-6 font-medium text-white transition-colors hover:bg-[var(--color-crimson-dark)]"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {query ? (
          articles.length > 0 ? (
            <ArticleGrid articles={articles} columns={3} />
          ) : (
            <div className="py-12 text-center">
              <p className="mb-4 text-[var(--color-ink-400)]">No articles found for "{query}"</p>
              <p className="text-sm text-[var(--color-ink-500)]">
                Try different keywords or browse our categories
              </p>
            </div>
          )
        ) : (
          <div className="py-12 text-center">
            <p className="text-[var(--color-ink-400)]">Enter a search term to find articles</p>
          </div>
        )}
      </div>

      <NewsletterSection />
    </>
  );
}
