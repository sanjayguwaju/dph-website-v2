import type { Block } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Banner: Block = {
  slug: "banner",
  labels: {
    singular: "Banner",
    plural: "Banners",
  },
  fields: [
    {
      name: "style",
      type: "select",
      defaultValue: "info",
      options: [
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Success", value: "success" },
        { label: "Error", value: "error" },
      ],
      required: true,
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
      required: true,
    },
  ],
};
