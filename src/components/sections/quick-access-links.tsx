import Link from "next/link";

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
    <section className="quick-links-section">
      <div className="quick-links-grid">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target={link.openInNewTab ? "_blank" : undefined}
            rel={link.openInNewTab ? "noopener noreferrer" : undefined}
            className="quick-link-card"
          >
            <span className="quick-link-icon">{link.icon || "🔗"}</span>
            <span className="quick-link-label">{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
