import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";

export const metadata: Metadata = {
  title: "भिडियो ग्यालरी | Video Gallery",
  description: "अस्पतालका भिडियोहरूको संग्रह",
};

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

export default async function VideoGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 12;

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "video-gallery",
    where: { isActive: { equals: true } },
    sort: "-publishedDate",
    limit,
    page: currentPage,
    depth: 0,
  });

  const { docs, totalPages } = result;

  return (
    <main className="page-container">
      <div className="page-hero">
        <h1 className="page-hero-title">🎥 भिडियो ग्यालरी</h1>
      </div>

      {docs.length === 0 ? (
        <p className="page-empty">कुनै भिडियो उपलब्ध छैन।</p>
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
        <div className="page-pagination">
          {currentPage > 1 && (
            <a href={`/gallery/videos?page=${currentPage - 1}`} className="page-nav-btn">
              ‹ अघिल्लो
            </a>
          )}
          <span className="page-num">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <a href={`/gallery/videos?page=${currentPage + 1}`} className="page-nav-btn">
              अर्को ›
            </a>
          )}
        </div>
      )}
    </main>
  );
}
