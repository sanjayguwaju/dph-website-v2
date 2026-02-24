import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/utils/format";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { FileText } from "lucide-react";
import { getLocalizedValue } from "@/lib/utils/localized";

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
  if (!featured && recent.length === 0) return null;

  const featuredImg = featured ? resolveNewsImg(featured) : null;

  return (
    <section className="news-section-v2">
      <div className="section-header-v2 no-border items-center justify-between flex">
        <h2 className="section-heading-v2 uppercase">
          News & Activities
        </h2>
        <Link href="/news" className="view-all-v2">
          View All
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Featured News */}
        <div className="lg:w-7/12">
          {featured && (
            <ScrollReveal animation="animate-in fade-in slide-in-from-left-10" duration={600}>
              <Link href={`/news/${featured.slug || featured.id}`} className="group block relative overflow-hidden rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 h-full">
                <div className="aspect-[16/11] relative overflow-hidden h-full">
                  {featuredImg ? (
                    <Image
                      src={featuredImg}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                      <FileText size={48} className="text-gray-200" />
                    </div>
                  )}
                  {/* Thick dark gradient to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  {/* Content overlayed on image */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-10">
                    <div className="flex items-center gap-3 text-gray-300 text-xs font-bold mb-3">
                      <span className="uppercase tracking-widest">{formatDate(featured.publishedDate || "", "long")}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-gray-200 transition-colors leading-tight mb-3 text-balance drop-shadow-md">
                      {getLocalizedValue(featured.title)}
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}
        </div>

        {/* Right: List of Recent News */}
        <div className="lg:w-5/12 flex flex-col gap-4">
          {recent.slice(0, 4).map((item, i) => {
            const thumbUrl = resolveNewsImg(item);
            return (
              <ScrollReveal
                key={item.id}
                delay={i * 100}
                animation="animate-in fade-in slide-in-from-right-10"
                duration={500}
              >
                <Link href={`/news/${item.slug || item.id}`} className="group flex gap-4 p-3 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="w-[120px] h-[80px] shrink-0 relative rounded overflow-hidden bg-gray-50 border border-gray-100">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
                        {/* Fake PDF Icon Look */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15h6"></path><path d="M9 11h6"></path></svg>
                        <span className="text-[10px] font-bold mt-1">PDF</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                    <h4 className="text-[0.95rem] font-medium text-gray-900 group-hover:text-blue-700 transition-colors leading-[1.4] line-clamp-2">{getLocalizedValue(item.title)}</h4>
                    <div className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-gray-600">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <time className="uppercase tracking-wide">
                        {formatDate(item.publishedDate || "", "short")}
                      </time>
                    </div>
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
