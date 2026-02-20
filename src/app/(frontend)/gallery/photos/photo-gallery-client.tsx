"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { image: any; caption?: string | null };
type Album = {
  id: string;
  title: string;
  coverImage?: any;
  images?: GalleryImage[];
  publishedDate?: string | null;
};

export function PhotoGalleryClient({ albums }: { albums: Album[] }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);

  const displayAlbum = activeAlbum ? albums.find((a) => a.id === activeAlbum) : null;

  const allImages = displayAlbum
    ? (displayAlbum.images ?? []).flatMap((img) => {
        const obj = img.image && typeof img.image === "object" ? img.image : null;
        return obj?.url ? [{ url: obj.url as string, alt: img.caption || displayAlbum.title }] : [];
      })
    : albums.flatMap((album) => {
        const cover =
          album.coverImage && typeof album.coverImage === "object" ? album.coverImage : null;
        return cover?.url ? [{ url: cover.url as string, alt: album.title }] : [];
      });

  return (
    <div className="photo-gallery-page">
      {/* Album filter */}
      <div className="album-filter">
        <button
          onClick={() => setActiveAlbum(null)}
          className={`album-filter-btn${!activeAlbum ? "active" : ""}`}
        >
          सबै
        </button>
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setActiveAlbum(album.id)}
            className={`album-filter-btn${activeAlbum === album.id ? "active" : ""}`}
          >
            {album.title}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="photo-page-grid">
        {allImages.map((img, i) => (
          <button
            key={i}
            className="photo-page-item"
            onClick={() => {
              setLightboxSrc(img.url);
              setLightboxAlt(img.alt);
            }}
            aria-label={`View ${img.alt}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              width={300}
              height={220}
              className="photo-page-img"
            />
          </button>
        ))}
      </div>

      {allImages.length === 0 && <p className="page-empty">कुनै फोटो उपलब्ध छैन।</p>}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-modal="true"
        >
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>
            ✕
          </button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxSrc}
              alt={lightboxAlt}
              width={1200}
              height={800}
              className="lightbox-img"
            />
            {lightboxAlt && <p className="lightbox-caption">{lightboxAlt}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
