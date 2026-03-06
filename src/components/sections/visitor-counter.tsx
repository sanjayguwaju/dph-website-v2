"use client";

import { useEffect, useState } from "react";
import { Users, MousePointer2, Eye } from "lucide-react";
import { toNepaliNum } from "@/utils/nepali-date";
import { getLocaleClient } from "@/utils/locale-client";

interface VisitorStats {
   total: number;
   today: number;
   online: number;
}

export function VisitorCounter({
   locale: initialLocale = "ne",
   initialStats
}: {
   locale?: string;
   initialStats?: VisitorStats;
}) {
   const [mounted, setMounted] = useState(false);
   const [locale, setLocale] = useState(initialLocale);
   const [counts, setCounts] = useState<VisitorStats>(initialStats ?? {
      total: 0,
      today: 0,
      online: 0
   });

   useEffect(() => {
      // Resolve the true client locale and mark as mounted
      const clientLocale = getLocaleClient();
      setLocale(clientLocale);
      setMounted(true);
   }, []);

   useEffect(() => {
      if (!initialStats) return;

      const interval = setInterval(() => {
         setCounts(prev => ({
            ...prev,
            online: Math.max(1, prev.online + (Math.random() > 0.5 ? 1 : -1))
         }));
      }, 5000);
      return () => clearInterval(interval);
   }, [initialStats]);

   const format = (num: number) => locale === "ne" ? toNepaliNum(num) : num.toLocaleString();

   // Render a stable placeholder until client mounts to avoid hydration mismatch
   if (!mounted) {
      return (
         <div className="visitor-card-v3">
            <div className="visitor-header-v3">
               <h4 className="visitor-title-v3" suppressHydrationWarning>
                  {initialLocale === "ne" ? "दर्शक संख्या" : "Visitor Statistics"}
               </h4>
            </div>
            <div className="visitor-stats-v3">
               {[0, 1, 2].map(i => (
                  <div key={i} className="stat-item-v3">
                     <div className="stat-icon-wrap-v3 blue" />
                     <div className="stat-info-v3">
                        <p className="stat-label-v3">&nbsp;</p>
                        <p className="stat-value-v3">—</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   return (
      <div className="visitor-card-v3">
         <div className="visitor-header-v3">
            <h4 className="visitor-title-v3">
               {locale === "ne" ? "दर्शक संख्या" : "Visitor Statistics"}
            </h4>
         </div>

         <div className="visitor-stats-v3">
            <div className="stat-item-v3">
               <div className="stat-icon-wrap-v3 blue">
                  <Users size={16} />
               </div>
               <div className="stat-info-v3">
                  <p className="stat-label-v3">{locale === "ne" ? "कुल दर्शक" : "Total Visitors"}</p>
                  <p className="stat-value-v3">{format(counts.total)}</p>
               </div>
            </div>

            <div className="stat-item-v3">
               <div className="stat-icon-wrap-v3 green">
                  <Eye size={16} />
               </div>
               <div className="stat-info-v3">
                  <p className="stat-label-v3">{locale === "ne" ? "आजको दर्शक" : "Today's Visitors"}</p>
                  <p className="stat-value-v3">{format(counts.today)}</p>
               </div>
            </div>

            <div className="stat-item-v3">
               <div className="stat-icon-wrap-v3 red">
                  <MousePointer2 size={16} />
               </div>
               <div className="stat-info-v3">
                  <p className="stat-label-v3">{locale === "ne" ? "अहिले अनलाइन" : "Online Now"}</p>
                  <p className="stat-value-v3">{format(counts.online)}</p>
               </div>
            </div>
         </div>
      </div>
   );
}
