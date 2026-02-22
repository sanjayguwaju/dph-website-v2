"use client";

import { useEffect, useState } from "react";

export function HeaderScrollWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header-main-v3 ${scrolled ? "is-sticky" : ""}`}>
      {children}
    </div>
  );
}
