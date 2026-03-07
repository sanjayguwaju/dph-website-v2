import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getTimeline = cache(async () => {
    try {
        const payload = await getPayloadClient();
        const locale = await getLocale();
        const timeline = await payload.find({
            collection: "timeline",
            where: { isActive: { equals: true } },
            locale: locale as any,
            sort: "order",
            limit: 100,
            depth: 0,
        });
        return timeline.docs || [];
    } catch (error) {
        console.error("Error fetching timeline:", error);
        return [];
    }
});
