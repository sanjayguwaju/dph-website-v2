import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="px-4 text-center">
        <div className="relative">
          <span className="text-[12rem] font-[var(--font-display)] font-bold text-[var(--color-ink-800)] select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)]">
                Page Not Found
              </h1>
              <p className="max-w-md text-[var(--color-ink-400)]">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="primary" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
