"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toNepaliNum } from "@/utils/nepali-date";
import { getLocalizedValue } from "@/lib/utils/localized";
import { getLocaleClient } from "@/utils/locale-client";
import { formatDate } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type NoticeItem = {
  id: string;
  title: string;
  publishedDate?: string | null;
  file?: any;
};

type NewsItem = {
  id: string;
  title: string;
  publishedDate?: string | null;
  slug?: string | null;
  file?: any;
};

type Props = {
  notices: NoticeItem[];
  news: NewsItem[];
  pressReleases: NewsItem[];
  publications: NewsItem[];
  bids: NewsItem[];
  locale?: string;
};

type TabId = "notices" | "news" | "pressReleases" | "publications" | "bids";

function NoticeRow({ item, href, locale }: { item: NoticeItem | NewsItem; href: string; locale: string }) {
  const file = "file" in item && item.file && typeof item.file === "object" ? item.file : null;

  return (
    <div className="notices-row" key={item.id}>
      <div className="pdf-icon-v3">
        <span className="pdf-tag">PDF</span>
        <div className="pdf-line-decor"></div>
      </div>
      <div className="notices-row-content">
        <Link href={href} className="notices-row-title">
          {getLocalizedValue(item.title)}
        </Link>
        {item.publishedDate && (
          <span className="notices-row-date">
            {locale === "ne" ? "प्रकाशित:" : "Published:"} {formatDate(item.publishedDate, "short", locale)}
          </span>
        )}
      </div>
      {file?.url && (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="notices-download-link"
          aria-label="Download"
        >
          <div className="download-circle">
            <span>📥</span>
          </div>
        </a>
      )}
    </div>
  );
}

export function NoticesTabs({ notices, news, pressReleases, publications, bids, locale: initialLocale }: Props) {
  const [active, setActive] = useState<TabId>("notices");
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState(initialLocale || "ne");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const activeLocale = getLocaleClient();
    if (activeLocale !== locale) {
      setLocale(activeLocale);
    }
  }, [locale]);

  const tabs: { id: TabId; label: Record<string, string> }[] = [
    { id: "notices", label: { ne: "सूचनाहरू", en: "Notices" } },
    { id: "news", label: { ne: "समाचार", en: "News" } },
    { id: "pressReleases", label: { ne: "प्रेस विज्ञप्ति", en: "Press Releases" } },
    { id: "publications", label: { ne: "प्रकाशनहरू", en: "Publications" } },
    { id: "bids", label: { ne: "बोलपत्र", en: "Bids" } },
  ];

  const dataMap: Record<TabId, (NoticeItem | NewsItem)[]> = {
    notices,
    news,
    pressReleases,
    publications,
    bids,
  };

  const hrefMap: Record<TabId, (item: NoticeItem | NewsItem) => string> = {
    notices: (item) => `/notices/${item.id}`,
    news: (item) => `/news/${"slug" in item && item.slug ? item.slug : item.id}`,
    pressReleases: (item) => `/news/${"slug" in item && item.slug ? item.slug : item.id}`,
    publications: (item) => `/news/${"slug" in item && item.slug ? item.slug : item.id}`,
    bids: (item) => `/news/${"slug" in item && item.slug ? item.slug : item.id}`,
  };

  const handleTabChange = (id: TabId) => {
    if (id === active) return;
    setLoading(true);
    setActive(id);
    setTimeout(() => setLoading(false), 400);
  };

  const items = dataMap[active];

  return (
    <section className="notices-tabs-section">
      <ScrollReveal animation="flip-up" duration={800}>
        <div className="notices-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`notices-tab${active === tab.id ? " active" : ""}`}
              aria-selected={active === tab.id}
              role="tab"
            >
              {tab.label[locale] || tab.label.en}
              {dataMap[tab.id].length > 0 && (
                <span className="notices-tab-count">
                  {locale === "ne" ? toNepaliNum(dataMap[tab.id].length) : dataMap[tab.id].length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="notices-tab-body" role="tabpanel">
          {loading ? (
            <div className="p-8 space-y-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="w-12 h-12 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="notices-empty text-center py-12 text-gray-400 font-bold">
              {locale === "ne" ? "कुनै डेटा उपलब्ध छैन" : "No data available"}
            </p>
          ) : (
            items.map((item) => (
              <NoticeRow
                key={item.id}
                item={item}
                href={hrefMap[active](item)}
                locale={locale}
              />
            ))
          )}
          <div className="notices-tab-footer">
            <Link href={`/${active === "notices" ? "notices" : "news"}`} className="section-view-all">
              {locale === "ne" ? "सबै हेर्नुहोस्" : "View All"}
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
