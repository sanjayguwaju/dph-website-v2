"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Network, RefreshCw, Accessibility, Moon, Sun, PhoneCall, Calendar, Globe } from "lucide-react";
import { formatNepaliDate, toNepaliNum } from "@/utils/nepali-date";

type FontSize = "sm" | "md" | "lg";

interface TopBarProps {
  contactPhone?: string | null;
  emergencyNumber?: string | null;
  initialLocale?: string;
}

export function TopBar({ contactPhone, emergencyNumber, initialLocale = "ne" }: TopBarProps) {
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [isDark, setIsDark] = useState(false);
  const [nepaliDate, setNepaliDate] = useState("");
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(initialLocale);

  const applyFontSize = useCallback((size: FontSize) => {
    document.documentElement.classList.remove("text-sm-mode", "text-md-mode", "text-lg-mode");
    document.documentElement.classList.add(`text-${size}-mode`);
  }, []);

  // Initialize theme, font size, and locale
  useEffect(() => {
    setMounted(true);

    // Theme
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemDark);
    setIsDark(shouldBeDark);
    if (shouldBeDark) document.documentElement.classList.add("dark");

    // Font Size
    const savedSize = (localStorage.getItem("fontSize") as FontSize) || "md";
    setFontSize(savedSize);
    applyFontSize(savedSize);

    // Date
    setNepaliDate(formatNepaliDate(new Date()));

    // Locale
    const locale = typeof document !== 'undefined'
      ? document.cookie.split('; ').find(row => row.startsWith('NEXT_LOCALE='))?.split('=')[1] || 'ne'
      : 'ne';
    setCurrentLocale(locale);
  }, [applyFontSize]);

  const toggleLocale = useCallback(() => {
    const nextLocale = currentLocale === "ne" ? "en" : "ne";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }, [currentLocale]);

  const changeSize = useCallback((size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    applyFontSize(size);
  }, [applyFontSize]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev: boolean) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  const labels = {
    sitemap: currentLocale === "ne" ? "साईटम्याप" : "Sitemap",
    lowBandwidth: currentLocale === "ne" ? "लो ब्यान्डविथ" : "Low Bandwidth",
    screenReader: currentLocale === "ne" ? "स्क्रीन रीडर" : "Screen Reader",
    admin: currentLocale === "ne" ? "प्रशासन" : "Admin",
    emergency: currentLocale === "ne" ? "आकस्मिक" : "Emergency",
    loading: currentLocale === "ne" ? "लोड हुँदैछ..." : "Loading...",
    light: currentLocale === "ne" ? "लाइट" : "Light",
    dark: currentLocale === "ne" ? "डार्क" : "Dark",
  };

  return (
    <div className="top-bar-v3">
      <div className="container-refined flex flex-wrap items-center justify-between">
        <div className="top-bar-left-v3 hidden lg:flex flex-wrap items-center">
          <Link href="/sitemap" className="top-bar-item-v3">
            <Network size={14} className="top-icon-v3" /> {labels.sitemap}
          </Link>
          <button className="top-bar-item-v3">
            <RefreshCw size={14} className="top-icon-v3" /> {labels.lowBandwidth}
          </button>
          <button className="top-bar-item-v3">
            <Accessibility size={14} className="top-icon-v3" /> {labels.screenReader}
          </button>
          <span className="top-bar-item-v3 hidden sm:flex font-bold">
            <PhoneCall size={14} className="top-icon-v3" /> {labels.admin} {currentLocale === "ne" ? toNepaliNum(contactPhone || "०६८५२०२८८") : (contactPhone || "068-520288")} {labels.emergency} {currentLocale === "ne" ? toNepaliNum(emergencyNumber || "०६८५२४१०४") : (emergencyNumber || "068-524104")}
          </span>
          <span className="top-bar-item-v3 border-none hidden lg:flex font-bold">
            <Globe size={14} className="top-icon-v3" /> {mounted ? (currentLocale === 'ne' ? nepaliDate : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })) : labels.loading}
          </span>
        </div>

        <div className="top-bar-right-v3 flex items-center w-full lg:w-auto justify-between lg:justify-end">
          <button onClick={toggleTheme} className="top-bar-item-v3 !border-l-0 lg:!border-l">
            {isDark ? <Sun size={15} strokeWidth={2.5} className="top-icon-v3" /> : <Moon size={15} strokeWidth={2.5} className="top-icon-v3" />}
            <span className="hidden md:inline">{isDark ? labels.light : labels.dark}</span>
          </button>

          <div className="top-bar-item-v3 a11y-font-group-v3 flex items-center justify-center flex-1 lg:flex-none">
            <button onClick={() => changeSize("lg")} className={`a11y-btn ${fontSize === "lg" ? "active" : ""}`}>अ+</button>
            <button onClick={() => changeSize("md")} className={`a11y-btn ${fontSize === "md" ? "active" : ""}`}>अ</button>
            <button onClick={() => changeSize("sm")} className={`a11y-btn ${fontSize === "sm" ? "active" : ""}`}>अ-</button>
          </div>

          <button onClick={toggleLocale} className="top-bar-item-v3 !border-r-0 btn-lang-v3 group">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <span className={`lang-icon-v3 ${currentLocale === 'en' ? 'text-red-600 font-bold underline' : ''}`}>A</span>
                <span className={`lang-icon-v3-ne ${currentLocale === 'ne' ? 'text-red-600 font-bold underline' : ''}`}>अ</span>
              </div>
              <span className="hidden md:inline font-medium">
                {currentLocale === "ne" ? "English" : "नेपाली"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
