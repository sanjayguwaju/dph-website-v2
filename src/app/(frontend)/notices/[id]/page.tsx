import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { formatDate } from "@/utils/format";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "notices",
    where: { id: { equals: id } },
    limit: 1,
    depth: 1,
  });

  const notice = result.docs[0];
  if (!notice) notFound();

  return (
    <main className="page-container">
      <div className="news-detail-breadcrumb">
        <Link href="/" className="breadcrumb-link">
          गृहपृष्ठ
        </Link>
        <span>›</span>
        <Link href="/notices" className="breadcrumb-link">
          सूचनाहरू
        </Link>
        <span>›</span>
        <span>{notice.title as string}</span>
      </div>

      <article className="news-detail">
        <div className="news-detail-body">
          <div className="news-detail-meta">
            <span className="news-badge">सूचना</span>
            {notice.publishedDate && (
              <time className="news-detail-date">
                {formatDate(notice.publishedDate as string, "long")}
              </time>
            )}
          </div>
          <h1 className="news-detail-title">{notice.title as string}</h1>
        </div>
      </article>

      <div className="news-detail-back">
        <Link href="/notices" className="page-nav-btn">
          ← सूचनामा फर्कनुस्
        </Link>
      </div>
    </main>
  );
}
