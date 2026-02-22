import type { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "publishedDate", "status"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { status: { equals: "published" } };
    },
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
      name: "slug",
      type: "text",
      required: true,
      admin: {
        description: "URL-friendly identifier",
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "news",
      options: [
        { label: "News", value: "news" },
        { label: "Press Release", value: "press-release" },
        { label: "Publication", value: "publication" },
        { label: "Bid / Tender", value: "bid" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      defaultValue: () => new Date(),
      admin: { position: "sidebar" },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "externalFeaturedImage",
      type: "text",
      label: "External Featured Image URL (for demo/seeding)",
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
    },
    {
      name: "content",
      type: "richText",
      localized: true,
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      label: "Downloadable File (PDF)",
    },
    {
      name: "externalFile",
      type: "text",
      label: "External File URL",
      admin: {
        description: "Direct URL to a PDF/Document for demo purposes.",
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Feature on Homepage",
      defaultValue: false,
    },
  ],
};
