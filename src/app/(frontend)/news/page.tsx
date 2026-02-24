import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format";
import { FileText, Calendar, ChevronRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "News & Activities | Dhaulagiri Hospital",
    description: "Latest news, press releases, publications and bid notices from Dhaulagiri Hospital.",
  };
}

import { PageLayout } from "@/components/layout/page-layout";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  news: { bg: "rgba(16,185,129,0.12)", text: "#059669" },
  "press-release": { bg: "rgba(59,130,246,0.12)", text: "#2563eb" },
  publication: { bg: "rgba(245,158,11,0.12)", text: "#d97706" },
  bid: { bg: "rgba(239,68,68,0.12)", text: "#dc2626" },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const { type, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 12;

  const TYPE_LABELS: Record<string, string> = {
    news: "News",
    "press-release": "Press Release",
    publication: "Publication",
    bid: "Bid",
  };

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

  const { docs, totalPages, totalDocs } = result;
  const tabs = [
    { id: "all", label: "All" },
    { id: "news", label: "News" },
    { id: "press-release", label: "Press Release" },
    { id: "publication", label: "Publication" },
    { id: "bid", label: "Bid" },
  ];

  return (
    <PageLayout
      breadcrumbs={[
        { label: "News & Activities" },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-[#003580] mb-2">📰 News & Activities</h1>
        <p className="text-gray-500">
          {`${totalDocs} articles, press releases and announcements`}
        </p>
      </div>

      {/* Type filter tabs */}
      <div className="page-filter-tabs mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === "all" ? "/news" : `/news?type=${tab.id}`}
            className={`page-filter-tab${(!type && tab.id === "all") || type === tab.id ? " active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* News grid */}
      {docs.length === 0 ? (
        <p className="page-empty">No data available</p>
      ) : (
        <div className="news-list-grid">
          {docs.map((item: any) => {
            const img =
              item.featuredImage && typeof item.featuredImage === "object"
                ? item.featuredImage
                : null;
            const imgUrl = img?.url || (item as any).externalFeaturedImage || null;
            const typeColor = TYPE_COLORS[item.type] || TYPE_COLORS.news;

            return (
              <Link
                key={item.id}
                href={`/news/${item.slug || item.id}`}
                className="news-list-card"
              >
                <div className="news-list-img-wrap">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={item.title}
                      fill
                      className="news-list-img"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="news-list-img-placeholder">
                      <FileText size={40} className="opacity-20" />
                    </div>
                  )}
                  {item.type && (
                    <span
                      className="news-list-type-badge"
                      style={{ background: typeColor.bg, color: typeColor.text }}
                    >
                      {TYPE_LABELS[item.type] || item.type}
                    </span>
                  )}
                </div>

                <div className="news-list-body">
                  <h2 className="news-list-title">{item.title}</h2>
                  {item.excerpt && (
                    <p className="news-list-excerpt line-clamp-2">{item.excerpt}</p>
                  )}
                  <div className="news-list-footer">
                    {item.publishedDate && (
                      <time className="news-list-date">
                        <Calendar size={11} style={{ display: "inline", marginRight: 3 }} />
                        {formatDate(item.publishedDate, "short")}
                      </time>
                    )}
                    <span className="news-list-read-more">
                      Read More
                      <ChevronRight size={12} style={{ display: "inline" }} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="page-pagination mt-12">
          {currentPage > 1 && (
            <Link
              href={`/news?${type ? `type=${type}&` : ""}page=${currentPage - 1}`}
              className="page-nav-btn"
            >
              ‹ Prev
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
              Next ›
            </Link>
          )}
        </div>
      )}
    </PageLayout>
  );
}
