"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="h-16 w-16 animate-spin rounded-full border-[3px] border-[var(--brand-blue)]/20 border-t-[var(--brand-red)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--brand-blue)]/10"></div>
          </div>
        </div>
        <p className="animate-pulse text-lg font-bold tracking-wide text-[var(--brand-blue)] uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}
