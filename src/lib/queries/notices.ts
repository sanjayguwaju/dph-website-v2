import { getPayloadClient } from "@/lib/payload";
import { cache } from "react";
import type { Notice } from "@/payload-types";

// Re-export the generated type for use in components
export type { Notice as PopupNotice };

/**
 * Fetch published notices that should appear in the popup.
 */
export const getPopupNotices = cache(async (): Promise<Notice[]> => {
  try {
    const payload = await getPayloadClient();
    const now = new Date().toISOString();

    const notices = await payload.find({
      collection: "notices",
      where: {
        and: [
          { status: { equals: "published" } },
          { showInPopup: { equals: true } },
          {
            or: [{ popupStartDate: { less_than_equal: now } }, { popupStartDate: { exists: false } }],
          },
          {
            or: [{ popupEndDate: { greater_than_equal: now } }, { popupEndDate: { exists: false } }],
          },
        ],
      },
      sort: "-publishedDate",
      limit: 10,
      depth: 1,
    });

    return notices.docs || [];
  } catch (error) {
    return [];
  }
});

export const getNoticeById = cache(async (id: string, depth = 1) => {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "notices",
      where: { id: { equals: id } },
      limit: 1,
      depth,
    });
    return (result.docs[0] as Notice) || null;
  } catch (error) {
    return null;
  }
});
