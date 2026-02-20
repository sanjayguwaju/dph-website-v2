import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = {
  title: "समाचार तथा गतिविधि | News & Activities",
  description: "अस्पतालका ताजा समाचार, प्रेस विज्ञप्ति, प्रकाशन र बोलपत्रहरू",
};

const TYPE_LABELS: Record<string, string> = {
  news: "समाचार",
  "press-release": "प्रेस विज्ञप्ति",
  publication: "प्रकाशन",
  bid: "बोलपत्र",
};

const TYPE_COLORS: Record<string, string> = {
  news: "news-badge-news",
  "press-release": "news-badge-press",
  publication: "news-badge-pub",
  bid: "news-badge-bid",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const { type, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 12;

  const payload = await getPayloadClient();

  const where: any = { status: { equals: "published" } };
  if (type && type !== "all") {
    where.type = { equals: type };
  }

  const result = await payload.find({
    collection: "news",
    where,
    sort: "-publishedDate",
    limit,
    page: currentPage,
    depth: 1,
  });

  const { docs, totalPages } = result;
  const tabs = [
    { id: "all", label: "सबै" },
    { id: "news", label: "समाचार" },
    { id: "press-release", label: "प्रेस विज्ञप्ति" },
    { id: "publication", label: "प्रकाशन" },
    { id: "bid", label: "बोलपत्र" },
  ];

  return (
    <main className="page-container">
      <div className="page-hero">
        <h1 className="page-hero-title">📰 समाचार तथा गतिविधि</h1>
      </div>

      {/* Type filter tabs */}
      <div className="page-filter-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === "all" ? "/news" : `/news?type=${tab.id}`}
            className={`page-filter-tab${(!type && tab.id === "all") || type === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* News grid */}
      {docs.length === 0 ? (
        <p className="page-empty">कुनै सामग्री उपलब्ध छैन।</p>
      ) : (
        <div className="news-list-grid">
          {docs.map((item: any) => {
            const img =
              item.featuredImage && typeof item.featuredImage === "object"
                ? item.featuredImage
                : null;
            return (
              <Link key={item.id} href={`/news/${item.slug || item.id}`} className="news-list-card">
                {img?.url && (
                  <div className="news-list-img-wrap">
                    <Image
                      src={img.url}
                      alt={item.title}
                      fill
                      className="news-list-img"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="news-list-body">
                  {item.type && (
                    <span className={`news-badge ${TYPE_COLORS[item.type] || ""}`}>
                      {TYPE_LABELS[item.type] || item.type}
                    </span>
                  )}
                  <h2 className="news-list-title">{item.title}</h2>
                  {item.excerpt && <p className="news-list-excerpt">{item.excerpt}</p>}
                  {item.publishedDate && (
                    <time className="news-list-date">
                      {formatDate(item.publishedDate, "short")}
                    </time>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="page-pagination">
          {currentPage > 1 && (
            <Link
              href={`/news?${type ? `type=${type}&` : ""}page=${currentPage - 1}`}
              className="page-nav-btn"
            >
              ‹ अघिल्लो
            </Link>
          )}
          <span className="page-num">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/news?${type ? `type=${type}&` : ""}page=${currentPage + 1}`}
              className="page-nav-btn"
            >
              अर्को ›
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
