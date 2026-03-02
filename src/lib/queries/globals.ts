import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getSiteSettings = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const settings = await payload.findGlobal({
      slug: "site-settings",
      locale: locale as any,
    });
    return settings || {};
  } catch (error) {
    return {};
  }
});

export const getNavigation = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const nav = await payload.findGlobal({
      slug: "navigation",
      locale: locale as any,
      depth: 2,
    });
    return nav || {};
  } catch (error) {
    return {};
  }
});

export const getFooter = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const footer = await payload.findGlobal({
      slug: "footer",
      locale: locale as any,
      depth: 2,
    });
    return footer || {};
  } catch (error) {
    return {};
  }
});
