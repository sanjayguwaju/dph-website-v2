import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, type, message } = body;

    // Validate required fields
    if (!name || !message || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Create feedback in database
    const feedback = await payload.create({
      collection: "feedback",
      data: {
        name,
        email: email || undefined,
        phone: phone || undefined,
        type,
        message,
        status: "new",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      id: feedback.id,
    });
  } catch (error) {
    // Log to monitoring service in production
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
