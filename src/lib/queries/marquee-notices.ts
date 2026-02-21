import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "next-intl/server";

export const getLatestNoticesForMarquee = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;

  const notices = await payload.find({
    collection: "notices",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    limit: 10,
    depth: 0,
    locale,
  });
  return notices.docs;
});
