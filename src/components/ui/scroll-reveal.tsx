"use client";

import React, { useEffect, useRef, useState, Children } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  animation = "animate-in fade-in slide-in-from-bottom-10",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Don't render if children are empty/null/undefined
  const hasChildren = Children.count(children) > 0 && children != null;

  useEffect(() => {
    if (!hasChildren) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [once, threshold, hasChildren]);

  // Don't render wrapper at all if no children
  if (!hasChildren) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        isVisible && animation,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </div>
  );
}
