"use client";

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

import { useState, useEffect } from "react";
import { getLocaleClient } from "@/utils/locale-client";

export function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  const [locale, setLocale] = useState("ne");

  useEffect(() => {
    setLocale(getLocaleClient());
  }, []);

  return (
    <div className="border-b border-[#E0E0E0] bg-white">
      <div className="container mx-auto px-4">
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-3">
          <Link
            href="/"
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${!activeSlug
              ? "bg-[var(--brand-blue)] text-white"
              : "text-[#666666] hover:bg-[#F3EFE7] hover:text-[#222222]"
              }`}
          >
            {locale === "ne" ? "सबै" : "All"}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryUrl(category.slug)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeSlug === category.slug
                ? "bg-[var(--brand-blue)] text-white"
                : "text-[#666666] hover:bg-[#F3EFE7] hover:text-[#222222]"
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
