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
              name: "hospitalNameNe",
              type: "text",
              label: "Hospital Name (Nepali)",
              required: true,
              defaultValue: "अस्पताल",
            },
            {
              name: "hospitalNameEn",
              type: "text",
              label: "Hospital Name (English)",
              required: true,
              defaultValue: "District Hospital",
            },
            {
              name: "taglineNe",
              type: "text",
              label: "Tagline (Nepali)",
              defaultValue: "स्वास्थ्य सेवा, सबैका लागि",
            },
            {
              name: "taglineEn",
              type: "text",
              label: "Tagline (English)",
              defaultValue: "Healthcare for All",
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
            {
              name: "aboutUs",
              type: "textarea",
              label: "About Us (short paragraph for homepage)",
              localized: true,
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            { name: "contactEmail", type: "email", label: "Email" },
            { name: "contactPhone", type: "text", label: "Main Phone" },
            { name: "emergencyNumber", type: "text", label: "Emergency Number" },
            { name: "faxNumber", type: "text", label: "Fax Number" },
            { name: "address", type: "textarea", label: "Address (Nepali)" },
            { name: "addressEn", type: "text", label: "Address (English)" },
            {
              name: "mapEmbedUrl",
              type: "text",
              label: "Google Maps Embed URL",
              admin: {
                description: "Paste the src URL from Google Maps > Share > Embed a map",
              },
            },
          ],
        },
        {
          label: "Social Media",
          fields: [
            { name: "facebook", type: "text" },
            { name: "twitter", type: "text" },
            { name: "youtube", type: "text" },
            { name: "instagram", type: "text" },
            { name: "tiktok", type: "text" },
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
          ],
        },
      ],
    },
  ],
};
