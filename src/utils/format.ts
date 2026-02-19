import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function formatDate(
  date: string | Date,
  formatStr: "short" | "long" | "relative" = "long",
): string {
  const d = new Date(date);

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

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatReadTime(minutes: number): string {
  if (minutes < 1) return "< 1 min read";
  return `${minutes} min read`;
}
