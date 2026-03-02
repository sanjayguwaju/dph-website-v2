import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";

import { getLocale } from "@/utils/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  return {
    title: locale === "ne" ? `सेवाहरू | ${hospitalName}` : `Services | ${hospitalName}`,
  };
}

import { PageLayout } from "@/components/layout/page-layout";

export default async function ServicesPage() {
  const locale = await getLocale();

  const CATEGORY_LABELS: Record<string, string> = {
    opd: locale === "ne" ? "ओपीडी" : "OPD",
    ipd: locale === "ne" ? "आईपीडी" : "IPD",
    emergency: locale === "ne" ? "आकस्मिक" : "Emergency",
    diagnostic: locale === "ne" ? "निदान" : "Diagnostic",
    "maternal-child": locale === "ne" ? "मातृ तथा बाल स्वास्थ्य" : "Maternal & Child",
    specialized: locale === "ne" ? "विशेषज्ञ सेवा" : "Specialized",
    support: locale === "ne" ? "सहायक सेवा" : "Support",
    other: locale === "ne" ? "अन्य" : "Other",
  };

  let services: any[] = [];
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "services",
      where: { isActive: { equals: true } },
      locale: locale as any,
      sort: "order",
      limit: 100,
      depth: 0,
    });
    services = result.docs;
  } catch (_) { }

  // Group by category
  const grouped: Record<string, typeof services> = {};
  for (const service of services) {
    const cat = (service.category as string) || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(service);
  }

  const labels = {
    services: locale === "ne" ? "सेवाहरू" : "Services",
    desc: locale === "ne" ? "हाम्रा अस्पताल सेवाहरू र विभागहरू" : "Our hospital services and departments",
    empty: locale === "ne" ? "कुनै डेटा उपलब्ध छैन" : "No data available",
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.services },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold text-[#003580] mb-2">🩺 {labels.services}</h1>
        <p className="text-gray-500 text-lg">{labels.desc}</p>
      </div>

      <div className="space-y-16">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="services-category-section">
            <h2 className="services-category-heading mb-8">{CATEGORY_LABELS[cat] || cat}</h2>
            <div className="services-page-grid">
              {items.map((service: any) => (
                <Link
                  key={service.id}
                  href={service.link || `/services/${service.slug || service.id}`}
                  className="service-page-card"
                >
                  <span className="service-icon">{service.icon || "🏥"}</span>
                  <div className="service-page-info">
                    <p className="service-page-name">{service.name}</p>
                    {service.shortDescription && (
                      <p className="service-page-desc line-clamp-2">{service.shortDescription}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {services.length === 0 && <p className="page-empty text-center py-20 text-gray-400 font-bold">{labels.empty}</p>}
    </PageLayout>
  );
}
