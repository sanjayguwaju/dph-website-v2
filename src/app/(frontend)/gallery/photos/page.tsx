import { Metadata } from "next";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { PhotoGalleryClient } from "./photo-gallery-client";
import { getLocale, getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/layout/page-layout";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery");
  const tc = await getTranslations("common");
  return {
    title: `${t("photos")} | ${tc("hospitalName")}`,
    description: `Browse the official photo gallery of ${tc("hospitalName")}`,
  };
}

export default async function PhotoGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 24;
  const locale = await getLocale();
  const t = await getTranslations("gallery");
  const tc = await getTranslations("common");

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "photo-gallery",
    where: { isActive: { equals: true } },
    sort: "-publishedDate",
    limit,
    page: currentPage,
    depth: 2,           // depth:2 so images[] array items are fully populated
    locale: locale as any,
  });

  const { docs, totalPages } = result;

  return (
    <PageLayout
      breadcrumbs={[{ label: t("photos") }]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-8 pb-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--brand-blue)] flex items-center gap-3">
            📷 {t("photos")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {docs.length} {t("albums")} · {docs.flatMap((a: any) => a.images ?? []).length} Photos
          </p>
        </div>
        <Link href="/gallery/videos" className="text-sm font-semibold text-[var(--brand-blue)] hover:underline flex items-center gap-1">
          🎥 {t("videos")} →
        </Link>
      </div>

      <PhotoGalleryClient albums={docs as any} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="page-pagination mt-10">
          {currentPage > 1 && (
            <Link href={`/gallery/photos?page=${currentPage - 1}`} className="page-nav-btn">
              ‹ {tc("prev")}
            </Link>
          )}
          <span className="page-num">{currentPage} / {totalPages}</span>
          {currentPage < totalPages && (
            <Link href={`/gallery/photos?page=${currentPage + 1}`} className="page-nav-btn">
              {tc("next")} ›
            </Link>
          )}
        </div>
      )}
    </PageLayout>
  );
}
