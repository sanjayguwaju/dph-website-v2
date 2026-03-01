import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

// ── Core Collections ──────────────────────────────────────────────────────────
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";

// ── Plugins ────────────────────────────────────────────────────────────────────
import { plugins } from "./plugins";

// ── Editor ────────────────────────────────────────────────────────────────────
import { editor } from "./editor";

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

import { Appointments } from "./collections/Appointments";
import { Feedback } from "./collections/Feedback";

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
    meta: {
      titleSuffix: "- DPH Admin",
      description:
        "DPH Admin Panel - Hospital content management system for managing pages, services, staff, and more.",
      openGraph: {
        title: "DPH Admin",
        description: "DPH Admin Panel - Hospital CMS",
      },
    },
    autoRefresh: true,
    components: {
      graphics: {
        Logo: {
          path: "@/components/Admin/Logo#AdminLogo",
          clientProps: {},
        },
        Icon: {
          path: "@/components/Admin/Logo#AdminLogo",
          clientProps: {},
        },
      },
      beforeDashboard: ["@/components/Admin/BeforeDashboard#BeforeDashboard"],
      afterDashboard: ["@/components/Admin/AfterDashboard#AfterDashboard"],
      views: {
        dashboard: {
          Component: "@/components/Admin/AdminDashboard#AdminDashboardLayout",
        },
        reports: {
          Component: "@/components/Admin/ReportsView#ReportsView",
          path: "/reports",
        },
      },
      providers: ["@/components/NavBadgeProvider"],
    },
  },
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
    defaultFromName: process.env.RESEND_FROM_NAME || "DPH Website",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
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
    // Forms
    Appointments,
    Feedback,
  ],
  globals: [SiteSettings, Navigation, Footer, OpdStats],
  editor,
  // localization: {
  //   locales: [
  //     {
  //       label: "Nepali",
  //       code: "ne",
  //     },
  //     {
  //       label: "English",
  //       code: "en",
  //     },
  //   ],
  //   defaultLocale: "ne",
  //   fallback: true,
  // },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins,
});
