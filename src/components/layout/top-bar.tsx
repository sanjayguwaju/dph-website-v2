"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Network, RefreshCw, Accessibility, Moon, Sun, PhoneCall, Calendar, Globe } from "lucide-react";
import { formatNepaliDate } from "@/utils/nepali-date";

type FontSize = "sm" | "md" | "lg";

interface TopBarProps {
  contactPhone?: string | null;
  emergencyNumber?: string | null;
}

export function TopBar({ contactPhone, emergencyNumber }: TopBarProps) {
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [isDark, setIsDark] = useState(false);
  const [nepaliDate, setNepaliDate] = useState("");
  const [mounted, setMounted] = useState(false);

  // Initialize theme and font size from localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) document.documentElement.classList.add("dark");

    const savedSize = (localStorage.getItem("fontSize") as FontSize) || "md";
    setFontSize(savedSize);
    applyFontSize(savedSize);

    setNepaliDate(formatNepaliDate(new Date()));
  }, []);

  const applyFontSize = useCallback((size: FontSize) => {
    document.documentElement.classList.remove("text-sm-mode", "text-md-mode", "text-lg-mode");
    document.documentElement.classList.add(`text-${size}-mode`);
  }, []);

  const changeSize = useCallback((size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    applyFontSize(size);
  }, [applyFontSize]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <div className="top-bar-v3">
      <div className="container-refined flex flex-wrap items-center justify-between">
        <div className="top-bar-left-v3 hidden lg:flex flex-wrap items-center">
          <Link href="/sitemap" className="top-bar-item-v3">
            <Network size={14} className="top-icon-v3" /> साईटम्याप
          </Link>
          <button className="top-bar-item-v3">
            <RefreshCw size={14} className="top-icon-v3" /> लो ब्यान्डविथ
          </button>
          <button className="top-bar-item-v3">
            <Accessibility size={14} className="top-icon-v3" /> स्क्रीन रीडर
          </button>
          <span className="top-bar-item-v3 hidden sm:flex">
            <PhoneCall size={14} className="top-icon-v3" /> प्रशासन ०६८५२०२८८ आकस्मिक ०६८५२४१०४
          </span>
          <span className="top-bar-item-v3 border-none hidden lg:flex">
            <Calendar size={14} className="top-icon-v3" /> {mounted ? nepaliDate : "Loading..."}
          </span>
        </div>

        <div className="top-bar-right-v3 flex items-center w-full lg:w-auto justify-between lg:justify-end">
          <button onClick={toggleTheme} className="top-bar-item-v3 !border-l-0 lg:!border-l">
            {isDark ? <Sun size={15} strokeWidth={2.5} className="top-icon-v3" /> : <Moon size={15} strokeWidth={2.5} className="top-icon-v3" />}
            <span className="hidden md:inline">{isDark ? "Light" : "Dark"}</span>
          </button>

          <div className="top-bar-item-v3 a11y-font-group-v3 flex items-center justify-center flex-1 lg:flex-none">
            <button onClick={() => changeSize("lg")} className={`a11y-btn ${fontSize === "lg" ? "active" : ""}`}>अ+</button>
            <button onClick={() => changeSize("md")} className={`a11y-btn ${fontSize === "md" ? "active" : ""}`}>अ</button>
            <button onClick={() => changeSize("sm")} className={`a11y-btn ${fontSize === "sm" ? "active" : ""}`}>अ-</button>
          </div>

          <button className="top-bar-item-v3 !border-r-0 btn-lang-v3">
            <span className="lang-icon-v3">A</span><span className="lang-icon-v3-ne">अ</span> <span className="hidden md:inline ml-1">English</span>
          </button>
        </div>
      </div>
    </div>
  );
}
