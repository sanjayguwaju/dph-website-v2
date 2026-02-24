import { Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getNavigation } from "@/lib/queries/globals";
import { MobileMenu } from "./mobile-menu";
import type { Navigation, Category, Page } from "@/payload-types";
import { HeaderScrollWrapper } from "./header-scroll";
import { Marquee } from "./marquee";
import { formatNepaliDate } from "@/utils/nepali-date";

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

export async function Header() {
  const [settings, navGlobal] = await Promise.all([getSiteSettings(), getNavigation()]);
  const navigation = (navGlobal as Navigation)?.mainNav || [];
  const s = settings as any;
  const hospitalName = s.hospitalNameNe || s.hospitalNameEn;
  const address = s.address || s.addressEn;
  const nepaliDate = formatNepaliDate(new Date());

  return (
    <HeaderScrollWrapper>
      <header className="hospital-header-v3">

        {/* Row 1: Branding */}
        <div className="hospital-branding-row-v3 relative">
          <div className="container-refined flex items-center justify-between py-4">
            {/* Left: Logo */}
            <div className="header-logo-container flex-shrink-0">
              <Link href="/">
                {s.logo?.url ? (
                  <Image
                    src={s.logo.url}
                    alt={hospitalName}
                    width={100}
                    height={100}
                    priority
                    className="header-logo-img"
                  />
                ) : (
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/2/23/Emblem_of_Nepal.svg"
                    alt="Government of Nepal"
                    width={90}
                    height={90}
                    priority
                  />
                )}
              </Link>
            </div>

            {/* Center: Title Block */}
            <div className="header-title-block flex-1 text-center">
              <p className="header-gov-text">Government of Nepal</p>
              <p className="header-ministry-text">Ministry of Health and Population</p>
              <h1 className="header-hospital-title">{hospitalName}</h1>
              <p className="header-location-text">
                {address || "Baglung, Nepal"}
              </p>
            </div>

            {/* Right: Flag */}
            <div className="header-flag-container flex-shrink-0">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg"
                alt="Nepal Flag"
                width={60}
                height={80}
                priority
                className="nepal-flag-v3"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Navigation Bar */}
        <div className="hospital-nav-bar-v3">
          <div className="container-refined flex items-center w-full">
            <MobileMenu
              items={navigation.map((item) => ({
                label: item.label,
                href: resolveHref(item.type, item.category, item.page, item.customUrl),
                submenu: item.subMenu?.map((sub) => ({
                  label: sub.label,
                  href: resolveHref(sub.type, sub.category, sub.page, sub.customUrl),
                })),
              }))}
            />

            <nav className="header-desktop-nav flex-1 flex items-center" aria-label="Main navigation">
              <Link href="/" className="nav-home-icon-v3">
                <Home size={20} fill="currentColor" />
              </Link>

              {navigation.map((item, i) => {
                const href = resolveHref(item.type, item.category, item.page, item.customUrl);
                const hasSub = item.subMenu && item.subMenu.length > 0;

                return (
                  <div key={item.id || i} className="nav-item-v3 group">
                    <Link href={href} className="nav-link-v3">
                      {item.label}
                      {hasSub && <span className="nav-arrow-v3">▼</span>}
                    </Link>

                    {hasSub && (
                      <div className="nav-dropdown-v3">
                        {item.subMenu?.map((sub, j) => (
                          <Link
                            key={sub.id || j}
                            href={resolveHref(sub.type, sub.category, sub.page, sub.customUrl)}
                            className="dropdown-link-v3"
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

            <Link href="/appointments" className="nav-cta-v3 ml-auto">
              Online Services ▾
            </Link>
          </div>
        </div>

        {/* Row 3: Highlights Ticker */}
        <Marquee />
      </header>
    </HeaderScrollWrapper>
  );
}
