import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getAllStaff = cache(async () => {
    try {
        const payload = await getPayloadClient();
        const locale = await getLocale();
        const staff = await payload.find({
            collection: "staff",
            where: {
                isActive: { equals: true },
            },
            locale: locale as any,
            sort: "order",
            limit: 100,
            depth: 1,
        });
        return staff.docs || [];
    } catch (error) {
        console.error("Error fetching all staff:", error);
        return [];
    }
});
export const getManagementCommittee = cache(async () => {
    try {
        const payload = await getPayloadClient();
        const locale = await getLocale();
        const staff = await payload.find({
            collection: "staff",
            where: {
                and: [
                    { role: { equals: "management-committee" } },
                    { isActive: { equals: true } }
                ]
            },
            locale: locale as any,
            sort: "order",
            limit: 100,
            depth: 1,
        });
        return staff.docs || [];
    } catch (error) {
        console.error("Error fetching management committee:", error);
        return [];
    }
});
