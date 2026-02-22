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
  const [viewYear, setViewYear] = useState(2082);
  const [viewMonth, setViewMonth] = useState(11); // Phalgun is 11

  useEffect(() => {
    const today = new Date();
    const bs = adToBs(today);
    setTodayBs(bs);
    setViewYear(bs.year);
    setViewMonth(bs.month);
    
    // Simulate loading for skeleton demo
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !todayBs) {
    return <CalendarSkeleton />;
  }

  const daysInMonth = getDaysInBsMonth(viewYear, viewMonth);
  // Find weekday (0-6) of the 1st day of the month
  // This is a simplification; for a production app, use a dedicated library like nepali-date-converter
  // We'll calculate it based on a known reference
  const startWeekday = (viewYear % 7 + viewMonth % 7 + 2) % 7; 

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
    <aside className="calendar-card-v3">
      <div className="cal-top-bar-v3">
         <button onClick={() => {
           setViewYear(todayBs.year);
           setViewMonth(todayBs.month);
         }} className="cal-btn-today-v3">आज</button>
         
         <div className="cal-selector-v3">
            <button onClick={prevMonth} className="cal-arrow-v3">«</button>
            <span className="cal-month-year-v3">
               {NE_MONTHS[viewMonth - 1]} {toNepaliNum(viewYear)}
            </span>
            <button onClick={nextMonth} className="cal-arrow-v3">»</button>
         </div>
         
         <div className="cal-extra-links-v3">
            <span className="cal-alt-month-v3">चैत/</span>
            <span className="cal-alt-month-v3">बैशाख</span>
         </div>
      </div>

      <div className="cal-grid-v3">
        {NE_DAYS.map((d, i) => (
          <div key={d} className={`cal-weekday-v3 ${i === 6 ? 'sat' : ''}`}>
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`cal-day-cell-v3${day === null ? " empty" : ""}${day !== null && isToday(day) ? " active-today" : ""}${i % 7 === 6 && day !== null ? " is-sat-v3" : ""}`}
          >
            {day !== null ? (
              <span className="day-num-v3">{toNepaliNum(day)}</span>
            ) : ""}
          </div>
        ))}
      </div>
    </aside>
  );
}

function CalendarSkeleton() {
  return (
    <div className="calendar-card-v3 animate-pulse opacity-60">
       <div className="h-10 bg-gray-100 rounded-lg mb-4"></div>
       <div className="grid grid-cols-7 gap-1">
          {Array(35).fill(0).map((_, i) => (
             <div key={i} className="aspect-square bg-gray-50 rounded-md"></div>
          ))}
       </div>
    </div>
  );
}
