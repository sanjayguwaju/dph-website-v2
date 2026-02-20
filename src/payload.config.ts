import { mongooseAdapter } from "@payloadcms/db-mongodb";
import {
  lexicalEditor,
  // Default features
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
  // Opt-in features
  FixedToolbarFeature,
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  TextStateFeature,
  defaultColors,
} from "@payloadcms/richtext-lexical";
import type { Field } from "payload";
import { s3Storage } from "@payloadcms/storage-s3";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

// ── Core Collections ──────────────────────────────────────────────────────────
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";

// ── Legacy / Retained ─────────────────────────────────────────────────────────
import { Articles } from "./collections/Articles";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Authors } from "./collections/Authors";
import { Comments } from "./collections/Comments";
import { Newsletters } from "./collections/Newsletters";

// ── Hospital Collections ──────────────────────────────────────────────────────
import { Notices } from "./collections/Notices";
import { HeroSlides } from "./collections/HeroSlides";
import { Staff } from "./collections/Staff";
import { Services } from "./collections/Services";
import { News } from "./collections/News";
import { PhotoGallery } from "./collections/PhotoGallery";
import { VideoGallery } from "./collections/VideoGallery";
import { QuickLinks } from "./collections/QuickLinks";

// ── Globals ───────────────────────────────────────────────────────────────────
import { SiteSettings } from "./globals/SiteSettings";
import { Navigation } from "./globals/Navigation";
import { Footer } from "./globals/Footer";
import { OpdStats } from "./globals/OpdStats";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    // Core
    Users,
    Media,
    Pages,
    // Legacy (retained for backward compat during transition)
    Articles,
    Categories,
    Tags,
    Authors,
    Comments,
    Newsletters,
    // Hospital
    Notices,
    HeroSlides,
    Staff,
    Services,
    News,
    PhotoGallery,
    VideoGallery,
    QuickLinks,
  ],
  globals: [SiteSettings, Navigation, Footer, OpdStats],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      // ── Text formatting ──────────────────────────────────────────────────
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      InlineCodeFeature(),

      // ── Structure ───────────────────────────────────────────────────────
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"] }),
      AlignFeature(),
      IndentFeature({ disableTabNode: true }),
      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),
      BlockquoteFeature(),
      HorizontalRuleFeature(),

      // ── Media & Links ───────────────────────────────────────────────────
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

      // ── Toolbars ─────────────────────────────────────────────────────────
      InlineToolbarFeature(),
      FixedToolbarFeature(),

      // ── Advanced: Blocks ─────────────────────────────────────────────────
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
                  { label: "💡 Info", value: "info" },
                  { label: "⚠️ Warning", value: "warning" },
                  { label: "✅ Success", value: "success" },
                  { label: "❌ Error", value: "error" },
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

      // ── Experimental: Table ──────────────────────────────────────────────
      EXPERIMENTAL_TableFeature(),

      // ── Text State (colors + decorations) ────────────────────────────────
      TextStateFeature({
        state: {
          // Payload's built-in palette (spreads a 'text' key with text-red, text-blue, etc.)
          ...defaultColors,
          // Hospital brand accent
          brand: {
            green: {
              label: "Brand Green",
              css: { color: "oklch(0.5 0.2 150)", "font-weight": "bold" },
            },
            muted: { label: "Muted", css: { color: "oklch(0.55 0.04 250)" } },
          },
          // Underline decorations
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
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  sharp,
  plugins: [
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: "media",
              },
            },
            bucket: process.env.S3_BUCKET,
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION || "auto",
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
              },
            },
          }),
        ]
      : []),
    seoPlugin({
      collections: ["news", "pages"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) => `${doc?.title} - Hospital`,
      generateDescription: ({ doc }) => doc?.excerpt || doc?.meta?.description,
    }),
    redirectsPlugin({
      collections: ["news", "pages"],
    }),
  ],
});
