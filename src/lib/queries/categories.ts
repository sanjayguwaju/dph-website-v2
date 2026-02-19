import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getCategories = cache(async () => {
  const payload = await getPayloadClient();

  const categories = await payload.find({
    collection: "categories",
    limit: 100,
    sort: "order",
    depth: 1,
  });

  return categories.docs;
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient();

  const categories = await payload.find({
    collection: "categories",
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 2,
  });

  return categories.docs[0] || null;
});

export const getCategoryWithArticleCount = cache(async () => {
  const payload = await getPayloadClient();

  const categories = await payload.find({
    collection: "categories",
    limit: 100,
    sort: "order",
    depth: 0,
  });

  // Get article counts for each category
  const categoriesWithCount = await Promise.all(
    categories.docs.map(async (category) => {
      const articles = await payload.count({
        collection: "articles",
        where: {
          category: { equals: category.id },
          status: { equals: "published" },
        },
      });
      return {
        ...category,
        articleCount: articles.totalDocs,
      };
    }),
  );

  return categoriesWithCount;
});
