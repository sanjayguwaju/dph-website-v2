import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "Content",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor",
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "bio",
      type: "textarea",
      required: true,
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      // Note: Made optional to allow seeding without media uploads
    },
    {
      name: "role",
      type: "text",
      required: true,
      admin: {
        description: "E.g., Senior Reporter, Editor-in-Chief",
      },
    },
    {
      name: "social",
      type: "group",
      fields: [
        { name: "twitter", type: "text" },
        { name: "linkedin", type: "text" },
        { name: "facebook", type: "text" },
        { name: "instagram", type: "text" },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
