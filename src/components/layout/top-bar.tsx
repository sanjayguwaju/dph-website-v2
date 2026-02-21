"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Network, RefreshCw, Accessibility, Moon, Sun, PhoneCall, Calendar, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { formatNepaliDate } from "@/utils/nepali-date";
import { setLocale } from "@/i18n/actions";
import { useLocale, useTranslations } from "next-intl";

export function TopBar({
  contactPhone,
  emergencyNumber,
}: {
  contactPhone?: string | null;
  emergencyNumber?: string | null;
}) {
  const router = useRouter();
  const t = useTranslations("accessibility");
  const currentLocale = useLocale();
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [isDark, setIsDark] = useState(false);
  const [nepaliDate, setNepaliDate] = useState("");

  useEffect(() => {
    // Initial Theme Load
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) document.documentElement.classList.add("dark");

    // Accessibility Load
    const savedSize = (localStorage.getItem("fontSize") as "sm" | "md" | "lg") || "md";
    setFontSize(savedSize);
    applyFontSize(savedSize);

    // Format for Nepali Date (BS)
    const now = new Date();
    setNepaliDate(formatNepaliDate(now));
  }, []);

  function applyFontSize(size: "sm" | "md" | "lg") {
    const html = document.documentElement;
    html.classList.remove("text-sm-mode", "text-md-mode", "text-lg-mode");
    html.classList.add(`text-${size}-mode`);
  }

  function changeSize(size: "sm" | "md" | "lg") {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    applyFontSize(size);
  }

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  const handleLanguageSwitch = async () => {
    const nextLocale = currentLocale === "ne" ? "en" : "ne";
    await setLocale(nextLocale);
    router.refresh(); // Refresh the page to apply new locale
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="top-bar-icons">
          <Link href="/sitemap" className="top-bar-btn">
            <Network size={14} className="icon-blue" /> {t("sitemap")}
          </Link>
          <button className="top-bar-btn">
             <RefreshCw size={14} className="icon-blue" /> {t("lowBandwidth")}
          </button>
          <button className="top-bar-btn">
            <Accessibility size={14} className="icon-blue" /> {t("screenReader")}
          </button>
        </div>
        <div className="top-bar-emergency-wrap">
           {contactPhone && (
             <span className="top-bar-info">
               <PhoneCall size={13} className="icon-blue mr-1" /> {t("administration")} {contactPhone}
             </span>
           )}
           {emergencyNumber && (
             <span className="top-bar-info">
               {t("emergency")} {emergencyNumber}
             </span>
           )}
        </div>
      </div>

      <div className="top-bar-center">
        <span className="top-bar-date"><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} /> {nepaliDate}</span>
      </div>

      <div className="top-bar-right">
        <button onClick={toggleTheme} className="top-bar-btn dark-toggle-btn">
          {isDark ? <Sun size={14} /> : <Moon size={14} />} 
          <span className="ml-1">{isDark ? t("light") : t("dark")}</span>
        </button>

        <div className="top-bar-a11y">
          <button onClick={() => changeSize("lg")} className={`a11y-btn ${fontSize === "lg" ? "active" : ""}`}>{t("textLarge")}</button>
          <button onClick={() => changeSize("md")} className={`a11y-btn ${fontSize === "md" ? "active" : ""}`}>{t("textNormal")}</button>
          <button onClick={() => changeSize("sm")} className={`a11y-btn ${fontSize === "sm" ? "active" : ""}`}>{t("textSmall")}</button>
        </div>

        <button onClick={handleLanguageSwitch} className="lang-toggle-btn">
           <span className="lang-icon">🌐</span> {currentLocale === "ne" ? "English" : "नेपाली"}
        </button>
      </div>
    </div>
  );
}
