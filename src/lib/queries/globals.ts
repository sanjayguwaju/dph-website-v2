import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient();
  return await payload.findGlobal({
    slug: "site-settings",
  });
});

export const getNavigation = cache(async () => {
  const payload = await getPayloadClient();
  return await payload.findGlobal({
    slug: "navigation",
    depth: 2,
  });
});

export const getFooter = cache(async () => {
  const payload = await getPayloadClient();
  return await payload.findGlobal({
    slug: "footer",
    depth: 2,
  });
});
