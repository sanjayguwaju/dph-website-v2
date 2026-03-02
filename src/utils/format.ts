import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { toNepaliNum, getNepaliRelativeTime } from "./nepali-date";

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
    // For other formats, use toLocaleDateString for now or custom nepali date
    return d.toLocaleDateString("ne-NP", { dateStyle: formatStr === "short" ? "medium" : "full" });
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
