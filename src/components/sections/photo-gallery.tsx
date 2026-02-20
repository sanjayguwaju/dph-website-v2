"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = {
  image: any;
  caption?: string | null;
};

type Album = {
  id: string;
  title: string;
  coverImage?: any;
  images?: GalleryImage[];
};

export function PhotoGallery({ albums }: { albums: Album[] }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  if (albums.length === 0) return null;

  // Flatten all images for the strip
  const allImages: { url: string; alt: string; caption?: string | null }[] = [];
  for (const album of albums) {
    const cover =
      album.coverImage && typeof album.coverImage === "object" ? album.coverImage : null;
    if (cover?.url) allImages.push({ url: cover.url, alt: album.title });
    for (const img of album.images ?? []) {
      const imageObj = img.image && typeof img.image === "object" ? img.image : null;
      if (imageObj?.url)
        allImages.push({
          url: imageObj.url,
          alt: img.caption || album.title,
          caption: img.caption,
        });
    }
  }

  return (
    <section className="gallery-section">
      <div className="section-header">
        <h2 className="section-heading">📷 फोटो ग्यालरी</h2>
        <a href="/gallery/photos" className="section-view-all">
          सबै हेर्नुस् →
        </a>
      </div>

      <div className="photo-strip">
        {allImages.slice(0, 12).map((img, i) => (
          <button
            key={i}
            className="photo-strip-item"
            onClick={() => {
              setLightboxSrc(img.url);
              setLightboxAlt(img.alt);
            }}
            aria-label={`View ${img.alt}`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              width={200}
              height={150}
              className="photo-strip-img"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close"
          >
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
    </section>
  );
}
