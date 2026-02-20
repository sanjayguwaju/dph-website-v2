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

export function VideoGallery({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="video-gallery-section">
      <div className="section-header">
        <h2 className="section-heading">🎥 भिडियो ग्यालरी</h2>
        <a href="/gallery/videos" className="section-view-all">
          सबै हेर्नुस् →
        </a>
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
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-embed"
                  loading="lazy"
                />
              </div>
              <p className="video-title">{video.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
