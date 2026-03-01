import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getSiteSettings = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({
      slug: "site-settings",
    });
    return settings || {};
  } catch (error) {
    return {};
  }
});

export const getNavigation = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const nav = await payload.findGlobal({
      slug: "navigation",
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
    const footer = await payload.findGlobal({
      slug: "footer",
      depth: 2,
    });
    return footer || {};
  } catch (error) {
    return {};
  }
});
