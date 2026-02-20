import type { CollectionConfig } from "payload";

export const QuickLinks: CollectionConfig = {
  slug: "quick-links",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "icon", "order", "isActive"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "icon",
      type: "text",
      label: "Icon (emoji or Lucide icon name)",
      admin: {
        description: 'e.g. "📢" or "bell"',
      },
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
    {
      name: "openInNewTab",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};
