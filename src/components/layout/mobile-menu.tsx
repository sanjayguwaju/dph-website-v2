"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, X, Search } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  openInNewTab?: boolean | null;
  submenu?: { label: string; href: string }[];
}

interface MobileMenuProps {
  items: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function MobileMenu({ items, ctaLabel = "Online Services", ctaHref = "/appointments" }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="mobile-menu-wrapper-v3">
      {/* Hamburger trigger */}
      <button
        id="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`mobile-menu-trigger-v3 ${isOpen ? "open" : ""}`}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-bar-v3" />
        <span className="hamburger-bar-v3" />
        <span className="hamburger-bar-v3" />
      </button>

      {/* Accordion Dropdown */}
      {isOpen && (
        <div className="mobile-menu-dropdown-v3 relative z-[1001]">
          <nav className="mobile-nav-v3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-link-v3 home-link-v3 flex items-center gap-2"
            >
              <i className="lucide-home shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </i>
            </Link>

            {items.map((item) => {
              const hasSub = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedItems[item.label];

              return (
                <div key={item.label} className="mobile-nav-item-v3">
                  <div className="mobile-nav-link-row-v3">
                    <Link
                      href={item.href}
                      onClick={() => !hasSub && setIsOpen(false)}
                      className="mobile-nav-link-v3"
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={
                        item.openInNewTab ? "noopener noreferrer" : undefined
                      }
                    >
                      {item.label}
                    </Link>
                    {hasSub && (
                      <button
                        className="mobile-expand-btn-v3"
                        onClick={() => toggleExpand(item.label)}
                        aria-label="Expand submenu"
                        aria-expanded={isExpanded}
                      >
                        <span className={`expand-icon ${isExpanded ? "rot-180" : ""}`}>▼</span>
                      </button>
                    )}
                  </div>

                  {hasSub && isExpanded && (
                    <div className="mobile-submenu-v3">
                      {item.submenu?.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="mobile-submenu-link-v3"
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

          <div className="mobile-menu-footer-v3">
            <Link
              href={ctaHref}
              className="mobile-cta-btn-v3"
              onClick={() => setIsOpen(false)}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
