import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "@/utils/locale-server";

export const getHomepageStaff = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const staff = await payload.find({
      collection: "staff",
      where: {
        and: [{ showOnHomepage: { equals: true } }, { isActive: { equals: true } }],
      },
      locale: locale as any,
      sort: "order",
      limit: 6,
      depth: 1,
    });
    return staff.docs || [];
  } catch (error) {
    return [];
  }
});

export const getHomepageServices = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const services = await payload.find({
      collection: "services",
      where: { isActive: { equals: true } },
      locale: locale as any,
      sort: "order",
      limit: 50,
      depth: 1,
    });
    return services.docs;
  } catch (error) {
    return [];
  }
});

export const getHomepageNews = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const [featured, recent] = await Promise.all([
      payload.find({
        collection: "news",
        where: {
          and: [{ status: { equals: "published" } }, { isFeatured: { equals: true } }],
        },
        locale: locale as any,
        sort: "-publishedDate",
        limit: 1,
        depth: 1,
      }),
      payload.find({
        collection: "news",
        where: { status: { equals: "published" } },
        locale: locale as any,
        sort: "-publishedDate",
        limit: 5,
        depth: 1,
      }),
    ]);
    return { featured: featured.docs[0] ?? null, recent: recent.docs || [] };
  } catch (error) {
    return { featured: null, recent: [] };
  }
});

export const getNoticesByType = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const [notices, news, pressReleases, publications, bids] = await Promise.all([
      payload.find({
        collection: "notices",
        where: { status: { equals: "published" } },
        locale: locale as any,
        sort: "-publishedDate",
        limit: 8,
        depth: 1,
      }),
      payload.find({
        collection: "news",
        where: { and: [{ status: { equals: "published" } }, { type: { equals: "news" } }] },
        locale: locale as any,
        sort: "-publishedDate",
        limit: 8,
        depth: 1,
      }),
      payload.find({
        collection: "news",
        where: { and: [{ status: { equals: "published" } }, { type: { equals: "press-release" } }] },
        locale: locale as any,
        sort: "-publishedDate",
        limit: 8,
        depth: 1,
      }),
      payload.find({
        collection: "news",
        where: { and: [{ status: { equals: "published" } }, { type: { equals: "publication" } }] },
        locale: locale as any,
        sort: "-publishedDate",
        limit: 8,
        depth: 1,
      }),
      payload.find({
        collection: "news",
        where: { and: [{ status: { equals: "published" } }, { type: { equals: "bid" } }] },
        locale: locale as any,
        sort: "-publishedDate",
        limit: 8,
        depth: 1,
      }),
    ]);
    return {
      notices: notices.docs || [],
      news: news.docs || [],
      pressReleases: pressReleases.docs || [],
      publications: publications.docs || [],
      bids: bids.docs || [],
    };
  } catch (error) {
    return {
      notices: [],
      news: [],
      pressReleases: [],
      publications: [],
      bids: [],
    };
  }
});

export const getPhotoGalleryPreview = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const albums = await payload.find({
      collection: "photo-gallery",
      where: { isActive: { equals: true } },
      locale: locale as any,
      sort: "-publishedDate",
      limit: 8,
      depth: 2,
    });
    return albums.docs || [];
  } catch (error) {
    return [];
  }
});

export const getVideoGalleryPreview = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const videos = await payload.find({
      collection: "video-gallery",
      where: { isActive: { equals: true } },
      locale: locale as any,
      sort: "-publishedDate",
      limit: 6,
      depth: 0,
    });
    return videos.docs || [];
  } catch (error) {
    return [];
  }
});

export const getQuickLinks = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    const links = await payload.find({
      collection: "quick-links",
      where: { isActive: { equals: true } },
      locale: locale as any,
      sort: "order",
      limit: 20,
      depth: 0,
    });
    return links.docs || [];
  } catch (error) {
    return [];
  }
});

export const getOpdStats = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const locale = await getLocale();
    return await payload.findGlobal({ slug: "opd-stats", locale: locale as any });
  } catch (error) {
    return {};
  }
});
