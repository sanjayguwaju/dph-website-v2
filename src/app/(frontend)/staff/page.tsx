import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import Image from "next/image";
import { getLocalizedValue } from "@/lib/utils/localized";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Staff | Dhaulagiri Hospital",
  };
}

import { PageLayout } from "@/components/layout/page-layout";

export default async function StaffPage() {
  const ROLE_LABELS: Record<string, string> = {
    chair: "Chairperson",
    cms: "Chief Medical Superintendent",
    "info-officer": "Information Officer",
    doctor: "Doctor",
    nurse: "Nurse",
    administrative: "Administrative",
    other: "Other",
  };

  const ROLE_ORDER = ["chair", "cms", "info-officer", "doctor", "nurse", "administrative", "other"];

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "staff",
    where: { isActive: { equals: true } },
    sort: "order",
    limit: 100,
    depth: 1,
  });

  const staff = result.docs;

  // Group by role
  const grouped: Record<string, typeof staff> = {};
  for (const member of staff) {
    const role = (member.role as string) || "other";
    if (!grouped[role]) grouped[role] = [];
    grouped[role].push(member);
  }

  const orderedGroups = ROLE_ORDER.filter((r) => grouped[r]?.length > 0);

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Staff" },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold text-[#003580] mb-2">👨‍⚕️ Staff</h1>
        <p className="text-gray-500 text-lg">Our dedicated healthcare professionals</p>
      </div>

      <div className="space-y-20">
        {orderedGroups.map((role) => (
          <section key={role} className="staff-page-section">
            <h2 className="text-2xl font-bold text-[#003580] mb-10 flex items-center gap-3 border-b-2 border-blue-50 pb-4">
              <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                {role === "doctor" ? "🩺" : role === "nurse" ? "👩‍⚕️" : "👤"}
              </span>
              {ROLE_LABELS[role] || role}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {grouped[role].map((member: any) => {
                const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
                const photoUrl = photo?.url || member.externalPhoto || null;
                return (
                  <div key={member.id} className="group relative bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#2563eb] to-[#003580] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        {photoUrl ? (
                          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                              src={photoUrl}
                              alt={member.nameEn || member.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="relative w-28 h-28 rounded-full bg-gray-50 flex items-center justify-center text-4xl shadow-inner border-4 border-white">👤</div>
                        )}
                      </div>

                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#2563eb] transition-colors">{getLocalizedValue(member.name)}</h3>
                        {member.nameEn && <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{getLocalizedValue(member.nameEn)}</p>}
                        <p className="mt-3 inline-block px-3 py-1 bg-blue-50 text-[#2563eb] text-[11px] font-bold rounded-full uppercase tracking-wider">{getLocalizedValue(member.designation)}</p>
                        {member.department && <p className="text-gray-500 text-sm mt-2 font-medium italic">" {getLocalizedValue(member.department)} "</p>}
                      </div>

                      <div className="w-full pt-6 border-t border-gray-50 flex flex-col gap-3">
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#2563eb] transition-colors bg-gray-50/50 py-2 rounded-xl">
                            <span className="text-xs">📞</span> {member.phone}
                          </a>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#2563eb] transition-colors bg-gray-50/50 py-2 rounded-xl">
                            <span className="text-xs">✉️</span> <span className="truncate max-w-[150px]">{member.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {staff.length === 0 && <p className="page-empty text-center py-20 text-gray-400">No data available</p>}
    </PageLayout>
  );
}
