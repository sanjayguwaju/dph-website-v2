import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  publishedDate?: string | null;
  featuredImage?: any;
  externalFeaturedImage?: string | null;
  type?: string | null;
};

// Resolves either uploaded CMS image or external URL
function resolveNewsImg(item: NewsItem): string | null {
  if (item.featuredImage && typeof item.featuredImage === "object" && item.featuredImage.url) {
    return item.featuredImage.url as string;
  }
  return item.externalFeaturedImage || null;
}

export async function NewsActivities({
  featured,
  recent,
}: {
  featured: NewsItem | null;
  recent: NewsItem[];
}) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  if (!featured && recent.length === 0) return null;

  const featuredImg = featured ? resolveNewsImg(featured) : null;

  return (
    <section className="news-section-v2">
      <div className="section-header-v2 no-border items-center justify-between flex">
        <h2 className="section-heading-v2 uppercase">
          {t("news")}
        </h2>
        <Link href="/news" className="view-all-v2">
          {tc("viewAll")}
        </Link>
      </div>

      <div className="news-grid-v2">
        {/* Left: Featured News */}
        <div className="news-left-v2">
          {featured && (
            <ScrollReveal animation="animate-in fade-in slide-in-from-left-10" duration={600}>
              <Link href={`/news/${featured.slug || featured.id}`} className="news-main-card">
                <div className="news-main-img-wrap">
                  {featuredImg ? (
                    <Image
                      src={featuredImg}
                      alt={featured.title}
                      fill
                      className="news-main-img"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="news-main-img-placeholder">
                      <FileText size={40} className="opacity-20" />
                    </div>
                  )}
                </div>
                <div className="news-main-info">
                  {featured.type && (
                    <span className="news-main-badge">{featured.type}</span>
                  )}
                  <h3 className="news-main-title">{featured.title}</h3>
                  {featured.excerpt && (
                    <p className="news-main-excerpt">{featured.excerpt}</p>
                  )}
                  {featured.publishedDate && (
                    <time className="news-main-date">
                      🕒 {formatDate(featured.publishedDate, "short")}
                    </time>
                  )}
                </div>
              </Link>
            </ScrollReveal>
          )}
        </div>

        {/* Right: List of Recent News */}
        <div className="news-right-v2">
          {recent.slice(0, 4).map((item, i) => {
            const thumbUrl = resolveNewsImg(item);
            return (
              <ScrollReveal
                key={item.id}
                delay={i * 100}
                animation="animate-in fade-in slide-in-from-right-10"
                duration={500}
              >
                <Link href={`/news/${item.slug || item.id}`} className="news-item-v2">
                  <div className="news-item-thumb">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={item.title}
                        width={100}
                        height={80}
                        className="news-item-thumb-img"
                      />
                    ) : (
                      <div className="pdf-thumb">
                        <FileText size={20} className="opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="news-item-content">
                    <div className="news-item-meta">
                      {item.publishedDate && (
                        <time className="news-item-date">
                          🕒 {formatDate(item.publishedDate, "short")}
                        </time>
                      )}
                    </div>
                    <h4 className="news-item-title">{item.title}</h4>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
