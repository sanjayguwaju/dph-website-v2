import { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const payload = await getPayloadClient();

  // Fetch all published articles
  const articles = await payload.find({
    collection: "articles",
    where: { status: { equals: "published" } },
    limit: 1000,
    depth: 0,
  });

  // Fetch all categories
  const categories = await payload.find({
    collection: "categories",
    limit: 100,
    depth: 0,
  });

  // Fetch all authors
  const authors = await payload.find({
    collection: "authors",
    limit: 100,
    depth: 0,
  });

  // Fetch all published pages
  const pages = await payload.find({
    collection: "pages",
    where: { status: { equals: "published" } },
    limit: 100,
    depth: 0,
  });

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

  // Add articles
  articles.docs.forEach((article) => {
    sitemap.push({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Add categories
  categories.docs.forEach((category) => {
    sitemap.push({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    });
  });

  // Add authors
  authors.docs.forEach((author) => {
    sitemap.push({
      url: `${baseUrl}/author/${author.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  // Add pages
  pages.docs.forEach((page) => {
    sitemap.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  return sitemap;
}
