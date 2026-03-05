import { Metadata } from "next";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import { PhotoGalleryClient } from "./photo-gallery-client";
import { PageLayout } from "@/components/layout/page-layout";

import { getLocale } from "@/utils/locale-server";
import { toNepaliNum } from "@/utils/nepali-date";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  return {
    title: locale === "ne" ? `फोटो ग्यालेरी | ${hospitalName}` : `Photo Gallery | ${hospitalName}`,
    description: locale === "ne" ? `${hospitalName} को आधिकारिक फोटो ग्यालेरी हेर्नुहोस्` : `Browse official photo gallery of ${hospitalName}`,
  };
}

export default async function PhotoGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const locale = await getLocale();
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 24;

  let docs: any[] = [];
  let totalPages = 0;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "photo-gallery",
      where: { isActive: { equals: true } },
      locale: locale as any,
      sort: "-publishedDate",
      limit,
      page: currentPage,
      depth: 2,
    });
    docs = JSON.parse(JSON.stringify(result.docs));
    totalPages = result.totalPages;
  } catch (_) { }

  const labels = {
    photos: locale === "ne" ? "फोटोहरू" : "Photos",
    videos: locale === "ne" ? "भिडियोहरू" : "Videos",
    albums: locale === "ne" ? "एल्बमहरू" : "albums",
    photoCount: locale === "ne" ? "फोटोहरू" : "Photos",
    prev: locale === "ne" ? "‹ अघिल्लो" : "‹ Prev",
    next: locale === "ne" ? "अर्को ›" : "Next ›",
  };

  const totalImages = docs.flatMap((a: any) => a.images ?? []).length;

  return (
    <PageLayout
      breadcrumbs={[{ label: labels.photos }]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-8 pb-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-(--brand-blue) flex items-center gap-3">
            📷 {labels.photos}
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-bold">
            {locale === "ne" ? toNepaliNum(docs.length) : docs.length} {labels.albums} · {locale === "ne" ? toNepaliNum(totalImages) : totalImages} {labels.photoCount}
          </p>
        </div>
        <Link href="/gallery/videos" className="text-sm font-bold text-(--brand-blue) hover:underline flex items-center gap-1">
          🎥 {labels.videos} →
        </Link>
      </div>

      <PhotoGalleryClient albums={docs as any} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="page-pagination mt-10">
          {currentPage > 1 && (
            <Link href={`/gallery/photos?page=${currentPage - 1}`} className="page-nav-btn">
              {labels.prev}
            </Link>
          )}
          <span className="page-num font-bold">
            {locale === "ne" ? toNepaliNum(currentPage) : currentPage} / {locale === "ne" ? toNepaliNum(totalPages) : totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/gallery/photos?page=${currentPage + 1}`} className="page-nav-btn">
              {labels.next}
            </Link>
          )}
        </div>
      )}
    </PageLayout>
  );
}
