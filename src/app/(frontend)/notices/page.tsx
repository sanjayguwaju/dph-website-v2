import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";
import { formatDate } from "@/utils/format";
import { FileText, Download, Calendar, ChevronRight, Bell } from "lucide-react";

import { getLocale } from "@/utils/locale-server";
import { toNepaliNum } from "@/utils/nepali-date";

import { PageLayout } from "@/components/layout/page-layout";
import { NoticeFilter } from "@/components/notices/NoticeFilter";
import "./notices.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "धौलागिरी प्रादेशिक अस्पताल" : "Dhaulagiri Provincial Hospital");

  const title = locale === "ne" ? `सूचनाहरू | ${hospitalName}` : `Notices | ${hospitalName}`;
  const description = locale === "ne"
    ? `${hospitalName} बाट जारी आधिकारिक सूचनाहरू, परिपत्रहरू र घोषणाहरू।`
    : `Official notices, circulars and announcements from ${hospitalName}.`;

  return {
    title,
    description,
  };
}

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    title?: string;
    category?: string;
    fromDate?: string;
    toDate?: string;
  }>;
}) {
  const [{ page, title, fromDate, toDate }, locale] = await Promise.all([
    searchParams,
    getLocale()
  ]);
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 20;

  let docs: any[] = [];
  let totalPages = 0;
  let totalDocs = 0;

  try {
    const payload = await getPayloadClient();

    // Build query
    const where: any = {
      status: { equals: "published" },
    };

    if (title) {
      where.title = { contains: title };
    }

    if (fromDate || toDate) {
      const dateQuery: any = {};
      if (fromDate) dateQuery.greater_than_equal = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        dateQuery.less_than_equal = end;
      }
      where.publishedDate = dateQuery;
    }

    const result = await payload.find({
      collection: "notices",
      where,
      sort: "-publishedDate",
      limit,
      page: currentPage,
      depth: 1,
      locale: locale as any,
    });
    docs = result.docs;
    totalPages = result.totalPages;
    totalDocs = result.totalDocs;
  } catch (_) { }

  const labels = {
    title: locale === "ne" ? "सूचनाहरू" : "Notices",
    empty: locale === "ne" ? "कुनै डेटा उपलब्ध छैन" : "No data available",
    prev: locale === "ne" ? "‹ अघिल्लो" : "‹ Prev",
    next: locale === "ne" ? "अर्को ›" : "Next ›",
    publishedDate: locale === "ne" ? "प्रकाशित मिति" : "Published Date",
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.title },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="notices-container">
        <div className="notices-title-wrap">
          <h1 className="notices-page-title">{labels.title}</h1>
        </div>

        <NoticeFilter locale={locale} />

        <div className="notice-item-list">
          {docs.length === 0 ? (
            <p className="page-empty text-center py-20 text-gray-400 font-bold">{labels.empty}</p>
          ) : (
            docs.map((notice: any) => {
              const file = notice.file && typeof notice.file === "object" ? notice.file : null;
              const fileUrl = file?.url || notice.externalFile || "#";

              return (
                <div key={notice.id} className="notice-ui-item">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="pdf-icon-wrap" title="Download PDF">
                    <div className="pdf-icon-inner">
                      <Download size={20} />
                      <span className="text-[10px] font-bold mt-0.5">PDF</span>
                    </div>
                  </a>

                  <div className="notice-info-wrap">
                    <Link href={`/notices/${notice.id}`} className="notice-ui-title">
                      {notice.title}
                    </Link>
                    <span className="notice-ui-date">
                      {labels.publishedDate}: {notice.publishedDate ? notice.publishedDate.split('T')[0] : ''}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 bg-gray-50 p-4 rounded-lg">
            {currentPage > 1 && (
              <Link
                href={`/notices?page=${currentPage - 1}${title ? `&title=${title}` : ''}${fromDate ? `&fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                {labels.prev}
              </Link>
            )}
            <span className="text-sm font-bold text-gray-600">
              {locale === "ne" ? toNepaliNum(currentPage) : currentPage} / {locale === "ne" ? toNepaliNum(totalPages) : totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/notices?page=${currentPage + 1}${title ? `&title=${title}` : ''}${fromDate ? `&fromDate=${fromDate}` : ''}${toDate ? `&toDate=${toDate}` : ''}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                {labels.next}
              </Link>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
