import type { CollectionConfig } from "payload";

export const Comments: CollectionConfig = {
  slug: "comments",
  admin: {
    useAsTitle: "author",
    defaultColumns: ["author", "article", "status", "createdAt"],
    group: "Content",
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { status: { equals: "approved" } };
    },
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "article",
      type: "relationship",
      relationTo: "articles",
      required: true,
      index: true,
    },
    {
      name: "author",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      maxLength: 1000,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Spam", value: "spam" },
      ],
    },
    {
      name: "parentComment",
      type: "relationship",
      relationTo: "comments",
      admin: {
        description: "Parent comment for nested replies",
      },
    },
  ],
};
