import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getAllServices = cache(async () => {
    try {
        const payload = await getPayloadClient();
        const locale = await getLocale();
        const services = await payload.find({
            collection: "services",
            where: { isActive: { equals: true } },
            locale: locale as any,
            sort: "order",
            limit: 100,
            depth: 1,
        });
        return services.docs || [];
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
});

export const getServiceBySlug = cache(async (slug: string) => {
    try {
        const payload = await getPayloadClient();
        const locale = await getLocale();
        const services = await payload.find({
            collection: "services",
            where: { slug: { equals: slug } },
            locale: locale as any,
            limit: 1,
            depth: 1,
        });
        return services.docs?.[0] || null;
    } catch (error) {
        console.error("Error fetching service by slug:", error);
        return null;
    }
});
