"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  scrollProgress: number;
}

export function useScroll(threshold: number = 100): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    isScrolled: false,
    isScrollingUp: false,
    isScrollingDown: false,
    scrollProgress: 0,
  });
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
    
    setState({
      scrollY: currentScrollY,
      isScrolled: currentScrollY > threshold,
      isScrollingUp: currentScrollY < lastScrollY.current,
      isScrollingDown: currentScrollY > lastScrollY.current,
      scrollProgress: Math.min(100, Math.max(0, progress)),
    });
    
    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          updateScrollState();
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial state
    updateScrollState();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateScrollState]);

  return state;
}

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > lastScrollY.current) {
            setDirection("down");
          } else if (currentScrollY < lastScrollY.current) {
            setDirection("up");
          }
          
          setIsAtTop(currentScrollY < 10);
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { direction, isAtTop };
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          setProgress(Math.min(100, Math.max(0, scrollPercent)));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}
