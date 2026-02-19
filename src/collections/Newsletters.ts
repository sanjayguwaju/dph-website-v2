import type { CollectionConfig } from "payload";

export const Newsletters: CollectionConfig = {
  slug: "newsletters",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "status", "createdAt"],
    group: "Marketing",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "subscribed",
      options: [
        { label: "Subscribed", value: "subscribed" },
        { label: "Unsubscribed", value: "unsubscribed" },
      ],
    },
    {
      name: "preferences",
      type: "array",
      fields: [
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
        },
      ],
    },
  ],
};
