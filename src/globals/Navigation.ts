import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor",
  },
  fields: [
    {
      name: "mainNav",
      type: "array",
      label: "Main Navigation",
      maxRows: 10,
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
            { label: "Category", value: "category" },
            { label: "Page", value: "page" },
            { label: "Custom URL", value: "custom" },
          ],
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
          name: "page",
          type: "relationship",
          relationTo: "pages",
          admin: {
            condition: (data, siblingData) => siblingData?.type === "page",
          },
        },
        {
          name: "customUrl",
          type: "text",
          admin: {
            condition: (data, siblingData) => siblingData?.type === "custom",
          },
        },
        {
          name: "openInNewTab",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "subMenu",
          type: "array",
          label: "Sub Menu Items",
          maxRows: 10,
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
                { label: "Category", value: "category" },
                { label: "Page", value: "page" },
                { label: "Custom URL", value: "custom" },
              ],
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
              name: "page",
              type: "relationship",
              relationTo: "pages",
              admin: {
                condition: (data, siblingData) => siblingData?.type === "page",
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
  ],
};
