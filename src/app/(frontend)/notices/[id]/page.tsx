import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { PageLayout } from "@/components/layout/page-layout";
import { NoticeDetailView } from "@/components/notices/NoticeDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const notice = await import("@/lib/queries/notices").then((m) => m.getNoticeById(id, 0));

  if (!notice) return { title: "Not Found" };

  return {
    title: `${notice.title} | Amppipal Hospital`,
    description: (notice.description as string)?.slice(0, 160) || "Notice detail",
    openGraph: {
      title: notice.title as string,
      description: (notice.description as string)?.slice(0, 160),
    },
  };
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const notice = await import("@/lib/queries/notices").then((m) => m.getNoticeById(id, 1)) as any;

  if (!notice) notFound();

  // Extract file and image
  const file =
    notice.file && typeof notice.file === "object"
      ? {
        url: notice.file.url as string,
        filename: notice.file.filename as string,
        mimeType: notice.file.mimeType as string,
      }
      : null;

  const image =
    notice.image && typeof notice.image === "object"
      ? {
        url: notice.image.url as string,
        alt: notice.image.alt as string,
      }
      : (notice.externalImage ? { url: notice.externalImage as string, alt: notice.title as string } : null);

  // Format date
  const dateStr = notice.publishedDate
    ? new Date(notice.publishedDate).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric", weekday: "long" }
    )
    : undefined;

  const siteUrl = "https://dph.gandaki.gov.np";
  const shareUrl = `${siteUrl}/notices/${id}`;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Notices", href: "/notices" },
        { label: notice.title as string },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="notice-detail-layout">
        <div className="notice-detail-main">
          <NoticeDetailView
            title={notice.title}
            description={notice.description}
            date={dateStr}
            file={file}
            image={image}
            views={notice.views || 31}
            shareUrl={shareUrl}
            tweetUrl={shareUrl}
          />
        </div>
      </div>

      <div className="news-detail-back mt-12 text-center border-t border-[#eee] pt-8">
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 text-[#2563eb] hover:underline font-medium"
        >
          ‹ Back to Notices
        </Link>
      </div>
    </PageLayout>
  );
}
