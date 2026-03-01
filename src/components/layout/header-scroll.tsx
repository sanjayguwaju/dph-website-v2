"use client";

import { useScroll } from "@/hooks/use-scroll";
import { useState, useEffect, useRef } from "react";

interface HeaderScrollWrapperProps {
  children: React.ReactNode;
  threshold?: number;
}

export function HeaderScrollWrapper({ children, threshold = 120 }: HeaderScrollWrapperProps) {
  const { isScrolled, scrollY } = useScroll(threshold);
  const [hideBranding, setHideBranding] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Scroll threshold to start considering hiding branding
    const HIDE_THRESHOLD = 300;

    if (scrollY > HIDE_THRESHOLD) {
      // Meaningful scroll down: hide branding
      if (scrollY > lastScrollY.current + 15) {
        setHideBranding(true);
      }
      // Meaningful scroll up: show branding
      else if (scrollY < lastScrollY.current - 15) {
        setHideBranding(false);
      }
    } else {
      // Above the threshold: always show branding
      setHideBranding(false);
    }

    lastScrollY.current = scrollY;
  }, [scrollY]);

  return (
    <div
      className={`header-main-v3 ${isScrolled ? "is-sticky" : ""} ${hideBranding ? "hide-branding" : ""}`}
    >
      {children}
    </div>
  );
}
