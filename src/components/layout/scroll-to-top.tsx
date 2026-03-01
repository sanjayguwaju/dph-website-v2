"use client";

import { useCallback, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";

const SCROLL_THRESHOLD = 300;

export function ScrollToTop() {
  const { scrollY } = useScroll(SCROLL_THRESHOLD);
  const isVisible = scrollY > SCROLL_THRESHOLD;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Return focus to the start of the document
    const mainContent = document.querySelector("main") || document.querySelector("h1");
    if (mainContent) {
      (mainContent as HTMLElement).focus({ preventScroll: true });
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  if (!isVisible) return null;

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className="scroll-to-top"
      aria-label="Scroll to top of page"
      title="Scroll to top"
      tabIndex={0}
    >
      <ChevronUp size={24} aria-hidden="true" />
    </button>
  );
}
