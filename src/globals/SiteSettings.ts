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
              defaultValue: "अम्पिपाल अस्पताल",
            },
            {
              name: "hospitalNameEn",
              type: "text",
              label: "Hospital Name (English)",
              required: true,
              defaultValue: "Amppipal Hospital",
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
            {
              name: "contactEmail",
              type: "email",
              label: "Email",
              defaultValue: "Amppipalhospital25@gmail.com"
            },
            {
              name: "contactPhone",
              type: "text",
              label: "Main Phone",
              defaultValue: "00977-9846-208709"
            },
            { name: "emergencyNumber", type: "text", label: "Emergency Number" },
            { name: "faxNumber", type: "text", label: "Fax Number" },
            {
              name: "address",
              type: "textarea",
              label: "Address (Nepali)",
              defaultValue: "पालुङटार नगरपालिका – ३, गोरखा, नेपाल"
            },
            {
              name: "addressEn",
              type: "text",
              label: "Address (English)",
              defaultValue: "Palungtar Municipality - 3, Gorkha, Nepal"
            },
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
            {
              name: "facebook",
              type: "text",
              label: "Facebook Page URL",
            },
            {
              name: "facebookPageName",
              type: "text",
              label: "Facebook Page Name",
              defaultValue: "धौलागिरी प्रादेशिक अस्पताल",
            },
            {
              name: "facebookFollowers",
              type: "text",
              label: "Facebook Followers (e.g., 4.5K)",
              defaultValue: "4.5K",
            },
            { name: "twitter", type: "text", label: "Twitter/X URL" },
            { name: "youtube", type: "text", label: "YouTube URL" },
            { name: "instagram", type: "text", label: "Instagram URL" },
            { name: "tiktok", type: "text", label: "TikTok URL" },
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
