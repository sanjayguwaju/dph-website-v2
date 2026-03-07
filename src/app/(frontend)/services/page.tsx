import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import { getLocale } from "@/utils/locale-server";
import { PageLayout } from "@/components/layout/page-layout";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { getAllServices } from "@/lib/queries/services";
import { getLocalizedValue } from "@/lib/utils/localized";
import "./services.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "धौलागिरी प्रादेशिक अस्पताल" : "Dhaulagiri Provincial Hospital");

  return {
    title: locale === "ne" ? `हाम्रा सेवाहरु | ${hospitalName}` : `Our Services | ${hospitalName}`,
  };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const servicesFromCms = await getAllServices();

  // Static list mirroring explicitly the images provided by the user
  const MOCK_SERVICES = [
    { ne: "बहिरंग सेवा (OPD)", en: "OPD Service", icon: "Stethoscope" },
    { ne: "आकस्मिक सेवाहरू", en: "Emergency Services", icon: "Pill" },
    { ne: "अन्तरङ्ग सेवा", en: "Inpatient Service", icon: "Pill" },
    { ne: "प्रयोगशाला सेवा", en: "Laboratory Service", icon: "FlaskConical" },
    { ne: "एक्स-रे", en: "X-Ray", icon: "Pill" },
    { ne: "अल्ट्रासाउन्ड", en: "Ultrasound", icon: "Pill" },
    { ne: "पी.सी.आर ल्याव", en: "PCR Lab", icon: "Pill" },
    { ne: "ई.सी.जी. सेवा", en: "ECG Service", icon: "HeartPulse" },
    { ne: "सुरक्षित गर्भपतन सेवा", en: "Safe Abortion Service", icon: "Pill" },
    { ne: "प्रसुती सेवा", en: "Maternity Service", icon: "Pill" },
    { ne: "पोस्टमार्टम सेवा", en: "Postmortem Service", icon: "Pill" },
    { ne: "सुरक्षित मातृत्व सेवा", en: "Safe Motherhood Service", icon: "PersonStanding" },
    { ne: "नवजात शिशु सुरक्षा सेवा", en: "Newborn Care Service", icon: "Accessibility" },
    { ne: "दन्त सेवा", en: "Dental Service", icon: "Pill" },
    { ne: "ए.आर.टी. (ART) सेवा", en: "A.R.T. Service", icon: "Pill" },
    { ne: "खोप सेवाहरू", en: "Vaccination Services", icon: "HeartPulse" },
    { ne: "DOTs/Dots+ क्षयरोग सम्बन्धी सेवा", en: "DOTs/Dots+ Tuberculosis Service", icon: "Pill" },
    { ne: "कुष्ठरोग", en: "Leprosy Service", icon: "Pill" },
    { ne: "मिनिल्याब/भ्यासेक्टोमी सेवा", en: "Minilab/Vasectomy Service", icon: "Pill" },
    { ne: "स्वास्थ्य शिक्षा", en: "Health Education", icon: "GraduationCap" },
    { ne: "एकद्वार संकट व्यवस्थापन केन्द्र (OCMC) सम्बन्धी सेवा", en: "OCMC Service", icon: "Pill" },
    { ne: "फिजियोथेरापी सेवा", en: "Physiotherapy Service", icon: "Accessibility" },
    { ne: "स्वास्थ्य विमा", en: "Health Insurance", icon: "IdCard" },
    { ne: "फार्मेसी", en: "Pharmacy", icon: "Pill" },
    { ne: "शल्यक्रिया", en: "Surgery Option", icon: "Pill" },
    { ne: "पोषण", en: "Nutrition", icon: "Pill" },
    { ne: "आइ.सि.यू (ICU/HDU)", en: "ICU/HDU", icon: "Pill" },
    { ne: "निशुल्क औषधी", en: "Free Medicine", icon: "Pill" },
    { ne: "विस्तारित स्वास्थ्य सेवा (EHS)", en: "Extended Health Service (EHS)", icon: "Pill" },
    { ne: "परिवार नियोजन सेवा", en: "Family Planning Service", icon: "Pill" },
    { ne: "सिटी स्क्यान सेवा", en: "CT Scan Service", icon: "Pill" },
    { ne: "इन्डोस्कोपी सेवा", en: "Endoscopy Service", icon: "Pill" }
  ];

  const labels = {
    title: locale === "ne" ? "हाम्रा सेवाहरु" : "Our Services",
  };

  const displayServices = servicesFromCms.length > 0
    ? servicesFromCms.map((s: any) => ({
      name: getLocalizedValue(s.name),
      id: s.id,
      slug: s.slug || s.id,
      icon: s.icon || "Stethoscope",
      link: s.link
    }))
    : MOCK_SERVICES.map((s, idx) => ({
      name: locale === "ne" ? s.ne : s.en,
      id: `mock-${idx}`,
      slug: `mock-${idx}`,
      icon: s.icon,
      link: null
    }));

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.title },
      ]}
      maxWidth="max-w-[1400px]"
    >
      <div className="services-page-wrapper">
        <h1 className="services-page-title">{labels.title}</h1>
        <div className="services-section-grid">
          {displayServices.map((service: any) => {
            const iconName = service.icon || "Stethoscope";
            const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Stethoscope;

            return (
              <Link
                href={service.link || `/services/${service.slug}`}
                key={service.id}
                className="services-card"
              >
                <IconComponent className="services-card-icon" strokeWidth={2} />
                <span>{service.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
