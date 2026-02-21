import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  const tc = await getTranslations("common");
  return {
    title: `${t("title")} | ${tc("hospitalName")}`,
  };
}

import { PageLayout } from "@/components/layout/page-layout";
import { getPageBySlug } from "@/lib/queries/pages";
import { RichText } from "@/components/RichText";

export default async function AboutPage() {
  const [settings, aboutPage] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("about"),
  ]);
  
  const s = settings as any;
  const ap = aboutPage as any;
  const locale = await getLocale();
  const t = await getTranslations("about");
  const tf = await getTranslations("footer");
  const tnav = await getTranslations("nav");
  const tc = await getTranslations("common");

  const hospitalName = locale === "en" ? s.hospitalNameEn : s.hospitalNameNe;
  const tagline = locale === "en" ? s.taglineEn : s.taglineNe;

  return (
    <PageLayout
      breadcrumbs={[
        { label: t("title") },
      ]}
      maxWidth="max-w-4xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-4xl font-bold text-[#003580] mb-3 flex items-center gap-3">
          🏛️ {t("title")}
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          {hospitalName || tc("hospitalName")} — {tagline || ""}
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-black border-l-4 border-[#2563eb] pl-4 mb-6">{t("intro")}</h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-4 prose-editorial">
            {ap?.content ? (
              <RichText data={ap.content} />
            ) : (
              s.aboutUs || ""
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black border-l-4 border-[#2563eb] pl-4 mb-8">{t("contactInfo")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {s.address && (
              <div className="p-6 bg-gray-50 rounded-xl flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{tf("address")}</p>
                  <p className="text-gray-900 font-semibold">{s.address}</p>
                </div>
              </div>
            )}
            {s.contactPhone && (
              <div className="p-6 bg-gray-50 rounded-xl flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{tf("phone")}</p>
                  <a href={`tel:${s.contactPhone}`} className="text-[#2563eb] font-bold hover:underline">
                    {s.contactPhone}
                  </a>
                </div>
              </div>
            )}
            {s.emergencyNumber && (
              <div className="p-6 bg-red-50 rounded-xl flex items-start gap-4 border border-red-100">
                <span className="text-2xl">🚨</span>
                <div>
                  <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">{tf("emergency")}</p>
                  <a
                    href={`tel:${s.emergencyNumber}`}
                    className="text-red-600 font-bold text-xl hover:underline"
                  >
                    {s.emergencyNumber}
                  </a>
                </div>
              </div>
            )}
            {s.contactEmail && (
              <div className="p-6 bg-gray-50 rounded-xl flex items-start gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{tf("email")}</p>
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
            <h2 className="text-2xl font-bold text-black border-l-4 border-[#2563eb] pl-4 mb-8">{t("location")}</h2>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <iframe
                src={s.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("location")}
              />
            </div>
          </section>
        )}

        <div className="pt-12 border-t border-gray-100 flex flex-wrap gap-4 justify-center">
          <Link href="/services" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
            {tnav("services")} {tc("viewAll")}
          </Link>
          <Link href="/staff" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-green-400 hover:text-green-600 transition-all shadow-sm">
            {tnav("staff")} {tc("viewAll")}
          </Link>
          <Link href="/notices" className="px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-red-400 hover:text-red-600 transition-all shadow-sm">
            {tnav("notices")} {tc("viewAll")}
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
