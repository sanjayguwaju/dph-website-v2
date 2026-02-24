import { VerifyEmailForm } from "./form";

export const metadata = {
  title: "Verify Email - DPH Website",
  description: "Verify your email address",
};

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; user?: string }>;
}) {
  return (
    <div className="container mx-auto max-w-md py-20">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Verify Your Email</h1>
        <VerifyEmailForm searchParams={searchParams} />
      </div>
    </div>
  );
}
