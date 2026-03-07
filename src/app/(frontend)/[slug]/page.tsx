import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/queries/pages";
import { getSiteSettings } from "@/lib/queries/globals";
import { RichText } from "@/components/RichText";
import { FeedbackForm } from "@/components/forms/feedback-form";

import { PageLayout } from "@/components/layout/page-layout";
import { getPayloadClient } from "@/lib/payload";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { getLocale } from "@/utils/locale-server";
import { toNepaliNum } from "@/utils/nepali-date";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug(slug),
  ]);

  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  if (!page) return { title: "Not Found" };

  return {
    title: `${page.title} | ${hospitalName}`,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }


  let contactSettings: any = null;

  if (slug === "contact") {
    try {
      const payload = await getPayloadClient();
      contactSettings = await payload.findGlobal({
        slug: "site-settings",
        locale: locale as any,
      });
    } catch (_) { }
  }

  const labels = {
    noContent: locale === "ne" ? "कुनै सामग्री उपलब्ध छैन" : "No content available",
    phone: locale === "ne" ? "फोन" : "Phone",
    email: locale === "ne" ? "इमेल" : "Email",
    emergency: locale === "ne" ? "आकस्मिक" : "Emergency",
    getInTouch: locale === "ne" ? "हामीसँग सम्पर्क गर्नुहोस्" : "Get In Touch",
    feedbackDesc: locale === "ne"
      ? "के तपाईंसँग कुनै प्रश्न वा सुझाव छ? हामीलाई सन्देश पठाउनुहोस् र हामी तपाईंलाई छिट्टै सम्पर्क गर्नेछौं।"
      : "Have a question or suggestion? Send us a message and we'll get back to you.",
    location: locale === "ne" ? "हाम्रो स्थान" : "Our Location",
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: page.title as string },
      ]}
      maxWidth="max-w-5xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8 text-center bg-white rounded-3xl p-10 shadow-sm border">
        <h1 className="text-4xl font-extrabold text-[#003580] mb-4">
          {page.title}
        </h1>
        <div className="w-20 h-1.5 bg-linear-to-r from-[#2563eb] to-[#003580] mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <article className="prose-editorial text-[#212529]">
          {(page as any).content ? (
            <RichText data={(page as any).content} />
          ) : (
            <p className="no-data-text font-bold">
              {labels.noContent}
            </p>
          )}
        </article>

        {slug === "contact" && contactSettings && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: "📞", label: labels.phone, value: locale === "ne" ? toNepaliNum(contactSettings.contactPhone) : contactSettings.contactPhone },
                { icon: "✉️", label: labels.email, value: contactSettings.contactEmail },
                { icon: "🚨", label: labels.emergency, value: locale === "ne" ? toNepaliNum(contactSettings.emergencyNumber) : contactSettings.emergencyNumber },
              ].map((item, idx) => (
                <div key={idx} className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center text-center">
                  <span className="text-3xl mb-3">{item.icon}</span>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>

            <section className="mt-12 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-black text-[#003580] mb-4">
                    {labels.getInTouch}
                  </h2>
                  <p className="text-slate-600 font-bold mb-6">
                    {labels.feedbackDesc}
                  </p>
                </div>
                <FeedbackForm />
              </div>
            </section>
          </>
        )}

        {slug === "contact" && contactSettings?.mapEmbedUrl && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-[#003580] mb-6 flex items-center gap-2">
              📍 {labels.location}
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
                title={labels.location}
              ></iframe>
            </div>
          </section>
        )}
      </div>

    </PageLayout>
  );
}
