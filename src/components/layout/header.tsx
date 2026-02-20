import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getNavigation } from "@/lib/queries/globals";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const [settings, nav] = await Promise.all([getSiteSettings(), getNavigation()]);

  const logoImage = settings.logo && typeof settings.logo === "object" ? settings.logo : null;

  return (
    <header className="hospital-header">
      <div className="hospital-header-inner">
        {/* Logo + Name */}
        <Link href="/" className="hospital-brand">
          {logoImage?.url ? (
            <Image
              src={logoImage.url}
              alt={settings.hospitalNameEn || "Hospital Logo"}
              width={64}
              height={64}
              className="hospital-logo"
              priority
            />
          ) : (
            <div className="hospital-logo-placeholder">🏥</div>
          )}
          <div className="hospital-name-block">
            <span className="hospital-name-ne">
              {(settings as any).hospitalNameNe || "जिल्ला अस्पताल"}
            </span>
            <span className="hospital-name-en">
              {(settings as any).hospitalNameEn || "District Hospital"}
            </span>
            {(settings as any).taglineNe && (
              <span className="hospital-tagline">{(settings as any).taglineNe}</span>
            )}
          </div>
        </Link>

        {/* Mobile menu trigger */}
        <MobileMenu categories={[]} />

        {/* Desktop navigation */}
        <nav className="hospital-nav" aria-label="Main navigation">
          {(nav?.mainNav ?? []).map((item: any, i: number) => {
            const url =
              item.type === "custom"
                ? item.customUrl
                : item.type === "page" && typeof item.page === "object"
                  ? `/${item.page.slug}`
                  : "#";

            return (
              <div key={i} className="hospital-nav-item">
                <Link
                  href={url || "#"}
                  target={item.openInNewTab ? "_blank" : undefined}
                  className="hospital-nav-link"
                >
                  {item.label}
                  {item.subMenu?.length > 0 && <span className="nav-arrow">▾</span>}
                </Link>
                {item.subMenu?.length > 0 && (
                  <div className="hospital-nav-dropdown">
                    {item.subMenu.map((sub: any, j: number) => {
                      const subUrl =
                        sub.type === "custom"
                          ? sub.customUrl
                          : sub.type === "page" && typeof sub.page === "object"
                            ? `/${sub.page.slug}`
                            : "#";
                      return (
                        <Link key={j} href={subUrl || "#"} className="hospital-dropdown-link">
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
