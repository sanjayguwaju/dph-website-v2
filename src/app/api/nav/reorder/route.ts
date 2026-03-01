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

    const { items } = await request.json();

    const reorderedItems = items.map(
      (item: PinnedItem, index: number) => ({
        ...item,
        order: index,
      }),
    );

    const userCollection = (user as { collection?: string }).collection || "users";

    await payload.db.upsert({
      collection: "payload-preferences",
      data: {
        key: "nav-pinned",
        user: { relationTo: userCollection, value: user.id },
        value: { pinnedItems: reorderedItems },
      },
      where: {
        key: { equals: "nav-pinned" },
        "user.value": { equals: user.id },
        "user.relationTo": { equals: userCollection },
      },
    });

    return NextResponse.json({ success: true, pinnedItems: reorderedItems });
  } catch (error) {
    // Log to monitoring service in production
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
