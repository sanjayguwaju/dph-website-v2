import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "next-intl/server";

export const getHomepageStaff = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  const staff = await payload.find({
    collection: "staff",
    where: {
      and: [{ showOnHomepage: { equals: true } }, { isActive: { equals: true } }],
    },
    sort: "order",
    limit: 6,
    depth: 1,
    locale,
  });
  return staff.docs;
});

export const getHomepageServices = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = (await getLocale()) as any;
    const services = await payload.find({
      collection: "services",
      where: { isActive: { equals: true } },
      sort: "order",
      limit: 50,
      depth: 1,
      locale,
    });
    return services.docs;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
});

export const getHomepageNews = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  const [featured, recent] = await Promise.all([
    payload.find({
      collection: "news",
      where: {
        and: [{ status: { equals: "published" } }, { isFeatured: { equals: true } }],
      },
      sort: "-publishedDate",
      limit: 1,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: "news",
      where: { status: { equals: "published" } },
      sort: "-publishedDate",
      limit: 5,
      depth: 1,
      locale,
    }),
  ]);
  return { featured: featured.docs[0] ?? null, recent: recent.docs };
});

export const getNoticesByType = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  const [notices, news, pressReleases, publications, bids] = await Promise.all([
    payload.find({
      collection: "notices",
      where: { status: { equals: "published" } },
      sort: "-publishedDate",
      limit: 8,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: "news",
      where: { and: [{ status: { equals: "published" } }, { type: { equals: "news" } }] },
      sort: "-publishedDate",
      limit: 8,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: "news",
      where: { and: [{ status: { equals: "published" } }, { type: { equals: "press-release" } }] },
      sort: "-publishedDate",
      limit: 8,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: "news",
      where: { and: [{ status: { equals: "published" } }, { type: { equals: "publication" } }] },
      sort: "-publishedDate",
      limit: 8,
      depth: 1,
      locale,
    }),
    payload.find({
      collection: "news",
      where: { and: [{ status: { equals: "published" } }, { type: { equals: "bid" } }] },
      sort: "-publishedDate",
      limit: 8,
      depth: 1,
      locale,
    }),
  ]);
  return {
    notices: notices.docs,
    news: news.docs,
    pressReleases: pressReleases.docs,
    publications: publications.docs,
    bids: bids.docs,
  };
});

export const getPhotoGalleryPreview = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  const albums = await payload.find({
    collection: "photo-gallery",
    where: { isActive: { equals: true } },
    sort: "-publishedDate",
    limit: 8,
    depth: 2,        // depth:2 to hydrate nested images[] items
    locale,
  });
  return albums.docs;
});


export const getVideoGalleryPreview = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  const videos = await payload.find({
    collection: "video-gallery",
    where: { isActive: { equals: true } },
    sort: "-publishedDate",
    limit: 6,
    depth: 0,
    locale,
  });
  return videos.docs;
});

export const getQuickLinks = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  const links = await payload.find({
    collection: "quick-links",
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 20,
    depth: 0,
    locale,
  });
  return links.docs;
});

export const getOpdStats = cache(async () => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;
  return await payload.findGlobal({ slug: "opd-stats", locale });
});
