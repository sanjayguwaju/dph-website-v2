import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import type { HeroSlide } from "@/payload-types";

/**
 * Fetch active hero slides sorted by `order` ascending.
 */
export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  try {
    const payload = await getPayloadClient();

    const slides = await payload.find({
      collection: "hero-slides",
      where: {
        isActive: { equals: true },
      },
      sort: "order",
      limit: 20,
      depth: 1,
    });

    return slides.docs || [];
  } catch (error) {
    return [];
  }
});
