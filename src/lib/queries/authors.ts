import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";

export const getAuthors = cache(async () => {
  try {
    const payload = await getPayloadClient();

    const authors = await payload.find({
      collection: "authors",
      limit: 100,
      depth: 1,
    });

    return authors.docs || [];
  } catch (error) {
    return [];
  }
});

export const getAuthorBySlug = cache(async (slug: string) => {
  try {
    const payload = await getPayloadClient();

    const authors = await payload.find({
      collection: "authors",
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 2,
    });

    return authors.docs[0] || null;
  } catch (error) {
    return null;
  }
});

export const getFeaturedAuthors = cache(async (limit = 4) => {
  try {
    const payload = await getPayloadClient();

    const authors = await payload.find({
      collection: "authors",
      where: {
        featured: { equals: true },
      },
      limit,
      depth: 1,
    });

    return authors.docs || [];
  } catch (error) {
    return [];
  }
});
