import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { locales, defaultLocale, type Locale } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || defaultLocale) as Locale;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const messages =
    validLocale === "en"
      ? (await import("./messages/en")).default
      : (await import("./messages/ne")).default;

  return {
    locale: validLocale,
    messages: messages as Record<string, any>,
  };
});
