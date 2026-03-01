import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalNameEn || "Amppipal Hospital";

  return {
    title: `Videos | ${hospitalName}`,
  };
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;
    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

import { PageLayout } from "@/components/layout/page-layout";

export default async function VideoGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 12;

  let docs: any[] = [];
  let totalPages = 0;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "video-gallery",
      where: { isActive: { equals: true } },
      sort: "-publishedDate",
      limit,
      page: currentPage,
      depth: 0,
    });
    docs = result.docs;
    totalPages = result.totalPages;
  } catch (_) { }

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Videos" },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-10 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-[#003580]">🎥 Videos</h1>
      </div>

      {docs.length === 0 ? (
        <p className="page-empty text-center py-20 text-gray-400">No data available</p>
      ) : (
        <div className="video-grid video-grid-page">
          {docs.map((video: any) => {
            const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);
            if (!embedUrl) return null;
            return (
              <div key={video.id} className="video-card">
                <div className="video-embed-wrap">
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-embed"
                    loading="lazy"
                  />
                </div>
                <p className="video-title">{video.title}</p>
                {video.description && <p className="video-desc">{video.description}</p>}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="page-pagination mt-12">
          {currentPage > 1 && (
            <Link href={`/gallery/videos?page=${currentPage - 1}`} className="page-nav-btn">
              ‹ Prev
            </Link>
          )}
          <span className="page-num">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/gallery/videos?page=${currentPage + 1}`} className="page-nav-btn">
              Next ›
            </Link>
          )}
        </div>
      )}
    </PageLayout>
  );
}
