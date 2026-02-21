import type { CollectionConfig } from "payload";

export const HeroSlides: CollectionConfig = {
  slug: "hero-slides",
  admin: {
    useAsTitle: "caption",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: false, // Make optional if external image is provided
    },
    {
      name: "externalImage",
      type: "text",
      label: "External Image URL",
      admin: {
        description: "Direct URL to an image (e.g. from Unsplash). Overrides/Fallbacks if no upload.",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "caption",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "link",
      type: "text",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
