import Link from "next/link";

type Service = {
  id: string;
  name: string;
  icon?: string | null;
  link?: string | null;
  category?: string | null;
};

export function ServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="services-section">
      <div className="section-header">
        <h2 className="section-heading">🩺 हाम्रा सेवाहरू</h2>
        <Link href="/services" className="section-view-all">
          सबै सेवाहरू →
        </Link>
      </div>
      <div className="services-grid">
        {services.map((service) => (
          <Link key={service.id} href={service.link || "/services"} className="service-card">
            <span className="service-icon">{service.icon || "🏥"}</span>
            <span className="service-name">{service.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
