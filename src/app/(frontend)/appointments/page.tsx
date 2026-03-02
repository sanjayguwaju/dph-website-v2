import { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

import { getLocale } from "@/utils/locale-server";
import { getSiteSettings } from "@/lib/queries/globals";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");

  return {
    title: locale === "ne" ? `अनलाइन टिकट / नियुक्ति | ${hospitalName}` : `Online Appointment | ${hospitalName}`,
  };
}

export default async function AppointmentsPage() {
  const locale = await getLocale();

  const labels = {
    title: locale === "ne" ? "अनलाइन टिकट / नियुक्ति" : "Online Appointment",
    important: locale === "ne" ? "महत्त्वपूर्ण जानकारी" : "Important Information",
    notes: locale === "ne" ? [
      "अनलाइन अनुरोध गरिएका नियुक्तिहरू अस्पतालका कर्मचारीहरूद्वारा पुष्टि गरिनेछ।",
      "आकस्मिक सेवाहरूको लागि, कृपया तुरुन्तै आकस्मिक विभागमा जानुहोस् वा आकस्मिक नम्बरमा कल गर्नुहोस्।",
      "कृपया आफ्नो परिचय पत्र र अघिल्लो स्वास्थ्य रेकर्डहरू साथमा ल्याउनुहोस्।",
      "तपाईंको नियुक्तिको समय तय गर्न हाम्रा कर्मचारीहरूले तपाईंलाई फोन वा इमेल मार्फत सम्पर्क गर्नेछन्।"
    ] : [
      "Appointments requested online are subject to confirmation by hospital staff.",
      "For emergency services, please visit the emergency department immediately or call the emergency number.",
      "Please bring your identification and any previous medical records during your visit.",
      "Our staff will contact you via phone or email to finalize your appointment time."
    ]
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.title },
      ]}
      maxWidth="max-w-4xl"
    >
      <ScrollReveal animation="animate-in fade-in slide-in-from-bottom-10">
        <div className="py-12">
          <AppointmentForm />
        </div>
      </ScrollReveal>

      <section className="mt-12 bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
        <h3 className="text-xl font-black text-[#003580] mb-4">
          {labels.important}
        </h3>
        <ul className="space-y-3 text-slate-600 font-bold text-sm list-disc pl-5">
          {labels.notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
