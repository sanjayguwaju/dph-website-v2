import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            {
              name: "siteName",
              type: "text",
              required: true,
              defaultValue: "The Daily Chronicle",
            },
            {
              name: "siteDescription",
              type: "textarea",
              required: true,
              defaultValue: "Your trusted source for breaking news and in-depth reporting",
            },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "favicon",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "siteUrl",
              type: "text",
              required: true,
              defaultValue: "http://localhost:3000",
            },
          ],
        },
        {
          label: "Social Media",
          fields: [
            { name: "twitter", type: "text" },
            { name: "facebook", type: "text" },
            { name: "instagram", type: "text" },
            { name: "youtube", type: "text" },
            { name: "linkedin", type: "text" },
          ],
        },
        {
          label: "Analytics",
          fields: [
            {
              name: "googleAnalyticsId",
              type: "text",
              admin: {
                description: "GA4 Measurement ID (e.g., G-XXXXXXXXXX)",
              },
            },
            {
              name: "googleTagManagerId",
              type: "text",
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            { name: "contactEmail", type: "email" },
            { name: "contactPhone", type: "text" },
            { name: "address", type: "textarea" },
          ],
        },
      ],
    },
  ],
};
