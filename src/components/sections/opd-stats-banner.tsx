"use client";

import { useEffect, useState } from "react";
import { User, Users, Bed, Activity, HeartPulse } from "lucide-react";
import { formatNepaliNumber } from "@/utils/nepali-date";
import { useTranslations, useLocale } from "next-intl";

type OpdStatsData = {
  opdMale?: number | null;
  opdFemale?: number | null;
  opdTotal?: number | null;
  inpatientMale?: number | null;
  inpatientFemale?: number | null;
  inpatientTotal?: number | null;
  totalBeds?: number | null;
  bedOccupancy?: number | null;
  lastUpdatedDate?: string | null;
};

export function OpdStatsBanner({ stats }: { stats: OpdStatsData }) {
  const [mounted, setMounted] = useState(false);
  // Defer date string to client only to prevent SSR hydration mismatch
  const [lastUpdateStr, setLastUpdateStr] = useState<string>("");
  const t = useTranslations("home");
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
    // Only format date on the client side
    if (stats.lastUpdatedDate) {
      try {
        const dateObj = new Date(stats.lastUpdatedDate);
        // Use a consistent locale string that won't differ server/client
        setLastUpdateStr(
          dateObj.toLocaleDateString(locale === "ne" ? "ne-NP" : "en-US", {
            dateStyle: "medium",
          })
        );
      } catch {
        setLastUpdateStr(stats.lastUpdatedDate);
      }
    } else {
      setLastUpdateStr(t("justNow"));
    }
  }, [stats.lastUpdatedDate, locale, t]);

  const groups = [
    {
      title: t("opdServiceRecipients"),
      color: "blue-bar",
      items: [
        { label: t("male"), value: stats.opdMale ?? 0, icon: <User size={18} />, color: "#3498db" },
        { label: t("female"), value: stats.opdFemale ?? 0, icon: <Users size={18} />, color: "#e91e63" },
        { label: t("total"), value: stats.opdTotal ?? 0, icon: <Activity size={18} />, color: "#2ecc71" },
      ]
    },
    {
      title: t("emergencyServiceRecipients"),
      color: "red-bar",
      items: [
        { label: t("male"), value: stats.inpatientMale ?? 0, icon: <User size={18} />, color: "#3498db" },
        { label: t("female"), value: stats.inpatientFemale ?? 0, icon: <Users size={18} />, color: "#e91e63" },
        { label: t("total"), value: stats.inpatientTotal ?? 0, icon: <Activity size={18} />, color: "#2ecc71" },
      ]
    },
    {
      title: t("admittedPatients"),
      color: "purple-bar",
      items: [
        { label: t("total"), value: stats.totalBeds ?? 0, icon: <Bed size={24} />, color: "#9b59b6" },
      ]
    },
    {
      title: t("healthInsuranceProgram"),
      color: "teal-bar",
      items: [
        { label: t("total"), value: stats.bedOccupancy ?? 0, icon: <HeartPulse size={24} />, color: "#1abc9c" },
      ]
    }
  ];

  const formatNum = (n: number) => {
    if (!mounted) return "0";
    return locale === "ne" ? formatNepaliNumber(n) : n.toLocaleString("en-US");
  };

  return (
    <section className="stats-dashboard">
      <div className="stats-dashboard-header">
        <h2 className="stats-dashboard-title">{t("statsTitle")}</h2>
        <p className="stats-dashboard-subtitle" suppressHydrationWarning>
          {t("lastUpdate")}{" "}
          <span suppressHydrationWarning>
            {lastUpdateStr ? `(${lastUpdateStr})` : ""}
          </span>
        </p>
      </div>

      <div className="stats-groups-grid">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="stats-group-box">
            <h3 className="stats-group-title">{group.title}</h3>
            <div className="stats-items-row">
              {group.items.map((item, iIdx) => (
                <div key={iIdx} className="stat-v2-card">
                  <div className="stat-v2-main">
                    <span className="stat-v2-icon" style={{ color: item.color }}>{item.icon}</span>
                    <span className="stat-v2-value" suppressHydrationWarning>{formatNum(item.value)}</span>
                  </div>
                  <span className="stat-v2-label">{item.label}</span>
                  <div className={`stat-v2-bar ${group.color}`}></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
