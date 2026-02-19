import type { Payload } from "payload";
import type { Media } from "../../payload-types";
import * as fs from "fs";
import * as path from "path";

// Create placeholder media entries
// Note: In production seeding, you would upload actual files
// For development, we'll create entries that point to placeholder URLs

const mediaData = [
  {
    alt: "Author Avatar - Sarah Johnson",
    filename: "avatar-sarah-johnson.jpg",
    mimeType: "image/jpeg",
    caption: "Sarah Johnson, Senior Political Correspondent",
  },
  {
    alt: "Author Avatar - Michael Chen",
    filename: "avatar-michael-chen.jpg",
    mimeType: "image/jpeg",
    caption: "Michael Chen, Technology Editor",
  },
  {
    alt: "Author Avatar - Emily Rodriguez",
    filename: "avatar-emily-rodriguez.jpg",
    mimeType: "image/jpeg",
    caption: "Emily Rodriguez, Business Reporter",
  },
  {
    alt: "Author Avatar - David Park",
    filename: "avatar-david-park.jpg",
    mimeType: "image/jpeg",
    caption: "David Park, Sports Correspondent",
  },
  {
    alt: "Author Avatar - Lisa Thompson",
    filename: "avatar-lisa-thompson.jpg",
    mimeType: "image/jpeg",
    caption: "Lisa Thompson, Entertainment Editor",
  },
  {
    alt: "Author Avatar - Dr. James Wilson",
    filename: "avatar-james-wilson.jpg",
    mimeType: "image/jpeg",
    caption: "Dr. James Wilson, Health & Science Correspondent",
  },
  {
    alt: "Author Avatar - Priya Sharma",
    filename: "avatar-priya-sharma.jpg",
    mimeType: "image/jpeg",
    caption: "Priya Sharma, International Correspondent",
  },
  {
    alt: "Author Avatar - Alex Turner",
    filename: "avatar-alex-turner.jpg",
    mimeType: "image/jpeg",
    caption: "Alex Turner, Opinion Columnist",
  },
  // Featured images for articles
  {
    alt: "Tech Giants Earnings",
    filename: "article-tech-earnings.jpg",
    mimeType: "image/jpeg",
    caption: "Technology companies report record earnings",
  },
  {
    alt: "Climate Summit",
    filename: "article-climate-summit.jpg",
    mimeType: "image/jpeg",
    caption: "World leaders at the global climate summit",
  },
  {
    alt: "Championship Victory",
    filename: "article-championship.jpg",
    mimeType: "image/jpeg",
    caption: "Team celebrates championship win",
  },
  {
    alt: "Cancer Research Lab",
    filename: "article-cancer-research.jpg",
    mimeType: "image/jpeg",
    caption: "Researchers working on breakthrough cancer treatment",
  },
  {
    alt: "Stock Market Trading Floor",
    filename: "article-stock-market.jpg",
    mimeType: "image/jpeg",
    caption: "Stock market trading activity",
  },
  {
    alt: "Movie Premiere",
    filename: "article-movie-premiere.jpg",
    mimeType: "image/jpeg",
    caption: "Film premiere event",
  },
  {
    alt: "Ocean Research Vessel",
    filename: "article-ocean-research.jpg",
    mimeType: "image/jpeg",
    caption: "Research vessel conducting deep sea exploration",
  },
  {
    alt: "Infrastructure Construction",
    filename: "article-infrastructure.jpg",
    mimeType: "image/jpeg",
    caption: "Major infrastructure construction project",
  },
  {
    alt: "Remote Work Office",
    filename: "article-remote-work.jpg",
    mimeType: "image/jpeg",
    caption: "Modern hybrid work environment",
  },
  {
    alt: "Travel Destination",
    filename: "article-travel.jpg",
    mimeType: "image/jpeg",
    caption: "Popular tourist destination",
  },
];

// Simple placeholder image data (1x1 transparent PNG)
const placeholderImageBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export async function seedMedia(payload: Payload): Promise<Media[]> {
  const createdMedia: Media[] = [];

  // For each media item, we'll create a placeholder entry
  // In production, you'd upload actual images using the upload API
  for (const item of mediaData) {
    try {
      // Create a minimal placeholder buffer
      const buffer = Buffer.from(placeholderImageBase64, "base64");

      // Create media using the local API (bypasses file upload requirement for seeding)
      const media = await payload.create({
        collection: "media",
        data: {
          alt: item.alt,
          caption: item.caption,
          // These fields are normally auto-populated on upload but we set them manually
          filename: item.filename,
          mimeType: item.mimeType,
          filesize: buffer.length,
          width: 1,
          height: 1,
          url: `/media/${item.filename}`, // Placeholder URL
        } as any,
      });
      createdMedia.push(media);
    } catch (error) {
      console.log(`   ⚠️ Could not create media: ${item.alt}`);
    }
  }

  return createdMedia;
}

// Get media by index for easy reference
export function getAuthorAvatars(media: Media[]): Media[] {
  return media.slice(0, 8); // First 8 are author avatars
}

export function getArticleImages(media: Media[]): Media[] {
  return media.slice(8); // Rest are article images
}
