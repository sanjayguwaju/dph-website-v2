"use client";

import { usePathname } from "next/navigation";
import {
  HeroSkeleton,
  StatsSkeleton,
  SectionHeaderSkeleton,
  GridSkeleton,
  TabsSkeleton,
  SidebarSkeleton,
  Skeleton
} from "@/components/ui/skeleton";

export default function Loading() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/ne" || pathname === "/en";

  if (isHome) {
    return (
      <div className="flex flex-col gap-0">
        {/* Hero Section Skeleton */}
        <HeroSkeleton />

        {/* Stats Banner Skeleton */}
        <div className="bg-[var(--color-ink-700)]/5">
          <StatsSkeleton />
        </div>

        {/* Main Content Layout Skeleton */}
        <div className="container-refined py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Main Content Column */}
            <div className="space-y-16 lg:col-span-8">
              {/* About Us Skeleton */}
              <section>
                <SectionHeaderSkeleton />
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </section>

              {/* News & Activities Skeleton */}
              <section>
                <SectionHeaderSkeleton />
                <GridSkeleton count={3} />
              </section>

              {/* Notices Tabs Skeleton */}
              <section>
                <SectionHeaderSkeleton />
                <TabsSkeleton />
              </section>
            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4">
              <SidebarSkeleton />
            </aside>
          </div>
        </div>

        {/* Services Grid Skeleton */}
        <div className="bg-[var(--color-ink-700)]/5 py-16">
          <div className="container-refined">
            <SectionHeaderSkeleton />
            <GridSkeleton count={6} />
          </div>
        </div>
      </div>
    );
  }

  // Generic Subpage Skeleton
  return (
    <div className="container-refined py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <SectionHeaderSkeleton />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4 pt-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <aside className="lg:col-span-4">
          <SidebarSkeleton />
        </aside>
      </div>
    </div>
  );
}
