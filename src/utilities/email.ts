import type { BasePayload } from "payload";

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: string | Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

/**
 * Send a custom email using Payload's email adapter
 * @param payload - The Payload instance
 * @param options - Email options
 */
export async function sendEmail(
  payload: BasePayload,
  options: SendEmailOptions,
): Promise<void> {
  try {
    await payload.sendEmail({
      to: options.to,
      from: `${process.env.RESEND_FROM_NAME || "DPH Website"} <${process.env.RESEND_FROM_EMAIL || "noreply@example.com"}>`,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Email sending failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Send a contact form submission email to admin
 * @param payload - The Payload instance
 * @param data - Contact form data
 */
export async function sendContactFormEmail(
  payload: BasePayload,
  data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  },
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || "admin@example.com";
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0066cc; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #555; }
    .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
    .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #0066cc; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Contact Form Submission</h2>
  </div>
  <div class="content">
    <div class="field">
      <div class="label">Name:</div>
      <div class="value">${escapeHtml(data.name)}</div>
    </div>
    <div class="field">
      <div class="label">Email:</div>
      <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
    </div>
    ${data.phone ? `
    <div class="field">
      <div class="label">Phone:</div>
      <div class="value">${escapeHtml(data.phone)}</div>
    </div>
    ` : ""}
    <div class="field">
      <div class="label">Subject:</div>
      <div class="value">${escapeHtml(data.subject)}</div>
    </div>
    <div class="field">
      <div class="label">Message:</div>
      <div class="message-box">${escapeHtml(data.message).replace(/\n/g, "<br>")}</div>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail(payload, {
    to: adminEmail,
    subject: `Contact Form: ${data.subject}`,
    html,
    replyTo: data.email,
  });
}

/**
 * Send a newsletter welcome email
 * @param payload - The Payload instance
 * @param email - Subscriber email
 * @param unsubscribeToken - Token for unsubscribing
 */
export async function sendNewsletterWelcomeEmail(
  payload: BasePayload,
  email: string,
  unsubscribeToken: string,
): Promise<void> {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/newsletter/unsubscribe?token=${unsubscribeToken}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to DPH Newsletter</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .button { display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to DPH Newsletter!</h1>
  </div>
  <p>Thank you for subscribing to our newsletter. You'll receive the latest news, updates, and announcements from our hospital directly to your inbox.</p>
  <p>If you have any questions, feel free to reply to this email.</p>
  <div class="footer">
    <p>You received this email because you subscribed to our newsletter.</p>
    <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
  </div>
</body>
</html>
  `;

  await sendEmail(payload, {
    to: email,
    subject: "Welcome to DPH Newsletter!",
    html,
  });
}

/**
 * Send appointment confirmation email
 * @param payload - The Payload instance
 * @param data - Appointment data
 */
export async function sendAppointmentConfirmationEmail(
  payload: BasePayload,
  data: {
    patientName: string;
    patientEmail: string;
    appointmentDate: string;
    appointmentTime: string;
    department: string;
    doctorName?: string;
    notes?: string;
  },
): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Confirmation</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #555; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Appointment Confirmed!</h1>
  </div>
  <div class="content">
    <p>Hi ${escapeHtml(data.patientName)},</p>
    <p>Your appointment has been successfully scheduled. Here are the details:</p>
    <div class="details">
      <div class="detail-row">
        <span class="label">Date:</span>
        <span>${escapeHtml(data.appointmentDate)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Time:</span>
        <span>${escapeHtml(data.appointmentTime)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Department:</span>
        <span>${escapeHtml(data.department)}</span>
      </div>
      ${data.doctorName ? `
      <div class="detail-row">
        <span class="label">Doctor:</span>
        <span>${escapeHtml(data.doctorName)}</span>
      </div>
      ` : ""}
      ${data.notes ? `
      <div class="detail-row">
        <span class="label">Notes:</span>
        <span>${escapeHtml(data.notes)}</span>
      </div>
      ` : ""}
    </div>
    <p>Please arrive 15 minutes before your scheduled time. If you need to reschedule or cancel, please contact us as soon as possible.</p>
    <div class="footer">
      <p>If you have any questions, please reply to this email or call us.</p>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail(payload, {
    to: data.patientEmail,
    subject: "Appointment Confirmation - DPH Hospital",
    html,
  });
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return text.replace(/[&<>"']/g, (char) => div[char as keyof typeof div]);
}
