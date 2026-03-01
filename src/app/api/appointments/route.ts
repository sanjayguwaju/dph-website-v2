import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, phone, email, department, appointmentDate, message } = body;

    // Validate required fields
    if (!patientName || !phone || !department || !appointmentDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Create appointment in database
    const appointment = await payload.create({
      collection: "appointments",
      data: {
        patientName,
        phone,
        email: email || undefined,
        department,
        appointmentDate,
        message: message || undefined,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Appointment request submitted successfully",
      id: appointment.id,
    });
  } catch (error) {
    // Log to monitoring service in production
    return NextResponse.json(
      { success: false, error: "Failed to submit appointment request" },
      { status: 500 }
    );
  }
}
