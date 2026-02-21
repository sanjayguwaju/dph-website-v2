import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "next-intl/server";

export const getPageBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;

  const pages = await payload.find({
    collection: "pages",
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
    limit: 1,
    depth: 1,
    locale,
  });

  return pages.docs[0] || null;
});

export const getAllPages = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;

  const pages = await payload.find({
    collection: "pages",
    where: {
      status: { equals: "published" },
    },
    limit: 100,
    depth: 0,
    locale,
  });

  return pages.docs;
});
