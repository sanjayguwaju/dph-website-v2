"use client";

import { useEffect, useState } from "react";
import { User, Users, Bed, Activity, HeartPulse } from "lucide-react";
import { formatNepaliNumber } from "@/utils/nepali-date";
import { getLocaleClient } from "@/utils/locale-client";
import { formatDate } from "@/utils/format";

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

export function OpdStatsBanner({ stats, locale: initialLocale }: { stats: OpdStatsData, locale?: string }) {
  const [mounted, setMounted] = useState(false);
  const [lastUpdateStr, setLastUpdateStr] = useState<string>("");
  const [locale, setLocale] = useState(initialLocale || "ne");

  useEffect(() => {
    const activeLocale = getLocaleClient();
    if (activeLocale !== locale) {
      setLocale(activeLocale);
    }

    const timer = setTimeout(() => {
      setMounted(true);
      const targetLocale = activeLocale || initialLocale || "ne";
      if (stats.lastUpdatedDate) {
        try {
          const dateObj = new Date(stats.lastUpdatedDate);
          setLastUpdateStr(formatDate(stats.lastUpdatedDate, "short", targetLocale));
        } catch {
          setLastUpdateStr(stats.lastUpdatedDate);
        }
      } else {
        setLastUpdateStr(targetLocale === "ne" ? "भर्खरै" : "Just now");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [stats.lastUpdatedDate, initialLocale, locale]);

  if (!mounted) {
    return <StatsSkeleton />;
  }

  const labels = {
    title: locale === "ne" ? "तथ्याङ्क विवरण" : "Statistics",
    opd: locale === "ne" ? "बहिरङ्ग (OPD) सेवाग्राही" : "OPD Service Recipients",
    emergency: locale === "ne" ? "आकस्मिक सेवाग्राही" : "Emergency Recipients",
    admitted: locale === "ne" ? "भर्ना भएका बिरामी" : "Admitted Patients",
    insurance: locale === "ne" ? "स्वास्थ्य बीमा कार्यक्रम" : "Health Insurance Program",
    male: locale === "ne" ? "पुरुष" : "Male",
    female: locale === "ne" ? "महिला" : "Female",
    total: locale === "ne" ? "कुल" : "Total",
    beds: locale === "ne" ? "कुल शैया" : "Total Beds",
    enrolled: locale === "ne" ? "आबद्ध संख्या" : "Enrolled Count",
  };

  const groups = [
    {
      title: labels.opd,
      items: [
        { label: labels.male, value: stats.opdMale ?? 0, icon: <User size={18} />, color: "#2563eb" },
        { label: labels.female, value: stats.opdFemale ?? 0, icon: <Users size={18} />, color: "#db2777" },
        { label: labels.total, value: stats.opdTotal ?? 0, icon: <Activity size={18} />, color: "#059669" },
      ]
    },
    {
      title: labels.emergency,
      items: [
        { label: labels.male, value: stats.inpatientMale ?? 0, icon: <User size={18} />, color: "#2563eb" },
        { label: labels.female, value: stats.inpatientFemale ?? 0, icon: <Users size={18} />, color: "#db2777" },
        { label: labels.total, value: stats.inpatientTotal ?? 0, icon: <Activity size={18} />, color: "#059669" },
      ]
    },
    {
      title: labels.admitted,
      items: [
        { label: labels.beds, value: stats.totalBeds ?? 0, icon: <Bed size={22} />, color: "#7c3aed" },
      ]
    },
    {
      title: labels.insurance,
      items: [
        { label: labels.total, value: stats.bedOccupancy ?? 0, icon: <HeartPulse size={22} />, color: "#0d9488" },
      ]
    }
  ];

  const formatNum = (n: number) => {
    return locale === "ne" ? formatNepaliNumber(n) : n.toLocaleString("en-US");
  };

  return (
    <section className="stats-dashboard-v3 container-refined mt-12 mb-16">
      <div className="section-header-v2">
        <h2 className="section-heading-v2">
          {labels.title}
          {lastUpdateStr && (
            <span className="text-gray-400 text-sm font-bold ml-3 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700">
              {lastUpdateStr}
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="group flex flex-col bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-[28px] p-1 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm">
            <div className="p-6">
              <h3 className="text-primary dark:text-blue-400 font-black text-sm uppercase tracking-widest mb-6 text-center opacity-80 group-hover:opacity-100 transition-opacity">{group.title}</h3>
              <div className="flex flex-col gap-4">
                {group.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center justify-between py-4 px-5 bg-slate-50 dark:bg-slate-900/50 rounded-[20px] transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm" style={{ color: item.color }}>
                        {item.icon}
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wide">{item.label}</span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tight">{formatNum(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 mt-auto">
              <div className="h-full bg-primary" style={{ width: '40%', opacity: 0.6 }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSkeleton() {
  return (
    <div className="container-refined animate-pulse opacity-60 mt-12 mb-16 px-4 md:px-0">
      <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded-2xl w-72 mb-10"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-64 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] border border-slate-100 dark:border-slate-700"></div>
        ))}
      </div>
    </div>
  );
}
