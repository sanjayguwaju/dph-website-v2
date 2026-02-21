import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug } from "@/lib/queries/pages";
import { RichText } from "@/components/RichText";
import { getLocale, getTranslations } from "next-intl/server";

import { PageLayout } from "@/components/layout/page-layout";
import { getPayloadClient } from "@/lib/payload";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  const tc = await getTranslations("common");

  if (!page) {
    return { title: tc("notFound") };
  }

  return {
    title: `${page.title} | ${tc("hospitalName")}`,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  const locale = await getLocale();
  const tc = await getTranslations("common");
  const tstaff = await getTranslations("staff");

  if (!page) {
    notFound();
  }

  let committeeMembers: any[] = [];
  if (slug === "committee") {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "staff",
      where: {
        role: { equals: "management-committee" },
        isActive: { equals: true },
      },
      sort: "order",
      locale: locale as any,
    });
    committeeMembers = res.docs;
  }

  let contactSettings: any = null;
  if (slug === "contact") {
    const payload = await getPayloadClient();
    contactSettings = await payload.findGlobal({
      slug: "site-settings",
      locale: locale as any,
    });
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: page.title as string },
      ]}
      maxWidth="max-w-5xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8 text-center bg-white rounded-3xl p-10 shadow-sm border border-gray-50">
        <h1 className="text-4xl font-extrabold text-[#003580] mb-4">
          {page.title}
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-[#2563eb] to-[#003580] mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-12">
        <article className="prose-editorial text-[#212529]">
          {(page as any).content ? (
            <RichText data={(page as any).content} />
          ) : (
            <p className="no-data-text">
              {tc("noData")}
            </p>
          )}
        </article>

        {slug === "contact" && contactSettings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "📞", label: locale === "ne" ? "फोन" : "Phone", value: contactSettings.contactPhone },
              { icon: "✉️", label: locale === "ne" ? "इमेल" : "Email", value: contactSettings.contactEmail },
              { icon: "🚨", label: locale === "ne" ? "आकस्मिक" : "Emergency", value: contactSettings.emergencyNumber },
            ].map((item, idx) => (
              <div key={idx} className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center text-center">
                <span className="text-3xl mb-3">{item.icon}</span>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {slug === "contact" && contactSettings?.mapEmbedUrl && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-[#003580] mb-6 flex items-center gap-2">
              📍 {locale === "ne" ? "हाम्रो स्थान" : "Our Location"}
            </h2>
            <div className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl h-[500px]">
              <iframe
                src={contactSettings.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
        )}
      </div>

      {slug === "committee" && committeeMembers.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-black border-l-4 border-[#2563eb] pl-4 mb-8">
            {tstaff("managementCommittee")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committeeMembers.map((member) => {
              const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
              const photoUrl = photo?.url || member.externalPhoto || null;
              return (
                <div key={member.id} className="committee-member-card bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 flex justify-center">
                    {photoUrl ? (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner">
                        <Image
                          src={photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
                        👤
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-[#2563eb] font-semibold text-sm mb-3">{member.designation}</p>
                  
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    {member.phone && (
                      <p className="flex items-center justify-center gap-1.5">
                        <span>📞</span> {member.phone}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
