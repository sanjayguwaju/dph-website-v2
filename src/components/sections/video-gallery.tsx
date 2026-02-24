import { getLocalizedValue } from "@/lib/utils/localized";

type Video = {
  id: string;
  title: string;
  youtubeUrl: string;
  description?: string | null;
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

export async function VideoGallery({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="gallery-section-v2" style={{ borderTop: '1px solid #eee' }}>
      <div className="gallery-header-v2">
        <div className="gallery-header-line"></div>
        <h2>Video Gallery</h2>
        <div className="gallery-header-line"></div>
      </div>
      <div className="video-grid">
        {videos.map((video) => {
          const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);
          if (!embedUrl) return null;
          return (
            <div key={video.id} className="video-card">
              <div className="video-embed-wrap">
                <iframe
                  src={embedUrl}
                  title={getLocalizedValue(video.title)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-embed"
                  loading="lazy"
                />
              </div>
              <p className="video-title">{getLocalizedValue(video.title)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
