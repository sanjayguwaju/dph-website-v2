import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getLatestNoticesForMarquee = cache(async () => {
  const payload = await getPayloadClient();

  const notices = await payload.find({
    collection: "notices",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    limit: 10,
    depth: 0,
  });
  return notices.docs;
});
