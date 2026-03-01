import { memo } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getLocalizedValue } from "@/lib/utils/localized";

type Service = {
  id: string;
  name: string;
  icon?: string | null;
  link?: string | null;
  category?: string | null;
  slug?: string | null;
};

export const ServicesGrid = memo(function ServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section className="services-section-v3">
      <div className="container-refined">
        <div className="services-header-v3">
          <div className="line-deco"></div>
          <h2>हाम्रा सेवाहरु</h2>
          <div className="line-deco"></div>
        </div>

        <div className="services-grid-wrapper">
          {services.map((service, i) => (
            <ScrollReveal
              key={service.id}
              delay={i * 30}
              animation="animate-in fade-in zoom-in"
              duration={400}
            >
              <Link
                href={service.link || `/services/${service.slug || service.id}`}
                className="service-card-v3"
              >
                <div className="service-icon-v3">
                  {/* Attempt to parse generic icon names into real SVGs or just show the string if emoji */}
                  {service.icon?.startsWith("<svg") ? (
                    <div dangerouslySetInnerHTML={{ __html: service.icon }} />
                  ) : (
                    <span className="text-3xl">{service.icon || "💊"}</span>
                  )}
                </div>
                <h3 className="service-name-v3">{getLocalizedValue(service.name)}</h3>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
});
