import { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];

  try {
    const payload = await getPayloadClient();

    // Fetch all published articles
    try {
      const articles = await payload.find({
        collection: "articles",
        where: { status: { equals: "published" } },
        limit: 1000,
        depth: 0,
      });
      articles.docs.forEach((article) => {
        sitemap.push({
          url: `${baseUrl}/articles/${article.slug}`,
          lastModified: new Date(article.updatedAt),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    } catch (_) { }

    // Fetch all categories
    try {
      const categories = await payload.find({
        collection: "categories",
        limit: 100,
        depth: 0,
      });
      categories.docs.forEach((category) => {
        sitemap.push({
          url: `${baseUrl}/category/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.7,
        });
      });
    } catch (_) { }

    // Fetch all authors
    try {
      const authors = await payload.find({
        collection: "authors",
        limit: 100,
        depth: 0,
      });
      authors.docs.forEach((author) => {
        sitemap.push({
          url: `${baseUrl}/author/${author.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      });
    } catch (_) { }

    // Fetch all published pages
    try {
      const pages = await payload.find({
        collection: "pages",
        where: { status: { equals: "published" } },
        limit: 100,
        depth: 0,
      });
      pages.docs.forEach((page) => {
        sitemap.push({
          url: `${baseUrl}/${page.slug}`,
          lastModified: new Date(page.updatedAt),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      });
    } catch (_) { }
  } catch (_) {
    // DB unavailable during build — return static routes only
  }

  return sitemap;
}
