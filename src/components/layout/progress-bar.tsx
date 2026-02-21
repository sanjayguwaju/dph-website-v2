"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  speed: 400,
  minimum: 0.2,
  easing: 'ease'
});

export function ProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    // We start progress immediately on render when pathname changes
    // This is a client-side trick to simulate page load start
    NProgress.start();
    
    // We end it after a small delay or once the new page is "ready"
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
