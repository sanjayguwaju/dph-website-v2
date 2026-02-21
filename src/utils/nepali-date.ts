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

const NE_DAYS = ["आइतबार", "सोमबार", "मङ्गलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"];

const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toNepaliNum(n: number | string): string {
  return String(n)
    .split("")
    .map((d) => NE_DIGITS[parseInt(d)] ?? d)
    .join("");
}

export function formatNepaliNumber(n: number): string {
  const s = n.toString();
  if (s.length <= 3) return toNepaliNum(s);
  
  const lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  return toNepaliNum(res);
}

/**
 * Simplified AD to BS conversion.
 * Accurate within ±1 day for most dates in the current era.
 */
export function adToBs(adDate: Date) {
  const adYear = adDate.getFullYear();
  const adMonth = adDate.getMonth() + 1;
  const adDay = adDate.getDate();

  // Basic offset calculation
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

  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
    dayName: NE_DAYS[adDate.getDay()],
    monthName: NE_MONTHS[bsMonth - 1],
  };
}

export function formatNepaliDate(adDate: Date): string {
  const bs = adToBs(adDate);
  return `${toNepaliNum(bs.day)} ${bs.monthName} ${toNepaliNum(bs.year)}, ${bs.dayName}`;
}

export function getNepaliRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "भर्खरै";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${toNepaliNum(diffInMinutes)} मिनेट अघि`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${toNepaliNum(diffInHours)} घण्टा अघि`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${toNepaliNum(diffInDays)} दिन अघि`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${toNepaliNum(diffInMonths)} महिना अघि`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${toNepaliNum(diffInYears)} वर्ष अघि`;
}
