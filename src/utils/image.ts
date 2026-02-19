interface Media {
  url?: string | null;
  alt?: string | null;
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null } | null;
    card?: { url?: string | null; width?: number | null } | null;
    tablet?: { url?: string | null; width?: number | null } | null;
    desktop?: { url?: string | null; width?: number | null } | null;
  } | null;
}

export function getImageUrl(
  media: string | Media | null | undefined,
  size?: "thumbnail" | "card" | "tablet" | "desktop",
): string {
  if (!media) return "/assets/placeholder.jpg";
  if (typeof media === "string") return media;

  if (size && media.sizes?.[size]?.url) {
    return media.sizes[size]!.url!;
  }

  return media.url || "/assets/placeholder.jpg";
}

export function getImageAlt(media: string | Media | null | undefined): string {
  if (!media || typeof media === "string") return "";
  return media.alt || "";
}

export function generateSrcSet(media: Media): string {
  if (!media.sizes) return "";

  const sizes: string[] = [];

  if (media.sizes.card?.url) {
    sizes.push(`${media.sizes.card.url} ${media.sizes.card.width || 768}w`);
  }
  if (media.sizes.tablet?.url) {
    sizes.push(`${media.sizes.tablet.url} ${media.sizes.tablet.width || 1024}w`);
  }
  if (media.sizes.desktop?.url) {
    sizes.push(`${media.sizes.desktop.url} ${media.sizes.desktop.width || 1920}w`);
  }

  return sizes.join(", ");
}

export function getBlurDataUrl(): string {
  // A tiny gray placeholder
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==";
}
