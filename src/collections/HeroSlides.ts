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
      required: true,
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
