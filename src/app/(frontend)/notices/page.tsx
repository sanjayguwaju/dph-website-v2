import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";
import { formatDate } from "@/utils/format";
import { FileText, Download, Calendar, ChevronRight, Bell } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalNameEn || "Amppipal Hospital";

  return {
    title: `Notices | ${hospitalName}`,
    description: `Official notices, circulars and announcements from ${hospitalName}.`,
  };
}

import { PageLayout } from "@/components/layout/page-layout";

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 20;

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "notices",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    limit,
    page: currentPage,
    depth: 1,
  });

  const { docs, totalPages, totalDocs } = result;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Notices" },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-[#003580] mb-2 flex items-center gap-2">
          <Bell size={28} className="text-[#dc2626]" />
          Notices
        </h1>
        <p className="text-gray-500">
          {`${totalDocs} official notices and announcements`}
        </p>
      </div>

      {/* Notices list */}
      <div className="space-y-4">
        {docs.length === 0 ? (
          <p className="page-empty text-center py-20 text-gray-400">No data available</p>
        ) : (
          docs.map((notice: any) => {
            const file =
              notice.file && typeof notice.file === "object" ? notice.file : null;
            const hasPdf = file?.url;

            return (
              <div key={notice.id} className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden hover:border-[#2563eb] transition-colors p-5 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* PDF icon badge */}
                <div className="hidden md:flex flex-col items-center justify-center bg-[#fff8f8] border border-[#ffe4e4] rounded px-3 py-2 shrink-0">
                  <FileText size={20} className="text-[#dc2626]" />
                  <span className="text-[10px] font-bold text-[#dc2626] mt-0.5">PDF</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/notices/${notice.id}`}
                    className="text-lg font-bold text-black hover:text-[#2563eb] transition-colors leading-snug line-clamp-2 block mb-1"
                  >
                    {notice.title}
                  </Link>
                  <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-2">
                    {notice.publishedDate && (
                      <time className="flex items-center gap-1">
                        <Calendar size={13} className="opacity-70" />
                        {formatDate(notice.publishedDate, "short")}
                      </time>
                    )}
                  </div>
                  {notice.description && (
                    <p className="text-sm text-gray-600 line-clamp-1">{notice.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <Link
                    href={`/notices/${notice.id}`}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2 bg-[#2563eb] text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
                  >
                    View
                    <ChevronRight size={14} />
                  </Link>
                  {hasPdf && (
                    <a
                      href={file.url}
                      download={file.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-50 text-gray-600 rounded border border-gray-100 hover:bg-gray-100 transition-colors"
                      title="Download"
                    >
                      <Download size={18} />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="page-pagination mt-12">
          {currentPage > 1 && (
            <Link href={`/notices?page=${currentPage - 1}`} className="page-nav-btn">
              ‹ Prev
            </Link>
          )}
          <span className="page-num">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/notices?page=${currentPage + 1}`} className="page-nav-btn">
              Next ›
            </Link>
          )}
        </div>
      )}
    </PageLayout>
  );
}
