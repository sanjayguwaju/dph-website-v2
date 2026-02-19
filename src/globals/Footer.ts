import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor",
  },
  fields: [
    {
      name: "copyright",
      type: "text",
      required: true,
      defaultValue: "© 2025 The Daily Chronicle. All rights reserved.",
    },
    {
      name: "footerText",
      type: "textarea",
      admin: {
        description: "Additional footer text or disclaimer",
      },
    },
    {
      name: "columns",
      type: "array",
      label: "Footer Columns",
      maxRows: 4,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "links",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "type",
              type: "select",
              required: true,
              options: [
                { label: "Page", value: "page" },
                { label: "Category", value: "category" },
                { label: "Custom URL", value: "custom" },
              ],
            },
            {
              name: "page",
              type: "relationship",
              relationTo: "pages",
              admin: {
                condition: (data, siblingData) => siblingData?.type === "page",
              },
            },
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              admin: {
                condition: (data, siblingData) => siblingData?.type === "category",
              },
            },
            {
              name: "customUrl",
              type: "text",
              admin: {
                condition: (data, siblingData) => siblingData?.type === "custom",
              },
            },
          ],
        },
      ],
    },
    {
      name: "bottomLinks",
      type: "array",
      label: "Bottom Footer Links",
      admin: {
        description: "Privacy Policy, Terms of Service, etc.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
        },
        {
          name: "customUrl",
          type: "text",
        },
      ],
    },
  ],
};
