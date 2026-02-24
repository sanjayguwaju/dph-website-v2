"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { getLocalizedValue } from "@/lib/utils/localized";

type GalleryImage = {
  image?: any;
  externalImage?: string | null;
  caption?: string | null;
};

type Album = {
  id: string;
  title: string;
  coverImage?: any;
  externalCoverImage?: string | null;
  images?: GalleryImage[];
};

type FlatImage = {
  url: string;
  alt: string;
  albumTitle: string;
};

type AlbumCover = {
  url: string;
  alt: string;
  albumId: string;
  imageCount: number;
};

// ── resolve helpers ───────────────────────────────────────────────────────────
function resolveImg(img: GalleryImage): string | null {
  if (img.image && typeof img.image === "object" && img.image.url) return img.image.url;
  return img.externalImage || null;
}

function resolveCover(album: Album): string | null {
  if (album.coverImage && typeof album.coverImage === "object" && album.coverImage.url)
    return album.coverImage.url;
  if (album.externalCoverImage) return album.externalCoverImage;
  const first = album.images?.[0];
  return first ? resolveImg(first) : null;
}

function getAlbumImages(album: Album): FlatImage[] {
  return (album.images ?? []).flatMap((img) => {
    const url = resolveImg(img);
    return url
      ? [{ url, alt: img.caption || album.title, albumTitle: album.title }]
      : [];
  });
}

export function OptimizedPhotoGallery({ albums }: { albums: Album[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightbox, setLightbox] = useState<{ images: FlatImage[]; idx: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Flatten all images from all albums
  const allImages: FlatImage[] = albums.flatMap(getAlbumImages);

  // Get cover images for the carousel (one per album)
  const albumCovers: AlbumCover[] = albums.map((album) => ({
    url: resolveCover(album) || "",
    alt: getLocalizedValue(album.title),
    albumId: album.id,
    imageCount: (album.images ?? []).filter(img => resolveImg(img)).length,
  })).filter(img => img.url);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, Math.ceil(albumCovers.length / itemsPerView) - 1);

  const handleImageLoad = (url: string) => {
    setLoadedImages(prev => new Set(prev).add(url));
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  const handleImageError = (url: string) => {
    setFailedImages(prev => new Set(prev).add(url));
  };

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  }, [maxIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  }, [maxIndex]);

  const openLightbox = (index: number) => {
    const flatIndex = currentIndex * itemsPerView + index;
    if (flatIndex < allImages.length) {
      setLightbox({ images: allImages, idx: flatIndex });
    }
  };

  const prevImage = useCallback(
    () => setLightbox((lb) => lb && { ...lb, idx: (lb.idx - 1 + lb.images.length) % lb.images.length }),
    []
  );
  const nextImage = useCallback(
    () => setLightbox((lb) => lb && { ...lb, idx: (lb.idx + 1) % lb.images.length }),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!lightbox) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [lightbox, prevSlide, nextSlide]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, prevImage, nextImage]);

  // Auto-advance carousel
  useEffect(() => {
    if (albumCovers.length <= itemsPerView || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex, albumCovers.length, itemsPerView, isPaused]);

  if (!mounted) return <GallerySkeleton />;
  if (albumCovers.length === 0) return null;

  const visibleItems = albumCovers.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  );

  return (
    <section className="gallery-section-optimized">
      <div className="gallery-optimized-container">
        {/* Header */}
        <h2 className="gallery-optimized-title">Gallery</h2>

        {/* Carousel Container */}
        <div
          className="gallery-optimized-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Navigation */}
          {albumCovers.length > itemsPerView && (
            <button
              className="gallery-nav-btn gallery-nav-prev"
              onClick={prevSlide}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Cards Grid */}
          <div className="gallery-cards-grid">
            {visibleItems.map((item) => (
              <Link
                key={item.albumId}
                href={`/gallery/photos?album=${item.albumId}`}
                className="gallery-card"
                aria-label={`View album: ${item.alt}`}
              >
                <div className="gallery-card-image-wrap">
                  {failedImages.has(item.url) ? (
                    <div className="gallery-card-error">
                      <ImageIcon size={24} />
                    </div>
                  ) : (
                    <>
                      {!loadedImages.has(item.url) && (
                        <div className="gallery-card-skeleton" />
                      )}
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        className={`gallery-card-image ${loadedImages.has(item.url) ? 'loaded' : 'loading'}`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        onLoad={() => handleImageLoad(item.url)}
                        onError={() => handleImageError(item.url)}
                      />
                      {item.imageCount > 0 && (
                        <span className="gallery-card-badge">{item.imageCount} Photos</span>
                      )}
                    </>
                  )}
                </div>
                <div className="gallery-card-content">
                  <p className="gallery-card-caption">{item.alt}</p>
                  <span className="gallery-card-view-btn">View Details →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Navigation */}
          {albumCovers.length > itemsPerView && (
            <button
              className="gallery-nav-btn gallery-nav-next"
              onClick={nextSlide}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* View All Link */}
        <div className="gallery-optimized-footer">
          <Link href="/gallery/photos" className="gallery-view-all-link">
            View All Photos →
          </Link>
        </div>
      </div>

      {/* ── Lightbox (for individual photo view if needed) ── */}
      {lightbox && (
        <div
          className="gallery-lightbox-overlay"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="gallery-lb-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-lb-close-btn" onClick={() => setLightbox(null)}>
              <X size={20} />
            </button>

            <div className="gallery-lb-img-container">
              <img
                src={lightbox.images[lightbox.idx].url}
                alt={lightbox.images[lightbox.idx].alt}
                className="gallery-lb-img-actual"
              />

              {lightbox.images.length > 1 && (
                <>
                  <button className="gallery-lb-nav-btn prev" onClick={prevImage}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="gallery-lb-nav-btn next" onClick={nextImage}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="gallery-lb-caption-bar">
              <p className="gallery-lb-title">{lightbox.images[lightbox.idx].alt}</p>
              {lightbox.images.length > 1 && (
                <span className="gallery-lb-index">
                  {lightbox.idx + 1} / {lightbox.images.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function GallerySkeleton() {
  return (
    <section className="gallery-section-optimized">
      <div className="gallery-optimized-container animate-pulse">
        <h2 className="gallery-optimized-title">Gallery</h2>
        <div className="gallery-cards-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="gallery-card">
              <div className="gallery-card-image-wrap bg-white/10"></div>
              <div className="gallery-card-content">
                <div className="h-4 bg-white/20 rounded mt-3 mx-2"></div>
                <div className="h-3 bg-white/10 rounded mt-2 mx-2 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
