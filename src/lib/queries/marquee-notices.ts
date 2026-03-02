import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getLatestNoticesForMarquee = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();

    const notices = await payload.find({
      collection: "notices",
      where: { status: { equals: "published" } },
      locale: locale as any,
      sort: "-publishedDate",
      limit: 10,
      depth: 0,
    });
    return notices.docs || [];
  } catch (error) {
    return [];
  }
});
