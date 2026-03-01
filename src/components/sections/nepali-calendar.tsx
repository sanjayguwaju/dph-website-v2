"use client";

import { useEffect, useState } from "react";

export function NepaliCalendar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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

  return (
    <div className="calendar-card-v3 p-0 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      <iframe
        src="https://www.hamropatro.com/widgets/calender-medium.php"
        style={{ border: 'none', overflow: 'hidden', width: '100%', height: '400px' }}
        title="Nepali Calendar"
        scrolling="no"
      ></iframe>
    </div>
  );
}
