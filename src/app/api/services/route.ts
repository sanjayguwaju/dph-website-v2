import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const isActive = searchParams.get("isActive");

    const payload = await getPayload({ config });

    const where: any = {};
    if (isActive === "true") {
      where.isActive = { equals: true };
    }

    const services = await payload.find({
      collection: "services",
      limit,
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: "order",
    });

    return NextResponse.json(services);
  } catch (error) {
    // Log to monitoring service in production
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
