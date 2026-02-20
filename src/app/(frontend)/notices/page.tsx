import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import Link from "next/link";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = {
  title: "सूचनाहरू | Notices",
  description: "अस्पतालका सूचना, निर्देशन र घोषणाहरू",
};

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 15;

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "notices",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    limit,
    page: currentPage,
    depth: 0,
  });

  const { docs, totalPages } = result;

  return (
    <main className="page-container">
      <div className="page-hero">
        <h1 className="page-hero-title">📢 सूचनाहरू</h1>
      </div>

      <div className="notices-page-list">
        {docs.length === 0 ? (
          <p className="page-empty">कुनै सूचना उपलब्ध छैन।</p>
        ) : (
          docs.map((notice: any) => (
            <div key={notice.id} className="notice-page-row">
              <div className="notice-page-content">
                <span className="notices-row-bullet">›</span>
                <Link href={`/notices/${notice.id}`} className="notice-page-title">
                  {notice.title}
                </Link>
              </div>
              <div className="notice-page-meta">
                {notice.publishedDate && (
                  <time className="notices-row-date">
                    {formatDate(notice.publishedDate, "short")}
                  </time>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="page-pagination">
          {currentPage > 1 && (
            <Link href={`/notices?page=${currentPage - 1}`} className="page-nav-btn">
              ‹ अघिल्लो
            </Link>
          )}
          <span className="page-num">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/notices?page=${currentPage + 1}`} className="page-nav-btn">
              अर्को ›
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
