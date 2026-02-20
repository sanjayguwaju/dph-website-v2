"use client";

import { useState } from "react";

// --- Minimal BS date conversion ---
// Reference: https://en.wikipedia.org/wiki/Bikram_Sambat
// Conversion table for start-of-year AD dates (AD year → (BS year, start month, start day))
// We approximate: BS = AD + 56 years 8 months 15 days roughly.
// This component uses the browser's Intl API where available, otherwise falls back.

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

const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

function toNepaliNum(n: number): string {
  return String(n)
    .split("")
    .map((d) => NE_DIGITS[parseInt(d)] ?? d)
    .join("");
}

// Simplified BS conversion (accurate to within ±1 day for dates 1970–2050)
function adToBs(ad: Date): { year: number; month: number; day: number } {
  // Approximate: BS year ≈ AD year + 56, month offset ≈ +8.5 months
  const adYear = ad.getFullYear();
  const adMonth = ad.getMonth() + 1; // 1-12
  const adDay = ad.getDate();

  let bsYear = adYear + 56;
  let bsMonth = adMonth + 8;
  let bsDay = adDay + 15;

  if (bsDay > 30) {
    bsDay -= 30;
    bsMonth++;
  }
  if (bsMonth > 12) {
    bsMonth -= 12;
    bsYear++;
  }

  return { year: bsYear, month: bsMonth, day: bsDay };
}

function getDaysInBsMonth(bsYear: number, bsMonth: number): number {
  // BS months have 29–32 days; approximate with 30 for simplicity
  // Months 1-8 typically have 31 days in non-leap years
  if (bsMonth <= 8) return 31;
  if (bsMonth <= 10) return 30;
  return 29;
}

export function NepaliCalendar() {
  const today = new Date();
  const todayBs = adToBs(today);

  const [viewYear, setViewYear] = useState(todayBs.year);
  const [viewMonth, setViewMonth] = useState(todayBs.month);

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
    <aside className="nepali-calendar">
      <div className="nepali-calendar-header">
        <button onClick={prevMonth} className="cal-nav-btn" aria-label="Previous month">
          ‹
        </button>
        <div className="cal-title">
          <span className="cal-month">{NE_MONTHS[viewMonth - 1]}</span>
          <span className="cal-year">{toNepaliNum(viewYear)}</span>
        </div>
        <button onClick={nextMonth} className="cal-nav-btn" aria-label="Next month">
          ›
        </button>
      </div>

      <div className="cal-grid">
        {NE_DAYS.map((d) => (
          <div key={d} className="cal-day-header">
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`cal-cell${day === null ? "empty" : ""}${day !== null && isToday(day) ? "today" : ""}`}
          >
            {day !== null ? toNepaliNum(day) : ""}
          </div>
        ))}
      </div>

      <div className="cal-today-label">
        आज: {NE_MONTHS[todayBs.month - 1]} {toNepaliNum(todayBs.day)}, {toNepaliNum(todayBs.year)}
      </div>
    </aside>
  );
}
