import { Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getNavigation } from "@/lib/queries/globals";
import { MobileMenu } from "./mobile-menu";
import type { Navigation, Category, Page } from "@/payload-types";
import { getLocale, getTranslations } from "next-intl/server";

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
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const [settings, navGlobal] = await Promise.all([getSiteSettings(), getNavigation()]);
  const navigation = (navGlobal as Navigation)?.mainNav || [];
  const s = settings as any;
  const tc = await getTranslations("common");
  const hospitalName = locale === "en" ? s.hospitalNameEn : s.hospitalNameNe;

  const address = locale === "en" ? s.addressEn : s.address;

  return (
    <header className="hospital-header">
      {/* Row 1: Branding */}
      <div className="hospital-branding-row">
        <div className="branding-container">
          <Link href="/" className="hospital-logo-wrap">
            {s.logo?.url ? (
              <Image
                src={s.logo.url}
                alt={hospitalName}
                width={120}
                height={120}
                priority
                className="hospital-logo-img"
              />
            ) : (
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/23/Emblem_of_Nepal.svg"
                alt="Government of Nepal"
                width={100}
                height={100}
                priority
              />
            )}
          </Link>
          
          <div className="hospital-title-block">
            <span className="gov-text">{t("govText")}</span>
            <span className="ministry-text">{t("ministryText")}</span>
            <h1 className="hospital-main-title">{hospitalName || tc("hospitalName")}</h1>
            <span className="location-text">{address || (locale === "en" ? "Baglung, Nepal" : "बागलुङ, नेपाल")}</span>
          </div>


          <div className="nepal-flag">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg"
              alt="Nepal Flag"
              width={70}
              height={100}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Navigation Bar */}
      <div className="hospital-nav-bar">
        <div className="nav-container">
          {/* Mobile Menu Trigger */}
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

          {/* Desktop navigation */}
          <nav className="hospital-nav" aria-label="Main navigation">
            <Link href="/" className="nav-home-btn">
              <Home size={20} fill="white" />
            </Link>

            {navigation.map((item, i) => {
              const href = resolveHref(item.type, item.category, item.page, item.customUrl);
              const hasSub = item.subMenu && item.subMenu.length > 0;

              return (
                <div key={item.id || i} className="hospital-nav-item">
                  <Link href={href} className="hospital-nav-link">
                    {item.label} {hasSub && <span className="nav-arrow">▾</span>}
                  </Link>

                  {hasSub && (
                    <div className="hospital-nav-dropdown">
                      {item.subMenu?.map((sub, j) => (
                        <Link
                          key={sub.id || j}
                          href={resolveHref(sub.type, sub.category, sub.page, sub.customUrl)}
                          className="hospital-dropdown-link"
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

          <div className="nav-online-service">{t("onlineServices")} ▾</div>
        </div>
      </div>
    </header>
  );
}
