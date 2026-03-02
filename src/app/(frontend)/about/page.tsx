import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";

import { getLocale } from "@/utils/locale-server";
import { toNepaliNum } from "@/utils/nepali-date";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  return {
    title: locale === "ne" ? `हाम्रो बारेमा | ${hospitalName}` : `About Us | ${hospitalName}`,
  };
}

import { PageLayout } from "@/components/layout/page-layout";
import { getPageBySlug } from "@/lib/queries/pages";
import { RichText } from "@/components/RichText";

export default async function AboutPage() {
  const [settings, aboutPage, locale] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("about"),
    getLocale(),
  ]);

  const s = settings as any;
  const ap = aboutPage as any;

  const hospitalName = s.hospitalName;
  const tagline = s.tagline;

  const labels = {
    about: locale === "ne" ? "हाम्रो बारेमा" : "About Us",
    intro: locale === "ne" ? "परिचय" : "Introduction",
    contact: locale === "ne" ? "सम्पर्क जानकारी" : "Contact Information",
    address: locale === "ne" ? "ठेगाना" : "Address",
    phone: locale === "ne" ? "फोन" : "Phone",
    emergency: locale === "ne" ? "आकस्मिक" : "Emergency",
    email: locale === "ne" ? "इमेल" : "Email",
    location: locale === "ne" ? "हाम्रो स्थान" : "Location",
    servicesViewAll: locale === "ne" ? "सबै सेवाहरू हेर्नुहोस्" : "Services View All",
    staffViewAll: locale === "ne" ? "सबै कर्मचारीहरू हेर्नुहोस्" : "Staff View All",
    noticesViewAll: locale === "ne" ? "सबै सूचनाहरू हेर्नुहोस्" : "Notices View All",
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.about },
      ]}
      maxWidth="max-w-4xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-4xl font-bold text-[#003580] mb-3 flex items-center gap-3">
          🏛️ {labels.about}
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          {hospitalName} — {tagline || ""}
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-black border-l-4 border-[#2563eb] pl-4 mb-6">{labels.intro}</h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-4 prose-editorial">
            {ap?.content ? (
              <RichText data={ap.content} />
            ) : (
              s.aboutUs || ""
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black border-l-4 border-[#2563eb] pl-4 mb-8">{labels.contact}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {s.address && (
              <div className="p-6 bg-gray-50 rounded-xl flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{labels.address}</p>
                  <p className="text-gray-900 font-semibold">{s.address}</p>
                </div>
              </div>
            )}
            {s.contactPhone && (
              <div className="p-6 bg-gray-50 rounded-xl flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{labels.phone}</p>
                  <a href={`tel:${s.contactPhone}`} className="text-[#2563eb] font-bold hover:underline">
                    {locale === "ne" ? toNepaliNum(s.contactPhone) : s.contactPhone}
                  </a>
                </div>
              </div>
            )}
            {s.emergencyNumber && (
              <div className="p-6 bg-red-50 rounded-xl flex items-start gap-4 border border-red-100">
                <span className="text-2xl">🚨</span>
                <div>
                  <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">{labels.emergency}</p>
                  <a
                    href={`tel:${s.emergencyNumber}`}
                    className="text-red-600 font-bold text-xl hover:underline"
                  >
                    {locale === "ne" ? toNepaliNum(s.emergencyNumber) : s.emergencyNumber}
                  </a>
                </div>
              </div>
            )}
            {s.contactEmail && (
              <div className="p-6 bg-gray-50 rounded-xl flex items-start gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{labels.email}</p>
                  <a href={`mailto:${s.contactEmail}`} className="text-[#2563eb] font-bold hover:underline">
                    {s.contactEmail}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {s.mapEmbedUrl && (
          <section>
            <h2 className="text-2xl font-bold text-black border-l-4 border-[#2563eb] pl-4 mb-8">{labels.location}</h2>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <iframe
                src={s.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={labels.location}
              />
            </div>
          </section>
        )}

        <div className="pt-12 border-t border-gray-100 flex flex-wrap gap-4 justify-center text-center">
          <Link href="/services" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
            {labels.servicesViewAll}
          </Link>
          <Link href="/staff" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-green-400 hover:text-green-600 transition-all shadow-sm">
            {labels.staffViewAll}
          </Link>
          <Link href="/notices" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-red-400 hover:text-red-600 transition-all shadow-sm">
            {labels.noticesViewAll}
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
