import { s3Storage } from "@payloadcms/storage-s3";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { payloadSidebar } from "payload-sidebar-plugin";
import type { Config } from "payload";

export const plugins: Config["plugins"] = [
  ...(process.env.S3_BUCKET
    ? [
      s3Storage({
        collections: {
          media: {
            prefix: "media",
          },
        },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || "auto",
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
          },
        },
      }),
    ]
    : []),
  seoPlugin({
    collections: ["news", "pages"],
    uploadsCollection: "media",
    generateTitle: ({ doc }) => `${doc?.title} - Hospital`,
    generateDescription: ({ doc }) => doc?.excerpt || doc?.meta?.description,
  }),
  redirectsPlugin({
    collections: ["news", "pages"],
  }),
  payloadSidebar({
    groupOrder: {
      // Navigation group ordering (lower number = higher priority)
      Pages: 1,
      News: 2,
      Services: 3,
      Staff: 4,
      "Photo Gallery": 5,
      "Video Gallery": 6,
      Notices: 7,
      Users: 8,
      Media: 9,
      Settings: 99,
    },
    icons: {
      // Collection icons
      pages: "file-text",
      news: "newspaper",
      services: "briefcase",
      staff: "users",
      notices: "bell",
      media: "images",
      users: "users-round",
      "photo-gallery": "images",
      "video-gallery": "video",
      heroSlides: "image",
      quickLinks: "link",
      articles: "file-pen",
      categories: "folder-tree",
      tags: "tags",
      authors: "user",
      comments: "message-circle",
      newsletters: "mail",
      // Global icons
      "site-settings": "settings",
      navigation: "menu",
      footer: "panel-bottom",
      "opd-stats": "activity",
    },
    enablePinning: true,
    pinnedStorage: "preferences",
  }),
];
