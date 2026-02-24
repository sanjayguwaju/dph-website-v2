"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Network, RefreshCw, Accessibility, Moon, Sun, PhoneCall, Calendar } from "lucide-react";
import { formatNepaliDate } from "@/utils/nepali-date";

export function TopBar({
  contactPhone,
  emergencyNumber,
}: {
  contactPhone?: string | null;
  emergencyNumber?: string | null;
}) {
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

    // Scroll listener for sticky header
    const handleScroll = () => {
      const header = document.querySelector(".hospital-header");
      if (window.scrollY > 20) {
        header?.classList.add("scrolled");
      } else {
        header?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Format for Nepali Date (BS)
    const now = new Date();
    setNepaliDate(formatNepaliDate(now));

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="top-bar-icons">
          <Link href="/sitemap" className="top-bar-btn">
            <Network size={14} className="icon-blue" /> Site Map
          </Link>
          <button className="top-bar-btn">
            <RefreshCw size={14} className="icon-blue" /> Low Bandwidth
          </button>
          <button className="top-bar-btn">
            <Accessibility size={14} className="icon-blue" /> Screen Reader
          </button>
        </div>
        <div className="top-bar-emergency-wrap">
          {contactPhone && (
            <span className="top-bar-info">
              <PhoneCall size={13} className="icon-blue mr-1" /> Admin: {contactPhone}
            </span>
          )}
          {emergencyNumber && (
            <span className="top-bar-info">
              Emergency: {emergencyNumber}
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
          <span className="ml-1">{isDark ? "Light" : "Dark"}</span>
        </button>

        <div className="top-bar-a11y">
          <button onClick={() => changeSize("lg")} className={`a11y-btn ${fontSize === "lg" ? "active" : ""}`}>A+</button>
          <button onClick={() => changeSize("md")} className={`a11y-btn ${fontSize === "md" ? "active" : ""}`}>A</button>
          <button onClick={() => changeSize("sm")} className={`a11y-btn ${fontSize === "sm" ? "active" : ""}`}>A-</button>
        </div>
      </div>
    </div>
  );
}
