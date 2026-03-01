import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export interface PinnedItem {
  slug: string;
  type: "collection" | "global" | "custom";
  order: number;
}

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) {
      return NextResponse.json({ pinnedItems: [] });
    }

    const prefs = await payload.find({
      collection: "payload-preferences",
      where: {
        key: { equals: "nav-pinned" },
        "user.value": { equals: user.id },
      },
      limit: 1,
      depth: 0,
    });

    const pinnedItems =
      (
        prefs.docs[0]?.value as { pinnedItems?: PinnedItem[] }
      )?.pinnedItems || [];
    return NextResponse.json({ pinnedItems });
  } catch (error) {
    // Log to monitoring service in production
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
