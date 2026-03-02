import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getNewsBySlug = cache(async (slug: string) => {
    try {
        const payload = await getPayloadClient();

        const locale = await getLocale();

        const result = await payload.find({
            collection: "news",
            where: {
                or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
            },
            locale: locale as any,
            limit: 1,
            depth: 1,
        });

        return result.docs[0] || null;
    } catch (error) {
        return null;
    }
});

export const getLatestNews = cache(async (limit = 10) => {
    try {
        const payload = await getPayloadClient();
        const locale = await getLocale();
        const result = await payload.find({
            collection: "news",
            where: {
                status: { equals: "published" },
            },
            locale: locale as any,
            sort: "-publishedDate",
            limit,
            depth: 1,
        });
        return result.docs || [];
    } catch (error) {
        return [];
    }
});
