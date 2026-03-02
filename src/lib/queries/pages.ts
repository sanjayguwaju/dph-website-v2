import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getPageBySlug = cache(async (slug: string) => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();

    const pages = await payload.find({
      collection: "pages",
      where: {
        slug: { equals: slug },
        status: { equals: "published" },
      },
      locale: locale as any,
      limit: 1,
      depth: 1,
    });

    return pages.docs[0] || null;
  } catch (error) {
    return null;
  }
});

export const getAllPages = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();

    const pages = await payload.find({
      collection: "pages",
      where: {
        status: { equals: "published" },
      },
      locale: locale as any,
      limit: 100,
      depth: 0,
    });

    return pages.docs || [];
  } catch (error) {
    return [];
  }
});
