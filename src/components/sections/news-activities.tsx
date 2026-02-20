import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format";

type NewsItem = {
  id: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  publishedDate?: string | null;
  featuredImage?: any;
  type?: string | null;
};

export function NewsActivities({
  featured,
  recent,
}: {
  featured: NewsItem | null;
  recent: NewsItem[];
}) {
  if (!featured && recent.length === 0) return null;

  const img =
    featured?.featuredImage && typeof featured.featuredImage === "object"
      ? featured.featuredImage
      : null;

  return (
    <section className="news-section">
      <div className="section-header">
        <h2 className="section-heading">📰 समाचार तथा गतिविधि</h2>
        <Link href="/news" className="section-view-all">
          सबै हेर्नुस् →
        </Link>
      </div>

      <div className="news-layout">
        {/* Featured large card */}
        {featured && (
          <Link href={`/news/${featured.slug || featured.id}`} className="news-featured-card">
            {img?.url && (
              <div className="news-featured-img-wrap">
                <Image
                  src={img.url}
                  alt={featured.title}
                  fill
                  className="news-featured-img"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className="news-featured-body">
              {featured.publishedDate && (
                <time className="news-date">{formatDate(featured.publishedDate, "short")}</time>
              )}
              <h3 className="news-featured-title">{featured.title}</h3>
              {featured.excerpt && <p className="news-featured-excerpt">{featured.excerpt}</p>}
            </div>
          </Link>
        )}

        {/* Recent news list */}
        <div className="news-recent-list">
          {recent.map((item) => (
            <Link key={item.id} href={`/news/${item.slug || item.id}`} className="news-recent-item">
              <span className="news-recent-bullet">›</span>
              <div className="news-recent-content">
                <p className="news-recent-title">{item.title}</p>
                {item.publishedDate && (
                  <time className="news-date">{formatDate(item.publishedDate, "short")}</time>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
