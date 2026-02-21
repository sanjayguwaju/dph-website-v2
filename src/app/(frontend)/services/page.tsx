import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services");
  const tc = await getTranslations("common");
  return {
    title: `${t("title")} | ${tc("hospitalName")}`,
  };
}

import { PageLayout } from "@/components/layout/page-layout";

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = await getTranslations("services");
  const tc = await getTranslations("common");

  const CATEGORY_LABELS: Record<string, string> = {
    opd: t("opd"),
    ipd: t("ipd"),
    emergency: t("emergency"),
    diagnostic: t("diagnostic"),
    "maternal-child": t("maternalChild"),
    specialized: t("specialized"),
    support: t("support"),
    other: t("other"),
  };

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 100,
    depth: 0,
    locale: locale as any,
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
    <PageLayout
      breadcrumbs={[
        { label: t("title") },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold text-[#003580] mb-2">🩺 {t("title")}</h1>
        <p className="text-gray-500 text-lg">{t("subtitle")}</p>
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

      {services.length === 0 && <p className="page-empty text-center py-20 text-gray-400">{tc("noData")}</p>}
    </PageLayout>
  );
}
