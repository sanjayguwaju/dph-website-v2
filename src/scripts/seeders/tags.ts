import type { Payload } from "payload";
import type { Tag } from "../../payload-types";

const tagsData = [
  { name: "Breaking News", slug: "breaking-news" },
  { name: "Elections", slug: "elections" },
  { name: "Economy", slug: "economy" },
  { name: "Stock Market", slug: "stock-market" },
  { name: "Startups", slug: "startups" },
  { name: "AI", slug: "ai" },
  { name: "Cryptocurrency", slug: "cryptocurrency" },
  { name: "Climate Change", slug: "climate-change" },
  { name: "Football", slug: "football" },
  { name: "Cricket", slug: "cricket" },
  { name: "Olympics", slug: "olympics" },
  { name: "Movies", slug: "movies" },
  { name: "Music", slug: "music" },
  { name: "Television", slug: "television" },
  { name: "COVID-19", slug: "covid-19" },
  { name: "Mental Health", slug: "mental-health" },
  { name: "Space", slug: "space" },
  { name: "Research", slug: "research" },
  { name: "Travel", slug: "travel" },
  { name: "Food", slug: "food" },
  { name: "Fashion", slug: "fashion" },
  { name: "Education", slug: "education" },
  { name: "Environment", slug: "environment" },
  { name: "Innovation", slug: "innovation" },
  { name: "Exclusive", slug: "exclusive" },
];

export async function seedTags(payload: Payload): Promise<Tag[]> {
  const createdTags: Tag[] = [];

  for (const tagData of tagsData) {
    const tag = await payload.create({
      collection: "tags",
      data: tagData,
    });
    createdTags.push(tag);
  }

  return createdTags;
}
