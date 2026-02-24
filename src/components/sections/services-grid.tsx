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
    <section className="container-refined my-12">
      <div className="section-header-v2">
        <h2 className="section-heading-v2">{t("services")}</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {services.map((service, i) => (
          <ScrollReveal 
             key={service.id} 
             delay={i * 50} 
             animation="animate-in fade-in" 
             duration={400}
           >
            <Link 
              href={service.link || `/services/${service.slug || service.id}`} 
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-300 group"
            >
              <span className="text-2xl text-blue-600 bg-blue-50 p-2 rounded flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">{service.icon || "🏥"}</span>
              <span className="text-sm font-bold text-gray-800 leading-tight">{service.name}</span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
