import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import Link from "next/link";

export const metadata: Metadata = {
  title: "हाम्रा सेवाहरू | Our Services",
  description: "अस्पतालले प्रदान गर्ने सबै स्वास्थ्य सेवाहरूको विवरण",
};

const CATEGORY_LABELS: Record<string, string> = {
  opd: "बाह्य रोगी",
  ipd: "भर्ना",
  emergency: "आपतकालीन",
  diagnostic: "निदान सेवा",
  "maternal-child": "मातृ तथा शिशु",
  specialized: "विशेष सेवा",
  support: "सहयोगी सेवा",
};

export default async function ServicesPage() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 100,
    depth: 0,
  });

  const services = result.docs;

  // Group by category
  const grouped: Record<string, typeof services> = {};
  for (const service of services) {
    const cat = (service.category as string) || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(service);
  }

  return (
    <main className="page-container">
      <div className="page-hero">
        <h1 className="page-hero-title">🩺 हाम्रा सेवाहरू</h1>
        <p className="page-hero-sub">अस्पतालले प्रदान गर्ने सम्पूर्ण स्वास्थ्य सेवाहरू</p>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} className="services-category-section">
          <h2 className="services-category-heading">{CATEGORY_LABELS[cat] || cat}</h2>
          <div className="services-page-grid">
            {items.map((service: any) => (
              <Link key={service.id} href={service.link || "#"} className="service-page-card">
                <span className="service-icon">{service.icon || "🏥"}</span>
                <div className="service-page-info">
                  <p className="service-page-name">{service.name}</p>
                  {service.shortDescription && (
                    <p className="service-page-desc">{service.shortDescription}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {services.length === 0 && <p className="page-empty">कुनै सेवा उपलब्ध छैन।</p>}
    </main>
  );
}
