import Link from "next/link";
import { getCategoryUrl } from "@/utils/url";

interface CategoryNavProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string | null;
  }>;
  activeSlug?: string;
}

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  return (
    <div className="border-b border-[var(--color-ink-800)] bg-[var(--color-ink-900)]/50">
      <div className="container mx-auto px-[var(--spacing-page)]">
        <div className="scrollbar-hide flex items-center gap-1 overflow-x-auto py-3">
          <Link
            href="/"
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeSlug
                ? "bg-[var(--color-crimson)] text-white"
                : "text-[var(--color-ink-300)] hover:bg-[var(--color-ink-800)] hover:text-white"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryUrl(category.slug)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeSlug === category.slug
                  ? "bg-[var(--color-crimson)] text-white"
                  : "text-[var(--color-ink-300)] hover:bg-[var(--color-ink-800)] hover:text-white"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
