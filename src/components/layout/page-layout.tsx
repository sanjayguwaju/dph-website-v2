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
      <div className="w-full bg-[#f4f6f9] border-b border-[#e5e7eb]">
        <div className="container px-page py-4">
          <nav className="flex items-center text-[#2563eb] text-[15px] font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline flex-shrink-0">
              {th("home")}
            </Link>
            {breadcrumbs.map((item, i) => (
              <React.Fragment key={i}>
                <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
                {item.href ? (
                  <Link href={item.href} className="hover:underline flex-shrink-0">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-600 line-clamp-1 truncate min-w-0" title={item.label}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
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
