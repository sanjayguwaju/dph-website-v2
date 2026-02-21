import type { CollectionConfig } from "payload";

export const PhotoGallery: CollectionConfig = {
  slug: "photo-gallery",
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
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover / Thumbnail Image",
    },
    {
      name: "externalCoverImage",
      type: "text",
      label: "External Cover Image URL",
    },
    {
      name: "images",
      type: "array",
      label: "Gallery Images",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: false,
        },
        {
          name: "externalImage",
          type: "text",
          label: "External Image URL",
        },
        {
          name: "caption",
          type: "text",
          localized: true,
        },
      ],
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
