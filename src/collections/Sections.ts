import type { CollectionConfig } from "payload";

export const Sections: CollectionConfig = {
    slug: "sections",
    admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "order", "isActive"],
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => Boolean(user),
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            localized: true,
        },
        {
            name: "slug",
            type: "text",
            admin: {
                description: "URL-friendly identifier",
            },
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
        },
    ],
};
