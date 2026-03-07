import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getSections = cache(async () => {
    try {
        const payload = await getPayloadClient();
        const locale = await getLocale();
        const sections = await payload.find({
            collection: "sections",
            where: { isActive: { equals: true } },
            locale: locale as any,
            sort: "order",
            limit: 100,
            depth: 0,
        });
        return sections.docs || [];
    } catch (error) {
        console.error("Error fetching sections:", error);
        return [];
    }
});
