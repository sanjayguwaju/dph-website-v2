/**
 * Utility to extract string value from potentially localized CMS fields.
 * Payload CMS returns localized fields as objects like { ne: "...", en: "..." }
 * when no locale is specified in the query.
 */
export function getLocalizedValue(value: any): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    // Prefer Nepali, fallback to English, then stringify
    return value.ne || value.en || String(value);
  }
  return String(value || "");
}
