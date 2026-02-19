"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MobileMenuProps {
  categories: Category[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-2 text-[var(--color-ink-300)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-[var(--color-ink-800)] bg-[var(--color-ink-900)] transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-ink-800)] px-4">
          <span className="text-lg font-[var(--font-display)] font-bold text-[var(--color-ink-50)]">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-[var(--color-ink-300)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            <p className="px-3 py-2 text-xs font-semibold tracking-wider text-[var(--color-ink-400)] uppercase">
              Categories
            </p>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-200)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 space-y-1 border-t border-[var(--color-ink-800)] pt-6">
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-200)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-200)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
