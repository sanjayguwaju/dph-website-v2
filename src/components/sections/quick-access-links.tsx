import Link from "next/link";
import { getLocalizedValue } from "@/lib/utils/localized";
import { ArrowUpRight } from "lucide-react";

type QuickLink = {
  id: string;
  label: string;
  icon?: string | null;
  url: string;
  openInNewTab?: boolean | null;
};

export function QuickAccessLinks({ links }: { links: QuickLink[] }) {
  if (links.length === 0) return null;

  return (
    <section className="quick-links-section-v3">
      <div className="container-refined">
        <div className="quick-links-grid-v3">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              target={link.openInNewTab ? "_blank" : undefined}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
              className="quick-link-card-v3 group"
            >
              <div className="quick-link-icon-v3-wrap">
                <span className="quick-link-emoji-v3">{link.icon || "🔗"}</span>
                <div className="quick-link-icon-bg-v3"></div>
              </div>

              <div className="quick-link-content-v3">
                <h4 className="quick-link-label-v3">{getLocalizedValue(link.label)}</h4>
                <div className="quick-link-arrow-v3">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
