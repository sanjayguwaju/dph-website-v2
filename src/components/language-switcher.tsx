"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { setLocale } from "@/i18n/actions";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = async (newLocale: "ne" | "en") => {
    if (newLocale === locale) return;
    await setLocale(newLocale);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="lang-switcher" aria-label="Language switcher">
      <button
        onClick={() => handleSwitch("ne")}
        className={`lang-btn ${locale === "ne" ? "active" : ""}`}
        aria-pressed={locale === "ne"}
        disabled={isPending}
        title="नेपाली"
      >
        ने
      </button>
      <span className="lang-sep">|</span>
      <button
        onClick={() => handleSwitch("en")}
        className={`lang-btn ${locale === "en" ? "active" : ""}`}
        aria-pressed={locale === "en"}
        disabled={isPending}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
