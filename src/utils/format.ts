import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { toNepaliNum, getNepaliRelativeTime } from "./nepali-date";

const AD_MONTHS_NE = [
  "जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन",
  "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"
];

export function formatDate(
  date: string | Date,
  formatStr: "short" | "long" | "relative" = "long",
  locale: string = "en"
): string {
  const d = new Date(date);

  if (locale === "ne") {
    if (formatStr === "relative") {
      return getNepaliRelativeTime(d);
    }

    // Stable manual formatting for AD date in Nepali script
    const day = toNepaliNum(d.getDate());
    const month = AD_MONTHS_NE[d.getMonth()];
    const year = toNepaliNum(d.getFullYear());

    if (formatStr === "short") {
      return `${year} ${month} ${day}`;
    }

    // Long format: e.g. २०२६ फेब्रुअरी २४
    return `${year} ${month} ${day}`;
  }

  if (formatStr === "relative") {
    if (isToday(d)) {
      return formatDistanceToNow(d, { addSuffix: true });
    }
    if (isYesterday(d)) {
      return "Yesterday";
    }
    return format(d, "MMM d, yyyy");
  }

  if (formatStr === "short") {
    return format(d, "MMM d, yyyy");
  }

  return format(d, "MMMM d, yyyy • h:mm a");
}

export function formatNumber(num: number, locale: string = "en"): string {
  if (locale === "ne") {
    return toNepaliNum(num);
  }
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatReadTime(minutes: number, locale: string = "en"): string {
  if (locale === "ne") {
    const num = toNepaliNum(minutes);
    if (minutes < 1) return "< १ मिनेट पढ्ने समय";
    return `${num} मिनेट पढ्ने समय`;
  }
  if (minutes < 1) return "< 1 min read";
  return `${minutes} min read`;
}
