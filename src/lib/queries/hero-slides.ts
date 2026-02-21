import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import { getLocale } from "next-intl/server";
import type { HeroSlide } from "@/payload-types";

/**
 * Fetch active hero slides sorted by `order` ascending.
 */
export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  const payload = await getPayloadClient();
  const locale = (await getLocale()) as any;

  const slides = await payload.find({
    collection: "hero-slides",
    where: {
      isActive: { equals: true },
    },
    sort: "order",
    limit: 20,
    depth: 1,
    locale,
  });

  return slides.docs;
});
