import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import type { Where } from "payload";

export interface ArticleQueryOptions {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  breaking?: boolean;
  search?: string;
  author?: string;
}

export const getArticles = cache(async (options?: ArticleQueryOptions) => {
  const payload = await getPayloadClient();

  const where: Where = {
    status: { equals: "published" },
  };

  if (options?.category) {
    where.category = { equals: options.category };
  }

  if (options?.tag) {
    where.tags = { contains: options.tag };
  }

  if (options?.featured) {
    where.featured = { equals: true };
  }

  if (options?.breaking) {
    where.breaking = { equals: true };
  }

  if (options?.author) {
    where.author = { equals: options.author };
  }

  if (options?.search) {
    where.or = [{ title: { like: options.search } }, { excerpt: { like: options.search } }];
  }

  const articles = await payload.find({
    collection: "articles",
    where,
    limit: options?.limit || 10,
    page: options?.page || 1,
    sort: "-publishedDate",
    depth: 2,
  });

  return articles;
});

export const getArticleBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient();

  const articles = await payload.find({
    collection: "articles",
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
    limit: 1,
    depth: 3,
  });

  return articles.docs[0] || null;
});

export const getRelatedArticles = cache(
  async (articleId: string, categoryId: string, limit = 4) => {
    const payload = await getPayloadClient();

    const articles = await payload.find({
      collection: "articles",
      where: {
        and: [
          { id: { not_equals: articleId } },
          { category: { equals: categoryId } },
          { status: { equals: "published" } },
        ],
      },
      limit,
      sort: "-publishedDate",
      depth: 1,
    });

    return articles.docs;
  },
);

export const searchArticles = cache(async (query: string, limit = 10) => {
  const payload = await getPayloadClient();

  const articles = await payload.find({
    collection: "articles",
    where: {
      and: [
        {
          or: [{ title: { like: query } }, { excerpt: { like: query } }],
        },
        { status: { equals: "published" } },
      ],
    },
    limit,
    depth: 1,
  });

  return articles.docs;
});

export const getTrendingArticles = cache(async (limit = 5) => {
  const payload = await getPayloadClient();

  const articles = await payload.find({
    collection: "articles",
    where: {
      status: { equals: "published" },
    },
    limit,
    sort: "-views",
    depth: 1,
  });

  return articles.docs;
});
