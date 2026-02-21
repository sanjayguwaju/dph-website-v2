import type { CollectionConfig } from "payload";

export const Staff: CollectionConfig = {
  slug: "staff",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "designation", "department", "order"],
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
      name: "nameEn",
      type: "text",
      label: "Name (English)",
    },
    {
      name: "designation",
      type: "text",
      required: true,
      localized: true,
      label: "Designation / Title",
    },
    {
      name: "department",
      type: "text",
      localized: true,
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "externalPhoto",
      type: "text",
      label: "External Photo URL (for demo)",
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "email",
      type: "email",
    },
    {
      name: "bio",
      type: "textarea",
      localized: true,
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Chairperson", value: "chair" },
        { label: "Chief Medical Superintendent", value: "cms" },
        { label: "Information Officer", value: "info-officer" },
        { label: "Doctor", value: "doctor" },
        { label: "Nurse", value: "nurse" },
        { label: "Administrative", value: "administrative" },
        { label: "Other", value: "other" },
        { label: "Management Committee Member", value: "management-committee" },
      ],
    },
    {
      name: "showOnHomepage",
      type: "checkbox",
      label: "Show on Homepage Sidebar",
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
