import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { PhotoGalleryClient } from "./photo-gallery-client";

export const metadata: Metadata = {
  title: "फोटो ग्यालरी | Photo Gallery",
  description: "अस्पतालका फोटोहरूको संग्रह",
};

export default async function PhotoGalleryPage() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "photo-gallery",
    where: { isActive: { equals: true } },
    sort: "-publishedDate",
    limit: 20,
    depth: 1,
  });

  return (
    <main className="page-container">
      <div className="page-hero">
        <h1 className="page-hero-title">📷 फोटो ग्यालरी</h1>
      </div>
      <PhotoGalleryClient albums={result.docs as any} />
    </main>
  );
}
