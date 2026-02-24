import { ResetPasswordForm } from "./form";

export const metadata = {
  title: "Reset Password - DPH Website",
  description: "Reset your account password",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <div className="container mx-auto max-w-md py-20">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">Reset Password</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Enter your new password below
        </p>
        <ResetPasswordForm searchParams={searchParams} />
      </div>
    </div>
  );
}
