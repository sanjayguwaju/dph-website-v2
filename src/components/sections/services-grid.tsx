import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getTranslations } from "next-intl/server";

type Service = {
  id: string;
  name: string;
  icon?: string | null;
  link?: string | null;
  category?: string | null;
  slug?: string | null;
};

export async function ServicesGrid({ services }: { services: Service[] }) {
  const t = await getTranslations("home");
  if (services.length === 0) return null;

  return (
    <section className="services-section-v2">
      <div className="services-grid-header-v2">
        <div className="header-line-v2"></div>
        <h2 className="services-title-v2">{t("services")}</h2>
        <div className="header-line-v2"></div>
      </div>
      
      <div className="services-grid-v2">
        {services.map((service, i) => (
          <ScrollReveal 
             key={service.id} 
             delay={i * 50} 
             animation="animate-in fade-in slide-in-from-bottom-5" 
             duration={400}
           >
            <Link 
              href={service.link || `/services/${service.slug || service.id}`} 
              className="service-v2-card-white"
            >
              <span className="service-v2-icon-green">{service.icon || "🏥"}</span>
              <span className="service-v2-name-green">{service.name}</span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
