import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getCategories = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();

    const categories = await payload.find({
      collection: "categories",
      limit: 100,
      sort: "order",
      locale: locale as any,
      depth: 1,
    });

    return categories.docs || [];
  } catch (error) {
    return [];
  }
});

export const getCategoryBySlug = cache(async (slug: string) => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();

    const categories = await payload.find({
      collection: "categories",
      where: {
        slug: { equals: slug },
      },
      locale: locale as any,
      limit: 1,
      depth: 2,
    });

    return categories.docs[0] || null;
  } catch (error) {
    return null;
  }
});

export const getCategoryWithArticleCount = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();

    const categories = await payload.find({
      collection: "categories",
      limit: 100,
      sort: "order",
      locale: locale as any,
      depth: 0,
    });

    // Get article counts for each category
    const categoriesWithCount = await Promise.all(
      categories.docs.map(async (category) => {
        try {
          const articles = await payload.count({
            collection: "articles",
            where: {
              category: { equals: category.id },
              status: { equals: "published" },
            },
            locale: locale as any,
          });
          return {
            ...category,
            articleCount: articles.totalDocs,
          };
        } catch (error) {
          return {
            ...category,
            articleCount: 0,
          };
        }
      }),
    );

    return categoriesWithCount;
  } catch (error) {
    return [];
  }
});
