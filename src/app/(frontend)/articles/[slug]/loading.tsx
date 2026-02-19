import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoading() {
  return (
    <div className="container mx-auto px-[var(--spacing-page)]">
      {/* Header skeleton */}
      <header className="mx-auto max-w-4xl pt-8 lg:pt-12">
        <Skeleton className="mb-4 h-6 w-24" />
        <Skeleton className="mb-2 h-12 w-full" />
        <Skeleton className="mb-4 h-12 w-3/4" />
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />

        <div className="mt-6 flex items-center gap-4 border-y border-[var(--color-ink-800)] py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </header>

      {/* Featured image skeleton */}
      <div className="mx-auto mt-8 max-w-5xl">
        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
      </div>

      {/* Content skeleton */}
      <div className="mx-auto mt-8 max-w-3xl space-y-4 lg:mt-12">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  );
}
