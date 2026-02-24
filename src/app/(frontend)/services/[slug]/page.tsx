import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { RichText } from "@/components/RichText";
import { ServiceShareButtons } from "@/components/services/service-share-buttons";
import { PageLayout } from "@/components/layout/page-layout";
import { Clock, CircleDollarSign, ChevronLeft, LayoutGrid } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "services",
    where: {
      or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
    },
    limit: 1,
    depth: 0,
  });

  const service = result.docs[0];
  if (!service) return { title: "Not Found" };

  return {
    title: `${service.name} | Dhaulagiri Hospital`,
    description: (service.shortDescription as string) || undefined,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "services",
    where: {
      or: [{ slug: { equals: slug } }, { id: { equals: slug } }],
    },
    limit: 1,
    depth: 1,
  });

  const service = result.docs[0];
  if (!service) notFound();

  const siteUrl = "https://dph.gandaki.gov.np";
  const shareUrl = `${siteUrl}/services/${service.slug || service.id}`;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Services", href: "/services" },
        { label: service.name as string },
      ]}
      maxWidth="max-w-4xl"
    >
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[var(--brand-blue)] transition-colors mb-6 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Services
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-6 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 bg-[var(--brand-blue)]/5 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-sm border border-[var(--brand-blue)]/10">
            {service.icon || "🏥"}
          </div>
          <div className="flex-1">
            {service.category && (
              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 border border-green-100">
                {service.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#003580] leading-tight">
              {service.name as string}
            </h1>
            {service.shortDescription && (
              <p className="text-gray-500 mt-2 text-lg">
                {service.shortDescription as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100/50">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[var(--brand-blue)] shadow-sm">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time</p>
            <p className="text-gray-900 font-bold">{service.time ? (service.time as string) : "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-green-50/30 rounded-xl border border-green-100/50">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-green-600 shadow-sm">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fee</p>
            <p className="text-gray-900 font-bold">{service.fee ? (service.fee as string) : "Free"}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10 pb-8 border-b border-gray-50 flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
          <LayoutGrid size={16} />
          Department
        </div>
        <ServiceShareButtons title={service.name as string} shareUrl={shareUrl} />
      </div>

      {service.content && (
        <article className="prose-editorial max-w-none prose-img:rounded-xl prose-a:text-[var(--brand-blue)] mb-20">
          <RichText data={service.content as any} />
        </article>
      )}

      {/* Related Services */}
      {service.category && (
        <section className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-[#003580] mb-8">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(await payload.find({
              collection: "services",
              where: {
                and: [
                  { category: { equals: service.category } },
                  { id: { not_equals: service.id } },
                  { isActive: { equals: true } }
                ]
              },
              limit: 3,
              depth: 0,
            })).docs.map((item: any) => (
              <Link
                key={item.id}
                href={`/services/${item.slug || item.id}`}
                className="group p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-[var(--brand-blue)]/20 transition-all flex flex-col gap-3"
              >
                <span className="text-3xl">{item.icon || "🏥"}</span>
                <p className="font-bold text-gray-900 group-hover:text-[var(--brand-blue)] transition-colors">{item.name}</p>
                {item.shortDescription && (
                  <p className="text-xs text-gray-500 line-clamp-2">{item.shortDescription}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer hint */}
      <div className="mt-20 p-10 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 text-center shadow-sm">
        <p className="text-gray-500 font-medium mb-6">For more information, please contact our help desk.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--brand-blue)] text-white rounded-full text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-[#002a66] transition-all">
          Contact Us →
        </Link>
      </div>
    </PageLayout>
  );
}
