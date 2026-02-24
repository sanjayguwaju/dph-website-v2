"use client";

import { useEffect, useState } from "react";
import { User, Users, Bed, Activity, HeartPulse } from "lucide-react";
import { formatNepaliNumber } from "@/utils/nepali-date";

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
  const [lastUpdateStr, setLastUpdateStr] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (stats.lastUpdatedDate) {
        try {
          const dateObj = new Date(stats.lastUpdatedDate);
          setLastUpdateStr(
            dateObj.toLocaleDateString("en-US", {
              dateStyle: "medium",
            })
          );
        } catch {
          setLastUpdateStr(stats.lastUpdatedDate);
        }
      } else {
        setLastUpdateStr("Just now");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [stats.lastUpdatedDate]);

  if (!mounted) {
    return <StatsSkeleton />;
  }

  const groups = [
    {
      title: "OPD Service Recipients",
      items: [
        { label: "Male", value: stats.opdMale ?? 0, icon: <User size={18} />, color: "#2563eb" },
        { label: "Female", value: stats.opdFemale ?? 0, icon: <Users size={18} />, color: "#db2777" },
        { label: "Total", value: stats.opdTotal ?? 0, icon: <Activity size={18} />, color: "#059669" },
      ]
    },
    {
      title: "Emergency Service Recipients",
      items: [
        { label: "Male", value: stats.inpatientMale ?? 0, icon: <User size={18} />, color: "#2563eb" },
        { label: "Female", value: stats.inpatientFemale ?? 0, icon: <Users size={18} />, color: "#db2777" },
        { label: "Total", value: stats.inpatientTotal ?? 0, icon: <Activity size={18} />, color: "#059669" },
      ]
    },
    {
      title: "Admitted Patients",
      items: [
        { label: "Total", value: stats.totalBeds ?? 0, icon: <Bed size={22} />, color: "#7c3aed" },
      ]
    },
    {
      title: "Health Insurance Program",
      items: [
        { label: "Total", value: stats.bedOccupancy ?? 0, icon: <HeartPulse size={22} />, color: "#0d9488" },
      ]
    }
  ];

  const formatNum = (n: number) => {
    return n.toLocaleString("en-US");
  };

  return (
    <section className="stats-dashboard-simple container-refined mt-8 mb-12">
      <div className="section-header-v2">
        <h2 className="section-heading-v2">
          Statistics <span className="text-gray-500 text-lg font-normal ml-2">{lastUpdateStr ? `(${lastUpdateStr})` : ""}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-blue-800 font-bold text-base mb-4 text-center border-b border-gray-100 pb-3">{group.title}</h3>
            <div className="flex flex-col gap-3">
              {group.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 rounded border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{item.icon}</span>
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </div>
                  <span className="text-blue-900 font-bold text-lg">{formatNum(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSkeleton() {
  return (
    <div className="container-refined animate-pulse opacity-60 mt-8 mb-12">
      <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-48 bg-gray-50 rounded-lg border border-gray-200"></div>
        ))}
      </div>
    </div>
  );
}
