import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { PinnedItem } from "../pinned/route";

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, type } = await request.json();

    const prefs = await payload.find({
      collection: "payload-preferences",
      where: {
        key: { equals: "nav-pinned" },
        "user.value": { equals: user.id },
      },
      limit: 1,
      depth: 0,
    });

    const existingItems: PinnedItem[] =
      (prefs.docs[0]?.value as { pinnedItems?: PinnedItem[] })?.pinnedItems ||
      [];

    if (
      existingItems.some((item) => item.slug === slug && item.type === type)
    ) {
      return NextResponse.json({ success: true, message: "Already pinned" });
    }

    const newItems: PinnedItem[] = [
      ...existingItems,
      { slug, type, order: existingItems.length },
    ];
    const userCollection = (user as { collection?: string }).collection || "users";

    await payload.db.upsert({
      collection: "payload-preferences",
      data: {
        key: "nav-pinned",
        user: { relationTo: userCollection, value: user.id },
        value: { pinnedItems: newItems },
      },
      where: {
        key: { equals: "nav-pinned" },
        "user.value": { equals: user.id },
        "user.relationTo": { equals: userCollection },
      },
    });

    return NextResponse.json({ success: true, pinnedItems: newItems });
  } catch (error) {
    // Log to monitoring service in production
    return NextResponse.json({ error: "Failed to pin" }, { status: 500 });
  }
}
