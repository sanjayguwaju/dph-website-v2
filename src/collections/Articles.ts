import type { CollectionConfig } from "payload";
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  HTMLConverterFeature,
  IndentFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  RelationshipFeature,
  EXPERIMENTAL_TableFeature,
  UnorderedListFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import { Banner } from "@/blocks/Banner";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedDate", "author", "category"],
    group: "Content",
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${data.slug}`,
    },
  },
  versions: {
    maxPerDoc: 50,
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { status: { equals: "published" } };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor",
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === "create" && req.user) {
          data.author = data.author || req.user.id;
          data.createdBy = req.user.id;
        }
        if (req.user) {
          data.updatedBy = req.user.id;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === "update" && doc.status === "published") {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                slug: doc.slug,
                secret: process.env.REVALIDATION_SECRET,
              }),
            });
          } catch (error) {
            console.error("Revalidation failed:", error);
          }
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 150,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Archived", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Feature this article on the homepage",
      },
    },
    {
      name: "breaking",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Mark as breaking news",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: {
        description: "Brief summary for social media and article listings",
      },
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({ blocks: [Banner] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          EXPERIMENTAL_TableFeature(),
          ChecklistFeature(),
          RelationshipFeature({
            enabledCollections: ["articles", "pages", "authors"],
          }),
        ],
      }),
      required: true,
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      // Note: Made optional to allow seeding without media uploads
      filterOptions: {
        mimeType: { contains: "image" },
      },
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
        },
      ],
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      hasMany: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "coAuthors",
      type: "relationship",
      relationTo: "authors",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "readTime",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Estimated reading time in minutes",
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.content) {
              const text = JSON.stringify(data.content);
              const wordCount = text.split(/\s+/).length;
              return Math.ceil(wordCount / 200);
            }
            return 5;
          },
        ],
      },
    },
    {
      name: "views",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "allowComments",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "relatedArticles",
      type: "relationship",
      relationTo: "articles",
      hasMany: true,
      filterOptions: ({ id }) => ({
        id: { not_equals: id },
      }),
    },
    {
      name: "source",
      type: "group",
      fields: [
        { name: "name", type: "text" },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "updatedBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ],
};
