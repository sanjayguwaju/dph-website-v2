"use client";

import { useEffect, useState } from "react";
import { Users, MousePointer2, Eye } from "lucide-react";
import { toNepaliNum } from "@/utils/nepali-date";

export function VisitorCounter({ locale = "ne" }: { locale?: string }) {
  const [counts, setCounts] = useState({
    total: 245678,
    today: 1245,
    online: 42
  });

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we simulate values
    const interval = setInterval(() => {
       setCounts(prev => ({
         ...prev,
         online: Math.max(10, prev.online + (Math.random() > 0.5 ? 1 : -1))
       }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const format = (num: number) => locale === "ne" ? toNepaliNum(num) : num.toLocaleString();

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
