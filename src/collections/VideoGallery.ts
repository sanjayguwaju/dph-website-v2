import type { CollectionConfig } from "payload";

export const VideoGallery: CollectionConfig = {
  slug: "video-gallery",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedDate", "isActive"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "youtubeUrl",
      type: "text",
      required: true,
      label: "YouTube Video URL",
      admin: {
        description: "Full YouTube URL (e.g. https://www.youtube.com/watch?v=xxxxx)",
      },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      label: "Custom Thumbnail (optional — falls back to YouTube thumbnail)",
    },
    {
      name: "publishedDate",
      type: "date",
      defaultValue: () => new Date(),
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
