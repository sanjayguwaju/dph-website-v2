import { getPayloadClient } from "@/lib/payload";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 });
    }

    const payload = await getPayloadClient();

    const articles = await payload.find({
      collection: "articles",
      where: {
        and: [
          {
            or: [{ title: { like: query } }, { excerpt: { like: query } }],
          },
          { status: { equals: "published" } },
        ],
      },
      limit,
      depth: 1,
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
