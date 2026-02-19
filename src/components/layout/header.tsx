import Link from "next/link";
import { getSiteSettings } from "@/lib/queries/globals";
import { getCategories } from "@/lib/queries/categories";
import { MobileMenu } from "./mobile-menu";
import { SearchButton } from "./search-button";

export async function Header() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-ink-800)] bg-[var(--color-ink-950)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-ink-950)]/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-[var(--spacing-page)]">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <MobileMenu categories={categories} />

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)]">
              {settings.siteName || "The Daily Chronicle"}
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-sm font-medium text-[var(--color-ink-200)] transition-colors hover:text-white"
            >
              {category.name}
            </Link>
          ))}
          {categories.length > 5 && (
            <Link
              href="/categories"
              className="text-sm font-medium text-[var(--color-ink-400)] transition-colors hover:text-white"
            >
              More
            </Link>
          )}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <SearchButton />
        </div>
      </div>
    </header>
  );
}
