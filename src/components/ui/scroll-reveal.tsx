"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** One of: 'fade-up' | 'fade-in' | 'zoom-in' | 'flip-up' | or any Tailwind animate-* string */
  animation?: "fade-up" | "fade-in" | "zoom-in" | "flip-up" | string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

// Pre-built transform presets: [hidden styles, visible styles]
const PRESETS: Record<string, [string, string]> = {
  "fade-up": ["opacity-0 translate-y-10", "opacity-100 translate-y-0"],
  "fade-in": ["opacity-0", "opacity-100"],
  "zoom-in": ["opacity-0 scale-95", "opacity-100 scale-100"],
  "flip-up": ["opacity-0 -translate-y-6", "opacity-100 translate-y-0"],

  // Legacy / passthrough aliases
  "animate-flip-up": ["opacity-0 translate-y-8", "opacity-100 translate-y-0"],
  "animate-zoom-in": ["opacity-0 scale-95", "opacity-100 scale-100"],
};

export function ScrollReveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.12,
  once = true,
}: ScrollRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const [hiddenCls, visibleCls] = PRESETS[animation] ?? PRESETS["fade-up"];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out will-change-transform",
        visible ? visibleCls : hiddenCls,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
