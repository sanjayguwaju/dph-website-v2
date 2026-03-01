import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import { formatDate } from "@/utils/format";
import { PageLayout } from "@/components/layout/page-layout";
import { FileText, Search, Newspaper, Bell, Stethoscope, Users } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalNameEn || "Amppipal Hospital";

  if (q) {
    return {
      title: `"${q}" Search Results | ${hospitalName}`,
      description: `Search results for "${q}" on ${hospitalName}`,
    };
  }

  return {
    title: `Search | ${hospitalName}`,
    description: `Search news, notices, services and staff of ${hospitalName}`,
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  type ResultSet = { news: any[]; notices: any[]; services: any[]; staff: any[] };
  let results: ResultSet = { news: [], notices: [], services: [], staff: [] };

  if (query) {
    try {
      const payload = await getPayloadClient();

      const [newsRes, noticeRes, serviceRes, staffRes] = await Promise.all([
        payload.find({
          collection: "news",
          where: { and: [{ status: { equals: "published" } }, { title: { contains: query } }] },
          limit: 8, depth: 1, sort: "-publishedDate",
        }),
        payload.find({
          collection: "notices",
          where: { and: [{ status: { equals: "published" } }, { title: { contains: query } }] },
          limit: 8, depth: 0, sort: "-publishedDate",
        }),
        payload.find({
          collection: "services",
          where: { and: [{ isActive: { equals: true } }, { name: { contains: query } }] },
          limit: 8, depth: 0,
        }),
        payload.find({
          collection: "staff",
          where: { and: [{ isActive: { equals: true } }, { name: { contains: query } }] },
          limit: 8, depth: 1,
        }),
      ]);

      results = {
        news: newsRes.docs,
        notices: noticeRes.docs,
        services: serviceRes.docs,
        staff: staffRes.docs,
      };
    } catch (_) { }
  }

  const totalResults =
    results.news.length + results.notices.length + results.services.length + results.staff.length;

  return (
    <PageLayout breadcrumbs={[{ label: "Search" }]} maxWidth="max-w-5xl">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-[var(--brand-blue)] mb-2 flex items-center gap-2">
          <Search size={28} className="opacity-80" />
          Search
        </h1>
        {query && (
          <p className="text-gray-500 text-sm">
            Search results for &quot;{query}&quot;: {totalResults} results
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
              placeholder="Search for news, notices, services..."
              className="search-page-input"
              autoFocus={!query}
              aria-label="Search"
            />
          </div>
          <button type="submit" className="search-page-btn">
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {query ? (
        totalResults === 0 ? (
          <div className="search-no-results">
            <Search size={48} className="opacity-20 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              &quot;{query}&quot; No results found
            </p>
            <p className="text-gray-400 text-sm mt-2">Try different keywords</p>
          </div>
        ) : (
          <div className="space-y-10">

            {/* ── News ── */}
            {results.news.length > 0 && (
              <section className="search-result-section">
                <h2 className="search-result-heading blue">
                  <Newspaper size={17} />
                  News & Activities
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
                  Notices
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
                  Services
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
                  Staff
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
          <p className="text-gray-500 mb-6 font-medium text-lg">Enter keywords to search</p>
          <div className="search-quick-links">
            <Link href="/news" className="search-quick-link blue">
              <Newspaper size={15} /> News
            </Link>
            <Link href="/notices" className="search-quick-link red">
              <Bell size={15} /> Notices
            </Link>
            <Link href="/services" className="search-quick-link green">
              <Stethoscope size={15} /> Services
            </Link>
            <Link href="/staff" className="search-quick-link purple">
              <Users size={15} /> Staff
            </Link>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
