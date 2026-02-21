"use client";

import { useState, useEffect } from "react";
import { adToBs, toNepaliNum } from "@/utils/nepali-date";

const NE_MONTHS = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भाद्र",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुन",
  "चैत्र",
];

const NE_DAYS = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];

function getDaysInBsMonth(bsYear: number, bsMonth: number): number {
  if (bsMonth <= 8) return 31;
  if (bsMonth <= 10) return 30;
  return 29;
}

export function NepaliCalendar() {
  const [mounted, setMounted] = useState(false);
  const [todayBs, setTodayBs] = useState<{ year: number; month: number; day: number } | null>(null);
  const [viewYear, setViewYear] = useState(2081);
  const [viewMonth, setViewMonth] = useState(1);

  useEffect(() => {
    const today = new Date();
    const bs = adToBs(today);
    setTodayBs(bs);
    setViewYear(bs.year);
    setViewMonth(bs.month);
    setMounted(true);
  }, []);

  if (!mounted || !todayBs) {
    return (
       <aside className="nepali-calendar-v2" style={{ minHeight: '300px' }}>
          <div className="cal-loading">Loading Calendar...</div>
       </aside>
    );
  }

  const daysInMonth = getDaysInBsMonth(viewYear, viewMonth);

  // Find what weekday day 1 falls on (approximate)
  const approxStartAd = new Date(viewYear - 56, viewMonth - 9, 16);
  const startWeekday = approxStartAd.getDay(); // 0 = Sunday

  function prevMonth() {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day: number) =>
    viewYear === todayBs.year && viewMonth === todayBs.month && day === todayBs.day;

  return (
    <aside className="nepali-calendar-v2">
      <div className="cal-header-top">
         <button onClick={() => {
           setViewYear(todayBs.year);
           setViewMonth(todayBs.month);
         }} className="cal-today-btn">आज</button>
         
         <div className="cal-nav-group">
            <button onClick={prevMonth} className="cal-nav-arrow">«</button>
            <div className="cal-current-selection">
               {NE_MONTHS[viewMonth - 1]} {toNepaliNum(viewYear)}
            </div>
            <button onClick={nextMonth} className="cal-nav-arrow">»</button>
         </div>
         
         <div className="cal-extra-nav">
            <span className="cal-shravan-btn">चैत/बैशाख</span>
         </div>
      </div>

      <div className="cal-grid-v2">
        {NE_DAYS.map((d) => (
          <div key={d} className="cal-day-header-v2">
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`cal-cell-v2${day === null ? " empty" : ""}${day !== null && isToday(day) ? " today" : ""}`}
          >
            {day !== null ? toNepaliNum(day) : ""}
          </div>
        ))}
      </div>

      <div className="cal-footer-today">
        आज: {NE_MONTHS[todayBs.month - 1]} {toNepaliNum(todayBs.day)}, {toNepaliNum(todayBs.year)}
      </div>
    </aside>
  );
}
