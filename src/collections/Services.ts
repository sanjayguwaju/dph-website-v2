import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "icon", "category", "order", "isActive"],
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
        description: "URL-friendly identifier (auto-generated if blank)",
      },
    },
    {
      name: "icon",
      type: "text",
      label: "Icon (emoji or Lucide icon name)",
      admin: {
        description: 'e.g. "🏥" or "stethoscope"',
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Service Image (optional)",
    },
    {
      name: "shortDescription",
      type: "textarea",
      localized: true,
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Outpatient", value: "opd" },
        { label: "Inpatient", value: "ipd" },
        { label: "Emergency", value: "emergency" },
        { label: "Diagnostic", value: "diagnostic" },
        { label: "Maternal & Child", value: "maternal-child" },
        { label: "Specialized", value: "specialized" },
        { label: "Support Services", value: "support" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "time",
      type: "text",
      localized: true,
      label: "Time (e.g., 9:00 AM - 5:00 PM)",
    },
    {
      name: "fee",
      type: "text",
      localized: true,
      label: "Fee (e.g., Free, Rs. 500)",
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      label: "Detailed Content",
    },
    {
      name: "link",
      type: "text",
      label: "Detail Page URL (optional)",
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
