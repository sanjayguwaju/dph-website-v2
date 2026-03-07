"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

/**
 * Enhanced Navigation Progress Bar
 * Provides instant visual feedback on page changes
 */
export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initial configuration for a refined "premium" feel
    NProgress.configure({
      showSpinner: false,
      speed: 600, // Slower, smoother speed
      minimum: 0.1,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth CSS easing
      trickle: true,
      trickleSpeed: 200,
    });
  }, []);

  useEffect(() => {
    // Stop any existing progress before starting anew
    NProgress.done();
    NProgress.start();

    // Auto-complete the bar once the client-side navigation has likely committed
    const timer = setTimeout(() => {
      NProgress.done();
    }, 200); // 200ms is usually enough for the new page layout to be interactive

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return (
    <style jsx global>{`
      #nprogress .bar {
        background: #dc3545 !important; /* Brand Red */
        height: 3px !important;
        box-shadow: 0 0 15px rgba(220, 53, 69, 0.4);
      }
      #nprogress .peg {
        box-shadow: 0 0 10px #dc3545, 0 0 5px #dc3545 !important;
      }
    `}</style>
  );
}
