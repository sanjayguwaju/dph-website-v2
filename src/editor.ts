import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
  ParagraphFeature,
  HeadingFeature,
  AlignFeature,
  IndentFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  LinkFeature,
  RelationshipFeature,
  BlockquoteFeature,
  UploadFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  FixedToolbarFeature,
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  TextStateFeature,
  defaultColors,
} from "@payloadcms/richtext-lexical";
import type { Field } from "payload";

export const editor = lexicalEditor({
  features: () => [
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"] }),
    AlignFeature(),
    IndentFeature({ disableTabNode: true }),
    UnorderedListFeature(),
    OrderedListFeature(),
    ChecklistFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    LinkFeature({
      enabledCollections: ["pages", "news", "notices"],
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: "rel",
          type: "select",
          label: "Rel attribute",
          hasMany: true,
          options: [
            { label: "noopener", value: "noopener" },
            { label: "noreferrer", value: "noreferrer" },
            { label: "nofollow", value: "nofollow" },
          ],
        } as Field,
      ],
    }),
    RelationshipFeature({
      enabledCollections: ["pages", "news", "notices", "staff", "services"],
    }),
    UploadFeature({
      enabledCollections: ["media"],
      collections: {
        media: {
          fields: [
            { name: "caption", type: "text", label: "Caption (optional)" },
            { name: "alt", type: "text", label: "Alt Text" },
          ],
        },
      },
    }),
    InlineToolbarFeature(),
    FixedToolbarFeature(),
    BlocksFeature({
      blocks: [
        {
          slug: "callout",
          labels: { singular: "Callout", plural: "Callouts" },
          fields: [
            {
              name: "type",
              type: "select",
              defaultValue: "info",
              options: [
                { label: "Info", value: "info" },
                { label: "Warning", value: "warning" },
                { label: "Success", value: "success" },
                { label: "Error", value: "error" },
              ],
            },
            {
              name: "content",
              type: "textarea",
              label: "Content",
              required: true,
            },
          ],
        },
        {
          slug: "codeBlock",
          labels: { singular: "Code Block", plural: "Code Blocks" },
          fields: [
            {
              name: "language",
              type: "select",
              defaultValue: "typescript",
              options: [
                { label: "TypeScript", value: "typescript" },
                { label: "JavaScript", value: "javascript" },
                { label: "Python", value: "python" },
                { label: "HTML", value: "html" },
                { label: "CSS", value: "css" },
                { label: "JSON", value: "json" },
                { label: "Bash", value: "bash" },
                { label: "Plain text", value: "plaintext" },
              ],
            },
            {
              name: "code",
              type: "code",
              label: "Code",
              required: true,
            },
          ],
        },
      ],
    }),
    EXPERIMENTAL_TableFeature(),
    TextStateFeature({
      state: {
        ...defaultColors,
        brand: {
          green: {
            label: "Brand Green",
            css: { color: "oklch(0.5 0.2 150)", "font-weight": "bold" },
          },
          muted: { label: "Muted", css: { color: "oklch(0.55 0.04 250)" } },
        },
        underline: {
          solid: {
            label: "Solid Underline",
            css: { "text-decoration": "underline", "text-underline-offset": "4px" },
          },
          dashed: {
            label: "Dashed Underline",
            css: {
              "text-decoration": "underline dashed",
              "text-decoration-color": "oklch(0.5 0.2 150)",
              "text-underline-offset": "4px",
            },
          },
        },
      },
    }),
  ],
});
