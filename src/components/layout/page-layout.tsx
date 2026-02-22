import React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
  maxWidth?: string;
}

export async function PageLayout({
  children,
  breadcrumbs,
  className = "",
  maxWidth = "max-w-7xl", // Default to 7xl but can be overridden (e.g. max-w-4xl for reading)
}: PageLayoutProps) {
  const th = await getTranslations("nav");

  return (
    <>
      <div className="breadcrumb-wrap-v3">
        <div className="container px-page">
          <nav className="breadcrumb-nav-v3" aria-label="Breadcrumb">
            <Link href="/" className="breadcrumb-link-v3">
              {th("home")}
            </Link>
            {breadcrumbs.map((item, i) => (
              <div key={i} className="breadcrumb-item-v3">
                <span className="breadcrumb-sep-v3">/</span>
                {item.href ? (
                  <Link href={item.href} className="breadcrumb-link-v3">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-current-v3 line-clamp-1 truncate" title={item.label}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <main className={`container bg-white px-page py-8 md:py-16 ${className}`}>
        <div className={`${maxWidth} mx-auto`}>
          {children}
        </div>
      </main>
    </>
  );
}
