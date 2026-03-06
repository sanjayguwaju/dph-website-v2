import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded bg-[var(--color-ink-700)]/10 dark:bg-[var(--color-ink-700)]/5",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:content-['']",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent dark:before:via-white/10",
        className
      )}
    />
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[580px] w-full overflow-hidden bg-[var(--color-ink-700)]/5">
      <div className="container-refined relative h-full pt-32">
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-32 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="container-refined py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <ScrollReveal
            key={i}
            animation="flip-up"
            delay={i * 100}
          >
            <div className="flex flex-col rounded-[28px] border border-[var(--color-ink-700)]/10 p-6 space-y-4">
              <Skeleton className="h-6 w-32 mx-auto" />
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between gap-4 p-4 bg-[var(--color-ink-700)]/5 rounded-[20px]">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-ink-700)]/10 p-4">
      <Skeleton className="aspect-[16/10] w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-64" />
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TabsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 flex-shrink-0 rounded-full" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 rounded-lg border border-[var(--color-ink-700)]/10 p-4">
            <Skeleton className="h-12 w-12 flex-shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4 rounded-xl border border-[var(--color-ink-700)]/10 p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="w-full">
      <div className="container-refined py-8 flex justify-between items-center">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 max-w-xl flex flex-col items-center gap-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-24 w-16" />
      </div>
      <div className="bg-[var(--brand-blue)]/10 h-14 w-full">
        <div className="container-refined h-full flex items-center gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-24" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FooterSkeleton() {
  return (
    <div className="bg-[var(--color-ink-900)] py-16">
      <div className="container-refined grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-white/50">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-6">
            <Skeleton className="h-6 w-32 bg-white/10" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-3/4 bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
