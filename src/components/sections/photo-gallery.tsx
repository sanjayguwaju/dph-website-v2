"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useTranslations } from "next-intl";

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

type FlatImage = { url: string; alt: string };

// ── resolve helpers ───────────────────────────────────────────────────────────
function resolveImg(img: GalleryImage): string | null {
  if (img.image && typeof img.image === "object" && img.image.url) return img.image.url;
  return img.externalImage || null;
}

function resolveCover(album: Album): string | null {
  if (album.coverImage && typeof album.coverImage === "object" && album.coverImage.url)
    return album.coverImage.url;
  if (album.externalCoverImage) return album.externalCoverImage;
  // Fall back to first album image
  const first = album.images?.[0];
  return first ? resolveImg(first) : null;
}

export function PhotoGallery({ albums }: { albums: Album[] }) {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  const [lightbox, setLightbox] = useState<{ images: FlatImage[]; idx: number } | null>(null);

  // Flatten all images from all albums for lightbox navigation
  const allImages: FlatImage[] = [];
  for (const album of albums) {
    const cover = resolveCover(album);
    if (cover) allImages.push({ url: cover, alt: album.title });
    for (const img of album.images ?? []) {
      const url = resolveImg(img);
      if (url) allImages.push({ url, alt: img.caption || album.title });
    }
  }

  const prev = useCallback(
    () => setLightbox((lb) => lb && { ...lb, idx: (lb.idx - 1 + lb.images.length) % lb.images.length }),
    []
  );
  const next = useCallback(
    () => setLightbox((lb) => lb && { ...lb, idx: (lb.idx + 1) % lb.images.length }),
    []
  );

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, prev, next]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <PhotoGallerySkeleton />;
  if (allImages.length === 0) return null;

  const previewImages = allImages.slice(0, 8);

  return (
    <section className="gallery-section-v2">
      <div className="gallery-header-v2 flex items-center justify-between gap-4">
        <div className="gallery-header-line flex-1"></div>
        <h2 className="flex-shrink-0">{t("photoGallery")}</h2>
        <div className="gallery-header-line flex-1"></div>
        <Link
          href="/gallery/photos"
          className="gallery-view-all text-sm font-bold text-white uppercase tracking-wider hover:text-white/80 transition-colors"
        >
          {tc("viewAll")}
        </Link>
      </div>

      <div className="photo-grid-v2">
        {previewImages.map((img, i) => (
          <ScrollReveal
            key={i}
            delay={i * 75}
            animation="animate-in fade-in zoom-in-95"
            duration={400}
          >
            <button
              className="photo-item-v2"
              onClick={() => setLightbox({ images: allImages, idx: i })}
              aria-label={`View: ${img.alt}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={400}
                height={300}
                className="photo-strip-img"
              />
              <div className="photo-item-overlay">
                <span className="photo-item-caption">{img.alt}</span>
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>

      {/* ── Lightbox Refined ── */}
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

function PhotoGallerySkeleton() {
  return (
    <div className="gallery-section-v2 animate-pulse opacity-60">
       <div className="h-12 bg-gray-100 rounded-2xl mb-8"></div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
             <div key={i} className="aspect-[4/3] bg-gray-50 rounded-2xl"></div>
          ))}
       </div>
    </div>
  );
}
