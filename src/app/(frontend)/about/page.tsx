import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";
import { Facebook, Twitter, Mail, Eye } from "lucide-react";

import { getLocale } from "@/utils/locale-server";
import { toNepaliNum } from "@/utils/nepali-date";
import "./about.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "धौलागिरी प्रादेशिक अस्पताल" : "Dhaulagiri Provincial Hospital");

  return {
    title: locale === "ne" ? `हाम्रो बारेमा | ${hospitalName}` : `About Us | ${hospitalName}`,
  };
}

import { PageLayout } from "@/components/layout/page-layout";
import { getPageBySlug } from "@/lib/queries/pages";
import { RichText } from "@/components/RichText";
import { getTimeline } from "@/lib/queries/timeline";
import { getLocalizedValue } from "@/lib/utils/localized";

export default async function AboutPage() {
  const [settings, aboutPage, timelineDocs, locale] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("about"),
    getTimeline(),
    getLocale(),
  ]);

  const s = settings as any;
  const ap = aboutPage as any;

  const labels = {
    about: locale === "ne" ? "हाम्रो बारेमा" : "About Us",
    intro: locale === "ne" ? "परिचय" : "Introduction",
    history: locale === "ne" ? "अस्पतालको ऐतिहासिक पृष्ठभूमि" : "Historical Background",
    share: locale === "ne" ? "शेयर गर्नुहोस्" : "Share",
  };

  // Static list fallback if CMS is empty
  const FALLBACK_TIMELINE = [
    { year: "2015", desc: locale === "ne" ? "सालमा डिस्पेन्सरीको रूपमा स्थापना भई संचालन भएको ।" : "Established as a dispensary and started operations." },
    { year: "2016", desc: locale === "ne" ? "सालमा स्वास्थ्य केन्द्रमा स्तरोन्नति ।" : "Upgraded to a Health Center." },
    { year: "2033", desc: locale === "ne" ? "सालबाट जिल्ला अस्पतालमा स्तरोन्नति ।" : "Upgraded to a District Hospital." },
    { year: "2045", desc: locale === "ne" ? "साल देखि जिल्ला अस्पतालमा सहयोग समिति गठन गर्ने सरकारी अवधारणा अनुसार प्रमुख जिल्ला अधिकारीको संयोजकत्वमा सहयोग समिति गठन भएको ।" : "Formation of Support Committee under the chairmanship of CDO." },
    { year: "2056", desc: locale === "ne" ? "साल देखि जिल्ला अस्पताल विकास समिति गठन गर्ने कानुनी व्यवस्था भएको ।" : "Legal provision for forming the District Hospital Development Committee." },
    { year: "2067", desc: locale === "ne" ? "साल कार्तिक देखि अञ्चल अस्पतालमा स्तरोन्नति ।" : "Upgraded to Zonal Hospital in Kartik 2067." },
    { year: "2074", desc: locale === "ne" ? "मा २०० शैयामा स्तरोन्नति गर्न स्वास्थ्य तथा जनसख्या मन्त्रालयबाट प्रस्ताव ।" : "Proposal for upgrading to 200 beds from the Ministry of Health." },
  ];

  const timelineItems = timelineDocs.length > 0
    ? timelineDocs.map((item: any) => ({
      year: item.year,
      desc: getLocalizedValue(item.description)
    }))
    : FALLBACK_TIMELINE;

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.about },
      ]}
      maxWidth="max-w-5xl"
    >
      <div className="about-page-wrapper">
        <header className="about-header">
          <h1 className="about-title">
            {labels.about}
          </h1>
        </header>

        <section className="about-content">
          {ap?.content ? (
            <RichText data={ap.content} />
          ) : (
            <div className="prose-editorial">
              <p>{s.aboutUs || ""}</p>
            </div>
          )}
        </section>

        <section className="about-history-section">
          <h2 className="about-history-title">{labels.history}</h2>
          <ul className="timeline-list">
            {timelineItems.map((item, idx) => (
              <li key={idx} className="timeline-item">
                <span className="timeline-year">{locale === "ne" ? toNepaliNum(item.year) : item.year}</span>
                <span className="timeline-desc">{item.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="share-section">
          <a href="#" className="share-btn facebook">
            <Facebook size={18} /> share
          </a>
          <a href="#" className="share-btn twitter">
            <Twitter size={18} /> Tweet
          </a>
          <a href="#" className="share-btn google">
            <Mail size={18} /> email
          </a>
        </div>

        <div className="view-count-wrap">
          <Eye size={20} />
          <span>{locale === "ne" ? toNepaliNum(619) : 619}</span>
        </div>
      </div>
    </PageLayout>
  );
}
