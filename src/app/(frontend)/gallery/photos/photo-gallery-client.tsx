"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images, ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";

// ── Types ─────────────────────────────────────────────────────────────────────
type GalleryImageItem = {
  image?: any;
  externalImage?: string | null;
  caption?: string | null;
};

type Album = {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: any;
  externalCoverImage?: string | null;
  images?: GalleryImageItem[];
  publishedDate?: string | null;
};

type FlatImage = {
  url: string;
  alt: string;
  albumTitle: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function resolveImageUrl(img: GalleryImageItem): string | null {
  if (img.image && typeof img.image === "object" && img.image.url) {
    return img.image.url as string;
  }
  return img.externalImage || null;
}

function resolveCoverUrl(album: Album): string | null {
  if (album.coverImage && typeof album.coverImage === "object" && album.coverImage.url) {
    return album.coverImage.url as string;
  }
  // Fall back to externalCoverImage, then first image in album
  if (album.externalCoverImage) return album.externalCoverImage;
  const first = album.images?.[0];
  if (first) return resolveImageUrl(first);
  return null;
}

function getAlbumImages(album: Album): FlatImage[] {
  return (album.images ?? []).flatMap((img) => {
    const url = resolveImageUrl(img);
    return url
      ? [{ url, alt: img.caption || album.title, albumTitle: album.title }]
      : [];
  });
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: FlatImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const tc = useTranslations("common");

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const current = images[idx];

  return (
    <div
      className="gallery-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="gallery-lb-modal" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-lb-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="gallery-lb-img-container">
          <img
            src={current.url}
            alt={current.alt}
            className="gallery-lb-img-actual"
          />

          {images.length > 1 && (
            <>
              <button className="gallery-lb-nav-btn prev" onClick={prev}>
                <ChevronLeft size={24} />
              </button>
              <button className="gallery-lb-nav-btn next" onClick={next}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        <div className="gallery-lb-caption-bar">
          <p className="gallery-lb-title">{current.alt}</p>
          {images.length > 1 && (
            <span className="gallery-lb-index">{idx + 1} / {images.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Album Card ────────────────────────────────────────────────────────────────
function AlbumCard({ album, onClick }: { album: Album; onClick: () => void }) {
  const cover = resolveCoverUrl(album);
  const count = (album.images ?? []).filter((img) => resolveImageUrl(img)).length;

  return (
    <button className="gallery-album-card" onClick={onClick} aria-label={album.title}>
      <div className="gallery-album-thumb">
        {cover ? (
          <Image
            src={cover}
            alt={album.title}
            fill
            className="gallery-album-cover-img"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        ) : (
          <div className="gallery-album-placeholder">
            <Images size={36} />
          </div>
        )}
        {count > 0 && <span className="gallery-album-badge">{count} Photos</span>}
        <div className="gallery-album-hover-overlay">
          <ZoomIn size={28} />
        </div>
      </div>
      <div className="gallery-album-info">
        <p className="gallery-album-title">{album.title}</p>
        {album.description && (
          <p className="gallery-album-desc">{album.description}</p>
        )}
      </div>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PhotoGalleryClient({ albums }: { albums: Album[] }) {
  const [view, setView] = useState<"albums" | "grid">("albums");
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [lightbox, setLightbox] = useState<{ images: FlatImage[]; startIndex: number } | null>(null);
  const t = useTranslations("gallery");
  const tc = useTranslations("common");

  // All images across ALL albums
  const allImages: FlatImage[] = albums.flatMap(getAlbumImages);

  // Images shown in current view
  const currentImages: FlatImage[] = activeAlbum
    ? getAlbumImages(activeAlbum)
    : allImages;

  const openLightbox = (images: FlatImage[], startIndex: number) => {
    setLightbox({ images, startIndex });
  };

  // When user enters an album
  const enterAlbum = (album: Album) => {
    setActiveAlbum(album);
    setView("grid");
  };

  // Back to albums
  const backToAlbums = () => {
    setActiveAlbum(null);
    setView("albums");
  };

  // Show all photos grid
  const showAll = () => {
    setActiveAlbum(null);
    setView("grid");
  };

  return (
    <div className="photo-gallery-page">
      {/* ── Tabs ── */}
      <div className="gallery-tabs">
        <button
          className={`gallery-tab-btn${view === "albums" && !activeAlbum ? " active" : ""}`}
          onClick={backToAlbums}
        >
          <Images size={15} />
          {t("albums")}
          <span className="gallery-tab-count">{albums.length}</span>
        </button>
        <button
          className={`gallery-tab-btn${view === "grid" && !activeAlbum ? " active" : ""}`}
          onClick={showAll}
        >
          {t("allPhotos")}
          <span className="gallery-tab-count">{allImages.length}</span>
        </button>
        {activeAlbum && (
          <span className="gallery-tab-breadcrumb">
            › {activeAlbum.title}
            <span className="gallery-tab-count">{getAlbumImages(activeAlbum).length}</span>
          </span>
        )}
      </div>

      {/* ── Back button inside album ── */}
      {activeAlbum && (
        <button className="gallery-back-btn" onClick={backToAlbums}>
          <ChevronLeft size={16} />
          {tc("back")}
        </button>
      )}

      {/* ── Albums View ── */}
      {view === "albums" && !activeAlbum && (
        <>
          {albums.length === 0 ? (
            <p className="page-empty">{tc("noData")}</p>
          ) : (
            <div className="gallery-albums-grid">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onClick={() => enterAlbum(album)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Grid View ── */}
      {(view === "grid" || activeAlbum) && (
        <>
          {currentImages.length === 0 ? (
            <p className="page-empty">{tc("noData")}</p>
          ) : (
            <div className="gallery-masonry-grid">
              {currentImages.map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  className="gallery-masonry-item"
                  onClick={() => openLightbox(currentImages, i)}
                  aria-label={`View: ${img.alt}`}
                >
                  <div className="gallery-masonry-img-wrap">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="gallery-masonry-img"
                      sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                    <div className="gallery-masonry-overlay">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                  {img.alt && <p className="gallery-masonry-caption">{img.alt}</p>}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
