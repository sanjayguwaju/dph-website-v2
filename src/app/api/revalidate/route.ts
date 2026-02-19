import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, secret, type } = body;

    // Validate secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Revalidate based on type
    if (type === "article" && slug) {
      revalidatePath(`/articles/${slug}`);
      revalidatePath("/");
    } else if (type === "category" && slug) {
      revalidatePath(`/category/${slug}`);
      revalidatePath("/");
    } else if (type === "author" && slug) {
      revalidatePath(`/author/${slug}`);
    } else if (type === "page" && slug) {
      revalidatePath(`/${slug}`);
    } else if (slug) {
      // Default: revalidate article
      revalidatePath(`/articles/${slug}`);
      revalidatePath("/");
    }

    // Also revalidate by tag if provided
    if (body.tag) {
      revalidateTag(body.tag);
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
