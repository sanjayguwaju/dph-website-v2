// Locale constants – safe to import from middleware (edge runtime)
export const locales = ["ne", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ne";
