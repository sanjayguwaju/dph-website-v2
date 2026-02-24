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
        className="flex items-center gap-2 rounded bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--brand-blue)] border border-[var(--brand-blue)] transition-all hover:bg-[var(--brand-blue)] hover:text-white group"
        aria-label="Search"
      >
        <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span className="hidden sm:inline font-bold">Search</span>
        <kbd className="hidden items-center gap-1 rounded bg-[var(--muted)] px-1 font-mono text-[10px] text-[var(--muted-foreground)] md:inline-flex border border-[var(--border)]">
          Ctrl K
        </kbd>
      </button>

      {/* Search modal overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Search modal */}
      <div
        className={cn(
          "fixed inset-x-4 top-[15vh] z-[101] mx-auto max-w-2xl transform transition-all duration-300 ease-out",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-8 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-colors duration-300">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-[var(--border)] px-4">
              <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="h-14 flex-1 bg-transparent px-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--brand-red)]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </form>

          <div className="bg-[var(--muted)] p-3 flex justify-between items-center transition-colors duration-300">
            <p className="text-[11px] text-[var(--muted-foreground)] flex gap-2">
              <span>Press <kbd className="rounded bg-[var(--card)] border border-[var(--border)] px-1 font-mono">Enter</kbd> to search</span>
              <span className="opacity-50">|</span>
              <span>Press <kbd className="rounded bg-[var(--card)] border border-[var(--border)] px-1 font-mono">Esc</kbd> to close</span>
            </p>
            <div className="text-[var(--brand-blue)] font-bold text-xs">DPH Search</div>
          </div>
        </div>
      </div>
    </>
  );
}
