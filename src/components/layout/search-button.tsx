"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[var(--color-ink-800)] px-3 py-2 text-sm text-[var(--color-ink-400)] transition-colors hover:bg-[var(--color-ink-700)]"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden items-center gap-1 rounded bg-[var(--color-ink-700)] px-1.5 py-0.5 font-mono text-xs md:inline-flex">
          ⌘K
        </kbd>
      </button>

      {/* Search modal overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Search modal */}
      <div
        className={cn(
          "fixed inset-x-4 top-24 z-50 mx-auto max-w-2xl transform transition-all duration-200",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-xl border border-[var(--color-ink-700)] bg-[var(--color-ink-900)] shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-[var(--color-ink-800)] px-4">
              <Search className="h-5 w-5 text-[var(--color-ink-400)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, authors..."
                className="h-14 flex-1 bg-transparent px-4 text-[var(--color-ink-100)] placeholder:text-[var(--color-ink-500)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-[var(--color-ink-400)] transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="p-4">
            <p className="text-xs text-[var(--color-ink-500)]">
              Press{" "}
              <kbd className="rounded bg-[var(--color-ink-800)] px-1.5 py-0.5 font-mono text-xs">
                Enter
              </kbd>{" "}
              to search or{" "}
              <kbd className="rounded bg-[var(--color-ink-800)] px-1.5 py-0.5 font-mono text-xs">
                Esc
              </kbd>{" "}
              to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
