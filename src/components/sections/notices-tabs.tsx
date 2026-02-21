"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toNepaliNum } from "@/utils/nepali-date";
import { useTranslations, useLocale } from "next-intl";

const NP_MONTHS_AD = [
  "जनवरी",
  "फेब्रुअरी",
  "मार्च",
  "अप्रिल",
  "मे",
  "जुन",
  "जुलाई",
  "अगस्त",
  "सेप्टेम्बर",
  "अक्टोबर",
  "नोभेम्बर",
  "डिसेम्बर",
];

const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

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
};

type TabId = "notices" | "news" | "pressReleases" | "publications" | "bids";

function useFormatDate(dateStr?: string | null) {
  const [formatted, setFormatted] = useState("");
  const locale = useLocale();

  useEffect(() => {
    if (!dateStr) return;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        setFormatted(dateStr);
        return;
      }

      if (locale === 'ne') {
        const year = toNepaliNum(date.getFullYear());
        const month = NP_MONTHS_AD[date.getMonth()];
        const day = toNepaliNum(date.getDate());
        setFormatted(`${year} ${month} ${day}`);
      } else {
        const year = date.getFullYear();
        const month = EN_MONTHS[date.getMonth()];
        const day = date.getDate();
        setFormatted(`${month} ${day}, ${year}`);
      }
    } catch {
      setFormatted(dateStr);
    }
  }, [dateStr, locale]);

  return formatted;
}

function NoticeRow({ item, href }: { item: NoticeItem | NewsItem; href: string }) {
  const dateStr = useFormatDate(item.publishedDate);
  const file = "file" in item && item.file && typeof item.file === "object" ? item.file : null;
  const t = useTranslations("common");

  return (
    <div className="notices-row">
      <div className="pdf-icon-v3">
        <span className="pdf-tag">PDF</span>
        <div className="pdf-line-decor"></div>
      </div>
      <div className="notices-row-content">
        <Link href={href} className="notices-row-title">
          {item.title}
        </Link>
        {dateStr && (
          <span className="notices-row-date">{t("publishedDate")}: {dateStr}</span>
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

export function NoticesTabs({ notices, news, pressReleases, publications, bids }: Props) {
  const t = useTranslations("news");
  const tn = useTranslations("notices");
  const tc = useTranslations("common");
  const [active, setActive] = useState<TabId>("notices");

  const tabs: { id: TabId; label: string }[] = [
    { id: "notices", label: tn("title") },
    { id: "news", label: t("newsType") },
    { id: "pressReleases", label: t("pressRelease") },
    { id: "publications", label: t("publication") },
    { id: "bids", label: t("bid") },
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

  const items = dataMap[active];

  return (
    <section className="notices-tabs-section">
      <div className="notices-tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`notices-tab${active === tab.id ? " active" : ""}`}
            aria-selected={active === tab.id}
            role="tab"
          >
            {tab.label}
            {dataMap[tab.id].length > 0 && (
              <span className="notices-tab-count">{dataMap[tab.id].length}</span>
            )}
          </button>
        ))}
      </div>
      <div className="notices-tab-body" role="tabpanel">
        {items.length === 0 ? (
          <p className="notices-empty">{tc("noData")}</p>
        ) : (
          items.map((item) => <NoticeRow key={item.id} item={item} href={hrefMap[active](item)} />)
        )}
        <div className="notices-tab-footer">
          <Link href={`/${active === "notices" ? "notices" : "news"}`} className="section-view-all">
            {tc("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
