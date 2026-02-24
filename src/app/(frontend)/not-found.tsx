"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <div className="relative mb-12">
          <span className="text-[12rem] font-black tracking-tighter text-[var(--brand-blue)]/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-extrabold text-[var(--brand-blue)] mb-2">
              Page Not Found
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-md mx-auto">
              The page you are looking for does not exist.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <Button className="gap-2 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/90 h-11 px-6">
              <Home size={18} />
              Back to Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="gap-2 border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white h-11 px-6">
              <Search size={18} />
              Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

