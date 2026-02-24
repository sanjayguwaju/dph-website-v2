"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, X, Search } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

interface MobileMenuProps {
  items: NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Hamburger trigger */}
      <button
        id="mobile-menu-btn"
        onClick={() => setIsOpen(true)}
        className="mobile-menu-trigger"
        aria-label="Open menu"
      >
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div className={`mobile-menu-drawer${isOpen ? " open" : ""}`}>
        <div className="mobile-menu-head">
          <span className="mobile-menu-title">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="mobile-menu-close"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav">
          <Link href="/" onClick={() => setIsOpen(false)} className="mobile-nav-link">
            Home
          </Link>
          {items.map((item) => {
            const hasSub = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedItems[item.label];

            return (
              <div key={item.label} className="mobile-nav-item">
                <div className="mobile-nav-link-row">
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="mobile-nav-link"
                  >
                    {item.label}
                  </Link>
                  {hasSub && (
                    <button
                      className="mobile-expand-btn"
                      onClick={() => toggleExpand(item.label)}
                      aria-label="Expand submenu"
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  )}
                </div>

                {hasSub && isExpanded && (
                  <div className="mobile-submenu">
                    {item.submenu?.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="mobile-submenu-link"
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

        <div className="mobile-menu-footer">
          <Link href="/search" className="mobile-search-link" onClick={() => setIsOpen(false)}>
            <Search size={18} /> Search
          </Link>
        </div>
      </div>
    </>
  );
}
