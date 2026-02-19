import Link from "next/link";
import { Twitter, Facebook, Instagram, Youtube, Linkedin, Mail } from "lucide-react";
import { getSiteSettings, getFooter } from "@/lib/queries/globals";
import { getCategories } from "@/lib/queries/categories";

export async function Footer() {
  const [settings, footer, categories] = await Promise.all([
    getSiteSettings(),
    getFooter(),
    getCategories(),
  ]);

  const socialLinks = [
    { name: "Twitter", href: settings.twitter, icon: Twitter },
    { name: "Facebook", href: settings.facebook, icon: Facebook },
    { name: "Instagram", href: settings.instagram, icon: Instagram },
    { name: "YouTube", href: settings.youtube, icon: Youtube },
    { name: "LinkedIn", href: settings.linkedin, icon: Linkedin },
  ].filter((link) => link.href);

  return (
    <footer className="border-t border-[var(--color-ink-800)] bg-[var(--color-ink-950)]">
      {/* Main footer */}
      <div className="container mx-auto px-[var(--spacing-page)] py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)]">
                {settings.siteName || "The Daily Chronicle"}
              </h2>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-400)]">
              {settings.siteDescription ||
                "Your trusted source for breaking news and in-depth reporting"}
            </p>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-[var(--color-ink-400)] transition-colors hover:bg-[var(--color-ink-800)] hover:text-white"
                    aria-label={link.name}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Categories column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-[var(--color-ink-200)] uppercase">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-[var(--color-ink-400)] transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-[var(--color-ink-200)] uppercase">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--color-ink-400)] transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[var(--color-ink-400)] transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-[var(--color-ink-400)] transition-colors hover:text-white"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-sm text-[var(--color-ink-400)] transition-colors hover:text-white"
                >
                  Advertise
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-[var(--color-ink-200)] uppercase">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-[var(--color-ink-400)]">
              Get the latest news delivered to your inbox daily.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="h-10 flex-1 rounded-lg border border-[var(--color-ink-700)] bg-[var(--color-ink-800)] px-3 text-sm text-[var(--color-ink-200)] placeholder:text-[var(--color-ink-500)] focus:ring-2 focus:ring-[var(--color-crimson)] focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-[var(--color-crimson)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-crimson-dark)]"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-ink-800)]">
        <div className="container mx-auto px-[var(--spacing-page)] py-4">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-[var(--color-ink-500)] sm:flex-row">
            <p>{footer.copyright || "© 2025 The Daily Chronicle. All rights reserved."}</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="transition-colors hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
