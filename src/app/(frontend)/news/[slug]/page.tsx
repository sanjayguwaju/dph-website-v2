import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { formatDate } from "@/utils/format";
import { RichText } from "@/components/RichText";
import { PageLayout } from "@/components/layout/page-layout";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, item] = await Promise.all([
    import("@/lib/queries/globals").then((m) => m.getSiteSettings()),
    import("@/lib/queries/news").then((m) => m.getNewsBySlug(slug)),
  ]);

  if (!item) return { title: "Not Found" };

  const s = settings as any;
  const hospitalName = s?.hospitalNameEn || "Amppipal Hospital";
  const img = item.featuredImage && typeof item.featuredImage === "object" ? item.featuredImage : null;

  return {
    title: `${item.title as string} | ${hospitalName}`,
    description: (item.excerpt as string) || undefined,
    openGraph: {
      title: item.title as string,
      description: (item.excerpt as string) || undefined,
      images: img?.url ? [{ url: img.url as string }] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await import("@/lib/queries/news").then((m) => m.getNewsBySlug(slug));

  if (!item) notFound();

  const img =
    item.featuredImage && typeof item.featuredImage === "object" ? item.featuredImage : null;
  const imgUrl = (img as any)?.url || (item as any).externalFeaturedImage || null;
  const file = item.file && typeof item.file === "object" ? item.file : null;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "News & Activities", href: "/news" },
        { label: item.title as string },
      ]}
      maxWidth="max-w-4xl"
    >
      <article className="text-[#212529]">
        {imgUrl && (
          <div className="news-detail-img-wrap mb-10">
            <Image
              src={imgUrl}
              alt={item.title as string}
              fill
              priority
              className="news-detail-img"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>
        )}


        <div className="news-detail-meta mb-8 border-b border-[#eee] pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.type && <span className="news-badge">{item.type as string}</span>}
            {item.publishedDate && (
              <time className="news-detail-date text-[15px] font-medium text-gray-600">
                {formatDate(item.publishedDate as string, "long")}
              </time>
            )}
          </div>
        </div>

        <h1 className="text-[28px] font-bold mb-6 text-black leading-tight">
          {item.title as string}
        </h1>

        {item.excerpt && (
          <p className="text-lg text-gray-700 italic border-l-4 border-[#2563eb] pl-4 mb-8">
            {item.excerpt as string}
          </p>
        )}

        {/* Rich text content */}
        {item.content && <RichText data={item.content as any} className="prose-editorial" />}

        {file?.url && (
          <div className="mt-12 bg-[#f8fbff] border border-[#d1e3ff] p-6 rounded-lg text-center">
            <p className="mb-4 text-[#2563eb] font-medium">Download</p>
            <a
              href={file.url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#dc2626] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 rounded shadow-sm"
            >
              📄 Download (PDF)
            </a>
          </div>
        )}
      </article>

      <div className="news-detail-back mt-16 text-center pt-8 border-t border-gray-100">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-[#2563eb] hover:underline font-medium"
        >
          ‹ Back to News
        </Link>
      </div>
    </PageLayout>
  );
}
