import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import { getLocale } from "@/utils/locale-server";
import { PageLayout } from "@/components/layout/page-layout";
import { getSections } from "@/lib/queries/sections";
import Link from "next/link";
import { getLocalizedValue } from "@/lib/utils/localized";
import "./section.css";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const locale = await getLocale();
    const s = settings as any;
    const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

    return {
        title: locale === "ne" ? `शाखाहरु | ${hospitalName}` : `Sections/Branches | ${hospitalName}`,
    };
}

export default async function SectionPage() {
    const locale = await getLocale();
    const sectionsFromCms = await getSections();

    // Static list based on provided reference images — used as fallback
    const MOCK_SECTIONS = [
        { ne: "पोषण", en: "Nutrition" },
        { ne: "अन्तरंग विभाग", en: "Inpatient Department" },
        { ne: "फिजियोथेरापी", en: "Physiotherapy" },
        { ne: "एक्सरे", en: "X-Ray" },
        { ne: "बच्चा वार्ड", en: "Pediatric Ward" },
        { ne: "मातृ तथा शिशु मृत्यु पुनरावलोकन कार्यक्रम", en: "Maternal and Perinatal Death Surveillance and Response program (MPDSR)" },
        { ne: "एक द्वार संकट व्यवस्थापन सेवा", en: "One Stop Crisis Management Center (OCMC)" },
        { ne: "पिसिआर ल्याव शाखा", en: "PCR Lab Branch" },
        { ne: "ए. आर. टी. शाखा", en: "A.R.T. Branch" },
        { ne: "हेमोडायलायसिस शाखा", en: "Hemodialysis Branch" },
        { ne: "रेडियोलोजी शाखा", en: "Radiology Branch" },
        { ne: "फार्मेसी शाखा", en: "Pharmacy Branch" },
        { ne: "अप्रेशन शाखा", en: "Operation Branch" },
        { ne: "निःशुल्क औषधि शाखा.", en: "Free Medicine Branch" },
        { ne: "प्राविधिक शाखा", en: "Technical Branch" },
        { ne: "प्रशासन शाखा", en: "Administration Branch" },
        { ne: "जिन्सि शाखा", en: "Store Branch" },
        { ne: "लेखा शाखा", en: "Account Branch" },
        { ne: "इमर्जेन्सी शाखा", en: "Emergency Branch" },
        { ne: "काउन्टर (दर्ता) शाखा", en: "Counter (Registration) Branch" },
        { ne: "ICU / Isolation शाखा", en: "ICU / Isolation Branch" },
        { ne: "प्रसुति शाखा / सुरक्षित गर्भपतन", en: "Maternity Branch / Safe Abortion" },
        { ne: "सामाजिक सेवा इकाई शाखा", en: "Social Service Unit Branch" },
        { ne: "ल्याव", en: "Lab" }
    ];

    const labels = {
        title: locale === "ne" ? "शाखाहरु" : "Sections/Branches",
    };

    const displaySections = sectionsFromCms.length > 0
        ? sectionsFromCms.map((s: any) => ({
            name: getLocalizedValue(s.name),
            id: s.id,
            slug: s.slug || s.id
        }))
        : MOCK_SECTIONS.map((s, idx) => ({
            name: locale === "ne" ? s.ne : s.en,
            id: `mock-${idx}`,
            slug: `mock-${idx}`
        }));

    return (
        <PageLayout
            breadcrumbs={[
                { label: labels.title },
            ]}
            maxWidth="max-w-7xl"
        >
            <div className="section-page-wrapper">
                <h1 className="section-page-title">{labels.title}</h1>
                <div className="section-grid">
                    {displaySections.map((section: any) => (
                        <Link
                            href={`/section/${section.slug}`}
                            key={section.id}
                            className="section-card"
                        >
                            {section.name}
                        </Link>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
