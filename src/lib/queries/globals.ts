import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "next-intl/server";

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  return await payload.findGlobal({
    slug: "site-settings",
    locale,
  });
});

export const getNavigation = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  return await payload.findGlobal({
    slug: "navigation",
    depth: 2,
    locale,
  });
});

export const getFooter = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  return await payload.findGlobal({
    slug: "footer",
    depth: 2,
    locale,
  });
});
