import { Metadata } from "next";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import { PhotoGalleryClient } from "./photo-gallery-client";
import { PageLayout } from "@/components/layout/page-layout";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalNameEn || "Amppipal Hospital";

  return {
    title: `Photo Gallery | ${hospitalName}`,
    description: `Browse official photo gallery of ${hospitalName}`,
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

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "photo-gallery",
    where: { isActive: { equals: true } },
    sort: "-publishedDate",
    limit,
    page: currentPage,
    depth: 2,
  });

  const { docs, totalPages } = result;

  return (
    <PageLayout
      breadcrumbs={[{ label: "Photos" }]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-8 pb-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--brand-blue)] flex items-center gap-3">
            📷 Photos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {docs.length} albums · {docs.flatMap((a: any) => a.images ?? []).length} Photos
          </p>
        </div>
        <Link href="/gallery/videos" className="text-sm font-semibold text-[var(--brand-blue)] hover:underline flex items-center gap-1">
          🎥 Videos →
        </Link>
      </div>

      <PhotoGalleryClient albums={docs as any} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="page-pagination mt-10">
          {currentPage > 1 && (
            <Link href={`/gallery/photos?page=${currentPage - 1}`} className="page-nav-btn">
              ‹ Prev
            </Link>
          )}
          <span className="page-num">{currentPage} / {totalPages}</span>
          {currentPage < totalPages && (
            <Link href={`/gallery/photos?page=${currentPage + 1}`} className="page-nav-btn">
              Next ›
            </Link>
          )}
        </div>
      )}
    </PageLayout>
  );
}
