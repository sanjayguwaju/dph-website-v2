import type { CollectionConfig } from "payload";

export const Timeline: CollectionConfig = {
    slug: "timeline",
    admin: {
        useAsTitle: "year",
        defaultColumns: ["year", "description", "order"],
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => Boolean(user),
    },
    fields: [
        {
            name: "year",
            type: "text",
            required: true,
            label: "Year (e.g. 2015 or 2072 BS)",
        },
        {
            name: "description",
            type: "textarea",
            required: true,
            localized: true,
        },
        {
            name: "order",
            type: "number",
            defaultValue: 0,
        },
        {
            name: "isActive",
            type: "checkbox",
            defaultValue: true,
            admin: { position: "sidebar" },
        },
    ],
};
