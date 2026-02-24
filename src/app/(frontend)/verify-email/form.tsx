"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface VerifyEmailFormProps {
  searchParams: Promise<{ token?: string; user?: string }>;
}

export function VerifyEmailForm({ searchParams }: VerifyEmailFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = await searchParams;
        const { token, user } = params;

        if (!token || !user) {
          setStatus("error");
          setMessage("Invalid verification link. Missing token or user ID.");
          return;
        }

        const response = await fetch("/api/users/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            user,
          }),
        });

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          const error = await response.json();
          setStatus("error");
          setMessage(error.message || "Failed to verify email. The link may have expired.");
        }
      } catch {
        setStatus("error");
        setMessage("An error occurred while verifying your email. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="text-center">
      <div className="mb-6">
        {status === "loading" && (
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        )}
        {status === "success" && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        {status === "error" && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>

      <p className="mb-6 text-muted-foreground">{message}</p>

      {status === "success" && (
        <Button onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      )}

      {status === "error" && (
        <Button variant="outline" onClick={() => router.push("/login")}>
          Back to Login
        </Button>
      )}
    </div>
  );
}
