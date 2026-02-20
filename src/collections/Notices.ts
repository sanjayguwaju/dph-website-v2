import type { CollectionConfig } from "payload";

export const Notices: CollectionConfig = {
  slug: "notices",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedDate", "status"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        status: {
          equals: "published",
        },
      };
    },
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
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      label: "Downloadable File (PDF)",
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: "showInPopup",
      type: "checkbox",
      label: "Show in Popup on Frontend",
      defaultValue: false,
    },
    {
      name: "popupStartDate",
      type: "date",
      admin: {
        condition: (_, siblingData) => siblingData?.showInPopup,
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "popupEndDate",
      type: "date",
      admin: {
        condition: (_, siblingData) => siblingData?.showInPopup,
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Published",
          value: "published",
        },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
};
