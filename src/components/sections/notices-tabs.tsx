"use client";

import { useState } from "react";
import Link from "next/link";

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

const tabs = [
  { id: "notices", label: "सूचना" },
  { id: "news", label: "समाचार" },
  { id: "pressReleases", label: "प्रेस विज्ञप्ति" },
  { id: "publications", label: "प्रकाशन" },
  { id: "bids", label: "बोलपत्र" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function useFormatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("ne-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function NoticeRow({ item, href }: { item: NoticeItem | NewsItem; href: string }) {
  const dateStr = useFormatDate(item.publishedDate);
  const file = "file" in item && item.file && typeof item.file === "object" ? item.file : null;

  return (
    <div className="notices-row">
      <div className="notices-row-content">
        <span className="notices-row-bullet">›</span>
        <Link href={href} className="notices-row-title">
          {item.title}
        </Link>
      </div>
      <div className="notices-row-meta">
        {dateStr && <time className="notices-row-date">{dateStr}</time>}
        {file?.url && (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="notices-row-download"
            aria-label="Download file"
          >
            📄
          </a>
        )}
      </div>
    </div>
  );
}

export function NoticesTabs({ notices, news, pressReleases, publications, bids }: Props) {
  const [active, setActive] = useState<TabId>("notices");

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
            className={`notices-tab${active === tab.id ? "active" : ""}`}
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
          <p className="notices-empty">कुनै सूचना उपलब्ध छैन।</p>
        ) : (
          items.map((item) => <NoticeRow key={item.id} item={item} href={hrefMap[active](item)} />)
        )}
        <div className="notices-tab-footer">
          <Link href={`/${active === "notices" ? "notices" : "news"}`} className="section-view-all">
            सबै हेर्नुस् →
          </Link>
        </div>
      </div>
    </section>
  );
}
