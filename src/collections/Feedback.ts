import type { CollectionConfig } from "payload";

export const Feedback: CollectionConfig = {
  slug: "feedback",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "status", "createdAt"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // Allow public submissions
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone",
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "suggestion",
      options: [
        { label: "Suggestion", value: "suggestion" },
        { label: "Complaint", value: "complaint" },
        { label: "Appreciation", value: "appreciation" },
        { label: "General Feedback", value: "general" },
      ],
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Message",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In Review", value: "in-review" },
        { label: "Resolved", value: "resolved" },
        { label: "Archived", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "adminResponse",
      type: "textarea",
      label: "Admin Response",
      admin: {
        description: "Internal notes or response to the feedback",
      },
    },
  ],
  timestamps: true,
};
