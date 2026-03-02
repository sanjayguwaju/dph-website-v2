"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocaleClient } from "@/utils/locale-client";
import { toNepaliNum } from "@/utils/nepali-date";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const [locale, setLocale] = useState("ne");

  useEffect(() => {
    setLocale(getLocaleClient());
  }, []);

  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  const rangeStart = Math.max(2, currentPage - 1);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

  // Add ellipsis if needed before range
  if (rangeStart > 2) {
    pages.push("ellipsis");
  }

  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Add ellipsis if needed after range
  if (rangeEnd < totalPages - 1) {
    pages.push("ellipsis");
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  const labels = {
    previous: locale === "ne" ? "अघिल्लो" : "Previous",
    next: locale === "ne" ? "अर्को" : "Next",
    pagination: locale === "ne" ? "पृष्ठ संख्या" : "Pagination",
  };

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label={labels.pagination}>
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[var(--color-ink-300)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{labels.previous}</span>
        </Link>
      ) : (
        <span className="flex cursor-not-allowed items-center gap-1 px-3 py-2 text-sm text-[var(--color-ink-600)]">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{labels.previous}</span>
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-sm text-[var(--color-ink-500)]"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={cn(
                "min-w-[40px] rounded-lg px-3 py-2 text-center text-sm transition-colors font-bold",
                currentPage === page
                  ? "bg-[var(--color-crimson)] text-white"
                  : "text-[var(--color-ink-300)] hover:bg-[var(--color-ink-800)] hover:text-white",
              )}
            >
              {locale === "ne" ? toNepaliNum(page) : page}
            </Link>
          ),
        )}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[var(--color-ink-300)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
        >
          <span className="hidden sm:inline">{labels.next}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex cursor-not-allowed items-center gap-1 px-3 py-2 text-sm text-[var(--color-ink-600)]">
          <span className="hidden sm:inline">{labels.next}</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
