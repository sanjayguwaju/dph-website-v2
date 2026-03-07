"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div
            key={pathname}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both ease-out-quint"
        >
            <Suspense fallback={<div className="min-h-screen" />}>
                {children}
            </Suspense>
        </div>
    );
}
