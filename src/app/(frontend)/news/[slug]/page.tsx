import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { formatDate } from "@/utils/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "news",
    where: {
      or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
    },
    limit: 1,
    depth: 1,
  });

  const item = result.docs[0];
  if (!item) return { title: "Not Found" };

  const img =
    item.featuredImage && typeof item.featuredImage === "object" ? item.featuredImage : null;

  return {
    title: item.title as string,
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
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "news",
    where: {
      or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
    },
    limit: 1,
    depth: 1,
  });

  const item = result.docs[0];
  if (!item) notFound();

  const img =
    item.featuredImage && typeof item.featuredImage === "object" ? item.featuredImage : null;
  const file = item.file && typeof item.file === "object" ? item.file : null;

  return (
    <main className="page-container">
      <div className="news-detail-breadcrumb">
        <Link href="/" className="breadcrumb-link">
          गृहपृष्ठ
        </Link>
        <span>›</span>
        <Link href="/news" className="breadcrumb-link">
          समाचार
        </Link>
        <span>›</span>
        <span>{item.title as string}</span>
      </div>

      <article className="news-detail">
        {img?.url && (
          <div className="news-detail-img-wrap">
            <Image
              src={img.url as string}
              alt={item.title as string}
              fill
              priority
              className="news-detail-img"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>
        )}

        <div className="news-detail-body">
          <div className="news-detail-meta">
            {item.type && <span className="news-badge">{item.type as string}</span>}
            {item.publishedDate && (
              <time className="news-detail-date">
                {formatDate(item.publishedDate as string, "long")}
              </time>
            )}
          </div>

          <h1 className="news-detail-title">{item.title as string}</h1>

          {item.excerpt && <p className="news-detail-excerpt">{item.excerpt as string}</p>}

          {/* Rich text content placeholder */}
          {item.content && (
            <div className="news-detail-content">
              {/* Content rendered via RichText component */}
              <p className="news-detail-body-text">
                {/* TODO: wire up RichText renderer when needed */}
              </p>
            </div>
          )}

          {file?.url && (
            <a
              href={file.url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="news-detail-download"
            >
              📄 फाइल डाउनलोड गर्नुस्
            </a>
          )}
        </div>
      </article>

      <div className="news-detail-back">
        <Link href="/news" className="page-nav-btn">
          ← समाचारमा फर्कनुस्
        </Link>
      </div>
    </main>
  );
}
