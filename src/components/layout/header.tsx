import { Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getNavigation } from "@/lib/queries/globals";
import { MobileMenu } from "./mobile-menu";
import type { Navigation as NavigationType, Category, Page } from "@/payload-types";
import { HeaderScrollWrapper } from "./header-scroll";
import { Marquee } from "./marquee";
import { AnimatedNepalFlag } from "./nepal-flag";

// ─── URL helpers ─────────────────────────────────────────────────────────────

function resolveHref(
  type: "category" | "page" | "custom",
  category?: string | Category | null,
  page?: string | Page | null,
  customUrl?: string | null,
): string {
  if (type === "page" && page) {
    const p = page as Page;
    return `/${p.slug === "home" ? "" : p.slug}`;
  }
  if (type === "category" && category) {
    const c = category as Category;
    return `/category/${c.slug}`;
  }
  return customUrl || "#";
}

function resolveCtaHref(ctaButton: NavigationType["ctaButton"]): string {
  if (!ctaButton) return "#";
  if (ctaButton.type === "page" && ctaButton.page) {
    const p = ctaButton.page as Page;
    return `/${p.slug === "home" ? "" : p.slug}`;
  }
  return ctaButton.customUrl || "#";
}

// ─── Component ───────────────────────────────────────────────────────────────

export async function Header() {
  const [settings, navGlobal] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);

  const navigation = (navGlobal as NavigationType)?.mainNav || [];
  const ctaButton = (navGlobal as NavigationType)?.ctaButton;
  const s = settings as any;
  const hospitalName = s.hospitalNameNe || s.hospitalNameEn;
  const address = s.address || s.addressEn;

  const navItems = navigation.map((item) => ({
    label: item.label,
    href: resolveHref(item.type, item.category, item.page, item.customUrl),
    openInNewTab: item.openInNewTab,
    submenu: item.subMenu?.map((sub) => ({
      label: sub.label,
      href: resolveHref(sub.type, sub.category, sub.page, sub.customUrl),
    })),
  }));

  const ctaHref = resolveCtaHref(ctaButton);
  const ctaLabel = ctaButton?.label || "Online Services";
  const showCtaArrow = ctaButton?.showDropdownArrow ?? true;

  // Logo source: prefer CMS upload → fallback to local static file
  const logoSrc: string =
    s.logo?.url ??
    "https://upload.wikimedia.org/wikipedia/commons/2/23/Emblem_of_Nepal.svg";

  return (
    <HeaderScrollWrapper>
      <header className="hospital-header-v3">

        {/* ── Row 1: Branding ─────────────────────────────────────────── */}
        <div className="hospital-branding-row-v3 relative">
          <div className="container-refined flex items-center justify-between py-4">

            {/* Left: Government Logo / Emblem */}
            <div className="header-logo-container flex-shrink-0">
              <Link href="/" aria-label="Go to homepage">
                <Image
                  src={logoSrc}
                  alt={`${hospitalName} logo`}
                  width={100}
                  height={100}
                  priority
                  className="header-logo-img"
                  style={{ width: "auto", height: "auto" }}
                  // Inline sizes hint – emblem is always ≤100px
                  sizes="100px"
                />
              </Link>
            </div>

            {/* Center: Title block */}
            <div className="header-title-block flex-1 text-center">
              <p className="header-gov-text">गण्डकी प्रदेश सरकार</p>
              <p className="header-ministry-text">स्वास्थ्य मन्त्रालय</p>
              <h1 className="header-hospital-title">{hospitalName}</h1>
              <p className="header-location-text">
                {address || "बाग्लुङ, नेपाल"}
              </p>
            </div>

            {/* Right: Animated Nepal Flag */}
            <div className="header-flag-container flex-shrink-0" aria-hidden="true">
              <AnimatedNepalFlag height={90} />
            </div>

          </div>
        </div>

        {/* ── Row 2: Navigation Bar ────────────────────────────────────── */}
        <div className="hospital-nav-bar-v3">
          <div className="container-refined flex items-center w-full">

            {/* Mobile hamburger */}
            <MobileMenu
              items={navItems}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
            />

            {/* Desktop nav */}
            <nav
              className="header-desktop-nav flex-1 flex items-center"
              aria-label="Main navigation"
            >
              <Link href="/" className="nav-home-icon-v3" aria-label="Home">
                <Home size={20} fill="currentColor" />
              </Link>

              {navigation.map((item, i) => {
                const href = resolveHref(
                  item.type,
                  item.category,
                  item.page,
                  item.customUrl,
                );
                const hasSub = item.subMenu && item.subMenu.length > 0;

                return (
                  <div key={item.id || i} className="nav-item-v3 group">
                    <Link
                      href={href}
                      className="nav-link-v3"
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={
                        item.openInNewTab ? "noopener noreferrer" : undefined
                      }
                    >
                      {item.label}
                      {hasSub && (
                        <span className="nav-arrow-v3" aria-hidden="true">
                          ▼
                        </span>
                      )}
                    </Link>

                    {hasSub && (
                      <div className="nav-dropdown-v3" role="menu">
                        {item.subMenu?.map((sub, j) => (
                          <Link
                            key={sub.id || j}
                            href={resolveHref(
                              sub.type,
                              sub.category,
                              sub.page,
                              sub.customUrl,
                            )}
                            className="dropdown-link-v3"
                            role="menuitem"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* CTA button */}
            <Link href={ctaHref} className="nav-cta-v3 ml-auto">
              {ctaLabel} {showCtaArrow && "▾"}
            </Link>
          </div>
        </div>

        {/* ── Row 3: Highlights / Breaking-news Ticker ──────────────────── */}
        <Marquee />
      </header>
    </HeaderScrollWrapper>
  );
}
