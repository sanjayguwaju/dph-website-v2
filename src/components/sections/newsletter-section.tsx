"use client";

import { useState, useTransition } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getLocaleClient } from "@/utils/locale-client";
import { useEffect } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [locale, setLocale] = useState("ne");

  useEffect(() => {
    setLocale(getLocaleClient());
  }, []);

  const labels = {
    subscribe: locale === "ne" ? "हाम्रो न्युजलेटरमा सदस्यता लिनुहोस्" : "Subscribe to Our Newsletter",
    desc: locale === "ne" ? "हाम्रो नवीनतम समाचार र अपडेटहरू तपाईंको इनबक्समा प्राप्त गर्नुहोस्।" : "Get the latest news and updates delivered to your inbox.",
    placeholder: locale === "ne" ? "तपाईंको इमेल प्रविष्ट गर्नुहोस्" : "Enter your email",
    btn: locale === "ne" ? "सदस्यता लिनुहोस्" : "Subscribe",
    subscribing: locale === "ne" ? "सदस्यता लिँदै..." : "Subscribing...",
    success: locale === "ne" ? "सदस्यता लिनु भएकोमा धन्यवाद!" : "Thank you for subscribing!",
    error: locale === "ne" ? "केही गलत भएको छ। कृपया फेरि प्रयास गर्नुहोस।" : "Something went wrong. Please try again.",
    failed: locale === "ne" ? "सदस्यता लिन असफल भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।" : "Failed to subscribe. Please try again later.",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    startTransition(async () => {
      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(labels.success);
          setEmail("");
        } else {
          setStatus("error");
          setMessage(data.error || labels.error);
        }
      } catch {
        setStatus("error");
        setMessage(labels.failed);
      }

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    });
  };

  return (
    <section className="py-[var(--spacing-section)]">
      <div className="container mx-auto px-[var(--spacing-page)]">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-ink-700)] bg-gradient-to-br from-[var(--color-ink-800)] to-[var(--color-ink-900)]">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[var(--color-crimson)]/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[var(--color-amber)]/10 blur-3xl" />

          <div className="relative px-6 py-12 text-center lg:px-12 lg:py-16">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-crimson)]/10">
              <Mail className="h-7 w-7 text-[var(--color-crimson)]" />
            </div>

            <h2 className="text-2xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)] lg:text-3xl">
              {labels.subscribe}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[var(--color-ink-300)]">
              {labels.desc}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:flex-row"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={labels.placeholder}
                required
                disabled={isPending}
                className="w-full sm:flex-1"
              />
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? labels.subscribing : labels.btn}
              </Button>
            </form>

            {status !== "idle" && (
              <div
                className={`mt-4 flex items-center justify-center gap-2 text-sm ${status === "success"
                  ? "text-[var(--color-emerald)]"
                  : "text-[var(--color-crimson)]"
                  }`}
              >
                {status === "success" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
