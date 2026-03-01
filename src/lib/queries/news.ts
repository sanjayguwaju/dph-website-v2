import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getNewsBySlug = cache(async (slug: string) => {
    try {
        const payload = await getPayloadClient();

        const result = await payload.find({
            collection: "news",
            where: {
                or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
            },
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
        const result = await payload.find({
            collection: "news",
            where: {
                status: { equals: "published" },
            },
            sort: "-publishedDate",
            limit,
            depth: 1,
        });
        return result.docs || [];
    } catch (error) {
        return [];
    }
});
