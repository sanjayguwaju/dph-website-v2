import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 7200,
    verify: {
      generateEmailHTML: (arg) => {
        const { token, user } = arg || {};
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}&user=${user?.id}`;
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Email</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>Welcome to DPH Website!</h1>
  <p>Hi ${user?.firstName || user?.email},</p>
  <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
  <a href="${url}" class="button">Verify Email Address</a>
  <p>Or copy and paste this link into your browser:</p>
  <p><a href="${url}">${url}</a></p>
  <div class="footer">
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create this account, you can safely ignore this email.</p>
  </div>
</body>
</html>`;
      },
      generateEmailSubject: (arg) => {
        const { user } = arg || {};
        return `Verify your email for DPH Website - Welcome ${user?.firstName || user?.email}!`;
      },
    },
    forgotPassword: {
      generateEmailHTML: (arg) => {
        const { token, user } = arg || {};
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`;
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>Password Reset Request</h1>
  <p>Hi ${user?.firstName || user?.email},</p>
  <p>We received a request to reset your password. Click the button below to create a new password:</p>
  <a href="${url}" class="button">Reset Password</a>
  <p>Or copy and paste this link into your browser:</p>
  <p><a href="${url}">${url}</a></p>
  <div class="warning">
    <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
  </div>
  <div class="footer">
    <p>If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.</p>
  </div>
</body>
</html>`;
      },
      generateEmailSubject: () => "Password reset request for DPH Website",
    },
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "firstName", "lastName", "role"],
    group: "Admin",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => {
      if (user?.role === "admin") return true;
      return {
        id: { equals: user?.id },
      };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Author", value: "author" },
        { label: "Contributor", value: "contributor" },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === "admin",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
  ],
};
