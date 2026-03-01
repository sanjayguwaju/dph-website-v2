import { getPayloadClient } from "@/lib/payload";
import { NextRequest, NextResponse } from "next/server";
import type { Where } from "payload";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured") === "true";
    const breaking = searchParams.get("breaking") === "true";

    const payload = await getPayloadClient();

    const where: Where = {
      status: { equals: "published" },
    };

    if (category) {
      where.category = { equals: category };
    }

    if (tag) {
      where.tags = { contains: tag };
    }

    if (featured) {
      where.featured = { equals: true };
    }

    if (breaking) {
      where.breaking = { equals: true };
    }

    const articles = await payload.find({
      collection: "articles",
      where,
      limit,
      page,
      sort: "-publishedDate",
      depth: 1,
    });

    return NextResponse.json(articles);
  } catch (error) {
    // Log to monitoring service in production
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
