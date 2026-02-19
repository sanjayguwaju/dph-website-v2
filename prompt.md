# Tech Stack & Architecture Prompt

You are an expert full-stack web developer specializing in **Next.js 15**, **Payload CMS 3.0**, and **Tailwind CSS 4**.

Your task is to build a modern, high-performance website using the following specific tech stack and architectural patterns.

## 1. Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **CMS / Backend**: Payload CMS 3.0 (Serverless/Next.js native integration)
-   **Database**: MongoDB (via `@payloadcms/db-mongodb`)
-   **Styling**: Tailwind CSS 4 + Shadcn/ui-inspired components
-   **Icons**: Lucide React
-   **Rich Text**: Payload Lexical Editor
-   **Storage**: S3 (via `@payloadcms/storage-s3`)

## 2. Project Architecture

The project must follow this strict directory structure:

```
src/
├── app/
│   ├── (frontend)/       # Public facing Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with Header/Footer
│   │   ├── page.tsx      # Homepage
│   │   └── ...routes
│   ├── (payload)/        # Payload CMS Admin routes
│   │   ├── admin/
│   │   ├── api/
│   │   └── ...
├── collections/          # Payload Collection Definitions (Database Schema)
│   ├── Users.ts
│   ├── Pages.ts
│   └── ...
├── globals/              # Payload Global Definitions (Site Settings, Header, Footer)
│   ├── SiteSettings.ts
│   └── ...
├── components/
│   ├── ui/               # Generic UI components (Buttons, Inputs, etc.)
│   ├── layout/           # Header, Footer, Sidebar
│   ├── blocks/           # Reusable Blocks for Lexical Editor
│   └── [feature]/        # Feature-specific components (e.g., article/, product/)
├── lib/
│   ├── queries/          # Data fetching logic (Payload Local API)
│   └── utils.ts          # Helper functions (cn, etc.)
├── payload.config.ts     # Main Payload CMS Configuration
└── payload-types.ts      # Auto-generated Types
```

## 3. Key Implementation Patterns

### A. Data Fetching (Server Components)
-   **Do not** use `fetch` API calls to `localhost:3000/api/...` for internal data requirements.
-   **Do** use Payload's **Local API** directly in Server Components.
-   Example:
    ```typescript
    import { getPayload } from 'payload'
    import config from '@/payload.config'

    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'articles',
      limit: 10,
    })
    ```
-   Encapsulate queries in `src/lib/queries/` functions.

### B. Styling & UI
-   Use **Tailwind CSS 4**.
-   Implement a basic design system with `src/components/ui` for atomic components (Button, Card, Badge).
-   Use `class-variance-authority` (cva) and `clsx` for managing component variants.
-   Ensure responsive design (Mobile First).

### C. CMS Configuration (Payload)
-   Define strict schemas in `src/collections`.
-   Use **Lexical Editor** for rich text content.
-   Enable **Draft Mode** (Versions) where appropriate.
-   Implementation details:
    -   `slug` fields should auto-generate from titles via hooks.
    -   `upload` fields should point to a `Media` collection managed by S3.

## 4. Development Workflow

1.  **Define Schema**: Start by defining the Payload Collections and Globals in `src/collections` and `src/globals`.
2.  **Config**: Register them in `payload.config.ts`.
3.  **UI Components**: Build the necessary UI components in `src/components`.
4.  **Pages**: Assemble the frontend pages in `src/app/(frontend)` using Server Components to fetch data from Payload.

## 5. Security & Performance

-   Implement specific `access` control functions in Collections (e.g., `read: publishedOnly`, `update: authenticated`).
-   Use `next/image` for image optimization.
-   Use `generateMetadata` in `page.tsx`/`layout.tsx` fetching from `SiteSettings` global.
