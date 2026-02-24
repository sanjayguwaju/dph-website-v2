import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/layout/page-layout";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    title: t("onlineAppointment") || "Online Appointment",
  };
}

export default async function AppointmentsPage() {
  const t = await getTranslations("home");

  return (
    <PageLayout
      breadcrumbs={[
        { label: t("onlineAppointment") || "Online Appointment" },
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
          Important Information
        </h3>
        <ul className="space-y-3 text-slate-600 font-bold text-sm list-disc pl-5">
          <li>Appointments requested online are subject to confirmation by hospital staff.</li>
          <li>For emergency services, please visit the emergency department immediately or call the emergency number.</li>
          <li>Please bring your identification and any previous medical records during your visit.</li>
          <li>Our staff will contact you via phone or email to finalize your appointment time.</li>
        </ul>
      </section>
    </PageLayout>
  );
}
