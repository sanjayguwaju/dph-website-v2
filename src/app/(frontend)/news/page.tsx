import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format";
import { FileText, Calendar, ChevronRight } from "lucide-react";

import { getLocale } from "@/utils/locale-server";
import { toNepaliNum } from "@/utils/nepali-date";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  const title = locale === "ne" ? `समाचार तथा गतिविधिहरू | ${hospitalName}` : `News & Activities | ${hospitalName}`;
  const description = locale === "ne"
    ? `${hospitalName} बाट नवीनतम समाचार, प्रेस विज्ञप्ति, प्रकाशन र बोलपत्र सूचनाहरू।`
    : `Latest news, press releases, publications and bid notices from ${hospitalName}.`;

  return {
    title,
    description,
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
  const [{ type, page }, locale] = await Promise.all([
    searchParams,
    getLocale()
  ]);
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 12;

  const labels = {
    title: locale === "ne" ? "समाचार तथा गतिविधिहरू" : "News & Activities",
    countText: locale === "ne"
      ? `${toNepaliNum(0)} लेख, प्रेस विज्ञप्ति र घोषणाहरू` // totalDocs will replace 0
      : `0 articles, press releases and announcements`,
    empty: locale === "ne" ? "कुनै डेटा उपलब्ध छैन" : "No data available",
    readMore: locale === "ne" ? "थप पढ्नुहोस्" : "Read More",
    prev: locale === "ne" ? "‹ अघिल्लो" : "‹ Prev",
    next: locale === "ne" ? "अर्को ›" : "Next ›",
  };

  const TYPE_LABELS: Record<string, string> = {
    news: locale === "ne" ? "समाचार" : "News",
    "press-release": locale === "ne" ? "प्रेस विज्ञप्ति" : "Press Release",
    publication: locale === "ne" ? "प्रकाशन" : "Publication",
    bid: locale === "ne" ? "बोलपत्र" : "Bid",
  };

  const where: any = { status: { equals: "published" } };
  if (type && type !== "all") {
    where.type = { equals: type };
  }

  let result: any = { docs: [], totalPages: 0, totalDocs: 0 };
  try {
    const payload = await getPayloadClient();
    result = await payload.find({
      collection: "news",
      where,
      sort: "-publishedDate",
      limit,
      page: currentPage,
      depth: 1,
      locale: locale as any,
    });
  } catch (error) {
    console.error("NewsPage fetch error:", error);
  }

  const { docs, totalPages, totalDocs } = result;
  labels.countText = locale === "ne"
    ? `${toNepaliNum(totalDocs)} लेख, प्रेस विज्ञप्ति र घोषणाहरू`
    : `${totalDocs} articles, press releases and announcements`;

  const tabs = [
    { id: "all", label: locale === "ne" ? "सबै" : "All" },
    { id: "news", label: TYPE_LABELS.news },
    { id: "press-release", label: TYPE_LABELS["press-release"] },
    { id: "publication", label: TYPE_LABELS.publication },
    { id: "bid", label: TYPE_LABELS.bid },
  ];

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.title },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-[#003580] mb-2">📰 {labels.title}</h1>
        <p className="text-gray-500">
          {labels.countText}
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
        <p className="page-empty py-20 text-center text-gray-400 font-bold">{labels.empty}</p>
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
                        {formatDate(item.publishedDate, "short", locale)}
                      </time>
                    )}
                    <span className="news-list-read-more">
                      {labels.readMore}
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
              {labels.prev}
            </Link>
          )}
          <span className="page-num">
            {locale === "ne" ? toNepaliNum(currentPage) : currentPage} / {locale === "ne" ? toNepaliNum(totalPages) : totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/news?${type ? `type=${type}&` : ""}page=${currentPage + 1}`}
              className="page-nav-btn"
            >
              {labels.next}
            </Link>
          )}
        </div>
      )}
    </PageLayout>
  );
}
