"use client";

import { useScroll } from "@/hooks/use-scroll";
import { useState, useEffect, useRef } from "react";

interface HeaderScrollWrapperProps {
  children: React.ReactNode;
  threshold?: number;
}

export function HeaderScrollWrapper({ children, threshold = 100 }: HeaderScrollWrapperProps) {
  const { isScrolled, scrollY } = useScroll(threshold);
  const [hideBranding, setHideBranding] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Smoother hide-branding logic that is less sensitive to tiny movements
    if (scrollY > threshold) {
      // Meaningful scroll down: hide branding
      if (scrollY > lastScrollY.current + 10) {
        setHideBranding(true);
      }
      // Meaningful scroll up: show branding
      else if (scrollY < lastScrollY.current - 20) {
        setHideBranding(false);
      }
    } else {
      // Near the top: always show branding
      setHideBranding(false);
    }
    lastScrollY.current = scrollY;
  }, [scrollY, threshold]);

  return (
    <div
      className={`header-main-v3 transition-all duration-300 ease-in-out ${isScrolled ? "is-sticky" : ""} ${hideBranding ? "hide-branding" : ""}`}
    >
      {children}
    </div>
  );
}
