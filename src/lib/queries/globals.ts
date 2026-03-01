import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({
    slug: "site-settings",
  });
  return settings || {};
});

export const getNavigation = cache(async () => {
  const payload = await getPayloadClient();
  const nav = await payload.findGlobal({
    slug: "navigation",
    depth: 2,
  });
  return nav || {};
});

export const getFooter = cache(async () => {
  const payload = await getPayloadClient();
  const footer = await payload.findGlobal({
    slug: "footer",
    depth: 2,
  });
  return footer || {};
});
