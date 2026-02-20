"use client";

import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";

export function TopBar({
  emergencyNumber,
  facebook,
  youtube,
  twitter,
}: {
  emergencyNumber?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  twitter?: string | null;
}) {
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [contrast, setContrast] = useState(false);
  const [nepaliDate, setNepaliDate] = useState("");

  useEffect(() => {
    const savedSize = (localStorage.getItem("fontSize") as "sm" | "md" | "lg") || "md";
    const savedContrast = localStorage.getItem("contrast") === "true";
    setFontSize(savedSize);
    setContrast(savedContrast);
    applyFontSize(savedSize);
    if (savedContrast) document.documentElement.classList.add("high-contrast");

    try {
      const now = new Date();
      setNepaliDate(
        now.toLocaleDateString("ne-NP", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    } catch {
      setNepaliDate(new Date().toLocaleDateString());
    }
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

  function toggleContrast() {
    const next = !contrast;
    setContrast(next);
    localStorage.setItem("contrast", String(next));
    document.documentElement.classList.toggle("high-contrast", next);
  }

  return (
    <div className="top-bar">
      {/* Left: Date + Emergency */}
      <div className="top-bar-left">
        <span className="top-bar-date">{nepaliDate}</span>
        {emergencyNumber && (
          <a href={`tel:${emergencyNumber}`} className="top-bar-emergency">
            🚨 आपतकालीन: {emergencyNumber}
          </a>
        )}
      </div>

      {/* Right: Accessibility + Language + Social */}
      <div className="top-bar-right">
        {/* Text size */}
        <div className="top-bar-a11y" aria-label="Text size controls" role="group">
          <button
            onClick={() => changeSize("sm")}
            aria-pressed={fontSize === "sm"}
            aria-label="Small text"
            className={`a11y-btn text-xs${fontSize === "sm" ? "active" : ""}`}
          >
            A-
          </button>
          <button
            onClick={() => changeSize("md")}
            aria-pressed={fontSize === "md"}
            aria-label="Normal text"
            className={`a11y-btn text-sm${fontSize === "md" ? "active" : ""}`}
          >
            A
          </button>
          <button
            onClick={() => changeSize("lg")}
            aria-pressed={fontSize === "lg"}
            aria-label="Large text"
            className={`a11y-btn text-base${fontSize === "lg" ? "active" : ""}`}
          >
            A+
          </button>
        </div>

        {/* Contrast */}
        <button
          onClick={toggleContrast}
          aria-pressed={contrast}
          aria-label="Toggle high contrast"
          className={`a11y-btn contrast-btn${contrast ? "active" : ""}`}
        >
          ◑
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Social Links */}
        <div className="top-bar-social">
          {facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          )}
          {youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
              </svg>
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
