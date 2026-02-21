import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPayloadClient } from "@/lib/payload";
import { formatDate } from "@/utils/format";
import { getLocale, getTranslations } from "next-intl/server";
import { toNepaliNum } from "@/utils/nepali-date";
import { PageLayout } from "@/components/layout/page-layout";
import { FileText, Search, Newspaper, Bell, Stethoscope, Users } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const tc = await getTranslations("common");

  if (q) {
    return {
      title: `"${q}" ${tc("searchResultsFor")} | ${tc("hospitalName")}`,
      description: `Search results for "${q}" on ${tc("hospitalName")}`,
    };
  }

  return {
    title: `${tc("search")} | ${tc("hospitalName")}`,
    description: `Search news, notices, services and staff of ${tc("hospitalName")}`,
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const locale = await getLocale();
  const tc = await getTranslations("common");
  const tn = await getTranslations("news");
  const tnav = await getTranslations("nav");
  const ts = await getTranslations("services");
  const tstaff = await getTranslations("staff");

  type ResultSet = { news: any[]; notices: any[]; services: any[]; staff: any[] };
  let results: ResultSet = { news: [], notices: [], services: [], staff: [] };

  if (query) {
    const payload = await getPayloadClient();

    const [newsRes, noticeRes, serviceRes, staffRes] = await Promise.all([
      payload.find({
        collection: "news",
        where: { and: [{ status: { equals: "published" } }, { title: { contains: query } }] },
        limit: 8, depth: 1, sort: "-publishedDate", locale: locale as any,
      }),
      payload.find({
        collection: "notices",
        where: { and: [{ status: { equals: "published" } }, { title: { contains: query } }] },
        limit: 8, depth: 0, sort: "-publishedDate", locale: locale as any,
      }),
      payload.find({
        collection: "services",
        where: { and: [{ isActive: { equals: true } }, { name: { contains: query } }] },
        limit: 8, depth: 0, locale: locale as any,
      }),
      payload.find({
        collection: "staff",
        where: { and: [{ isActive: { equals: true } }, { name: { contains: query } }] },
        limit: 8, depth: 1, locale: locale as any,
      }),
    ]);

    results = {
      news: newsRes.docs,
      notices: noticeRes.docs,
      services: serviceRes.docs,
      staff: staffRes.docs,
    };
  }

  const totalResults =
    results.news.length + results.notices.length + results.services.length + results.staff.length;
  const displayCount = locale === "ne" ? toNepaliNum(totalResults) : totalResults;

  return (
    <PageLayout breadcrumbs={[{ label: tc("search") }]} maxWidth="max-w-5xl">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-[var(--brand-blue)] mb-2 flex items-center gap-2">
          <Search size={28} className="opacity-80" />
          {tc("search")}
        </h1>
        {query && (
          <p className="text-gray-500 text-sm">
            {locale === "ne"
              ? `"${query}" ${tc("searchResultsFor")}: ${displayCount} ${tc("results")}`
              : `${tc("searchResultsFor")} "${query}": ${displayCount} ${tc("results")}`}
          </p>
        )}
      </div>

      {/* Search form */}
      <form action="/search" method="GET" className="mb-10" role="search">
        <div className="search-page-form">
          <div className="search-page-input-wrap">
            <Search size={18} className="search-page-icon" />
            <input
              id="search-input"
              type="search"
              name="q"
              defaultValue={query}
              placeholder={tc("searchPlaceholder")}
              className="search-page-input"
              autoFocus={!query}
              aria-label={tc("search")}
            />
          </div>
          <button type="submit" className="search-page-btn">
            {tc("search")}
          </button>
        </div>
      </form>

      {/* Results */}
      {query ? (
        totalResults === 0 ? (
          <div className="search-no-results">
            <Search size={48} className="opacity-20 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              "{query}" {tc("noResultsFound")}
            </p>
            <p className="text-gray-400 text-sm mt-2">{tc("searchPrompt")}</p>
          </div>
        ) : (
          <div className="space-y-10">

            {/* ── News ── */}
            {results.news.length > 0 && (
              <section className="search-result-section">
                <h2 className="search-result-heading blue">
                  <Newspaper size={17} />
                  {tn("newsAndActivities")}
                  <span className="search-result-count">{results.news.length}</span>
                </h2>
                <div className="search-result-list">
                  {results.news.map((item: any) => {
                    const img = item.featuredImage && typeof item.featuredImage === "object"
                      ? item.featuredImage : null;
                    const imgUrl = img?.url || item.externalFeaturedImage || null;
                    return (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug || item.id}`}
                        className="search-result-card"
                      >
                        <div className="search-result-thumb">
                          {imgUrl ? (
                            <Image src={imgUrl} alt={item.title} fill className="search-result-img" sizes="80px" />
                          ) : (
                            <div className="search-result-thumb-placeholder">
                              <FileText size={20} className="opacity-30" />
                            </div>
                          )}
                        </div>
                        <div className="search-result-body">
                          <p className="search-result-title">{item.title}</p>
                          {item.excerpt && <p className="search-result-excerpt">{item.excerpt}</p>}
                          {item.publishedDate && (
                            <time className="search-result-date">{formatDate(item.publishedDate, "short")}</time>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Notices ── */}
            {results.notices.length > 0 && (
              <section className="search-result-section">
                <h2 className="search-result-heading red">
                  <Bell size={17} />
                  {tnav("notices")}
                  <span className="search-result-count">{results.notices.length}</span>
                </h2>
                <div className="search-result-list">
                  {results.notices.map((notice: any) => (
                    <Link
                      key={notice.id}
                      href={`/notices/${notice.id}`}
                      className="search-result-card"
                    >
                      <div className="search-result-thumb">
                        <div className="search-result-thumb-placeholder red">
                          <Bell size={20} className="opacity-40" />
                        </div>
                      </div>
                      <div className="search-result-body">
                        <p className="search-result-title">{notice.title}</p>
                        {notice.description && (
                          <p className="search-result-excerpt">{notice.description}</p>
                        )}
                        {notice.publishedDate && (
                          <time className="search-result-date">{formatDate(notice.publishedDate, "short")}</time>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Services ── */}
            {results.services.length > 0 && (
              <section className="search-result-section">
                <h2 className="search-result-heading green">
                  <Stethoscope size={17} />
                  {ts("title")}
                  <span className="search-result-count">{results.services.length}</span>
                </h2>
                <div className="search-result-list">
                  {results.services.map((svc: any) => (
                    <Link
                      key={svc.id}
                      href={`/services/${svc.slug || svc.id}`}
                      className="search-result-card"
                    >
                      <div className="search-result-thumb">
                        <div className="search-result-thumb-placeholder green">
                          <span style={{ fontSize: "1.6rem" }}>{svc.icon || "🏥"}</span>
                        </div>
                      </div>
                      <div className="search-result-body">
                        <p className="search-result-title">{svc.name}</p>
                        {svc.shortDescription && (
                          <p className="search-result-excerpt">{svc.shortDescription}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Staff ── */}
            {results.staff.length > 0 && (
              <section className="search-result-section">
                <h2 className="search-result-heading purple">
                  <Users size={17} />
                  {tstaff("title")}
                  <span className="search-result-count">{results.staff.length}</span>
                </h2>
                <div className="search-result-list">
                  {results.staff.map((member: any) => {
                    const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
                    const photoUrl = photo?.url || member.externalPhoto || null;
                    return (
                      <Link
                        key={member.id}
                        href={`/staff/${member.id}`}
                        className="search-result-card"
                      >
                        <div className="search-result-thumb">
                          {photoUrl ? (
                            <Image src={photoUrl} alt={member.name} fill className="search-result-img rounded-full" sizes="64px" />
                          ) : (
                            <div className="search-result-thumb-placeholder purple">
                              <Users size={20} className="opacity-40" />
                            </div>
                          )}
                        </div>
                        <div className="search-result-body">
                          <p className="search-result-title">{member.name}</p>
                          <p className="search-result-excerpt">{member.designation}</p>
                          {member.department && (
                            <span className="search-result-date">{member.department}</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )
      ) : (
        /* Empty state */
        <div className="search-empty-state">
          <Search size={52} className="opacity-15 mb-6" />
          <p className="text-gray-500 mb-6 font-medium text-lg">{tc("searchPrompt")}</p>
          <div className="search-quick-links">
            <Link href="/news" className="search-quick-link blue">
              <Newspaper size={15} /> {tnav("news")}
            </Link>
            <Link href="/notices" className="search-quick-link red">
              <Bell size={15} /> {tnav("notices")}
            </Link>
            <Link href="/services" className="search-quick-link green">
              <Stethoscope size={15} /> {tnav("services")}
            </Link>
            <Link href="/staff" className="search-quick-link purple">
              <Users size={15} /> {tnav("staff")}
            </Link>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
