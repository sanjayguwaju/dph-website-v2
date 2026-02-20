import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import Image from "next/image";

export const metadata: Metadata = {
  title: "कर्मचारीहरू | Our Staff",
  description: "अस्पतालका डाक्टर, नर्स तथा प्रशासनिक कर्मचारीहरू",
};

const ROLE_LABELS: Record<string, string> = {
  chair: "अध्यक्ष",
  cms: "प्रमुख चिकित्सा अधीक्षक",
  "info-officer": "सूचना अधिकारी",
  doctor: "चिकित्सक",
  nurse: "नर्स",
  administrative: "प्रशासनिक",
  other: "अन्य",
};

const ROLE_ORDER = ["chair", "cms", "info-officer", "doctor", "nurse", "administrative", "other"];

export default async function StaffPage() {
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
    <main className="page-container">
      <div className="page-hero">
        <h1 className="page-hero-title">👨‍⚕️ कर्मचारीहरू</h1>
        <p className="page-hero-sub">अस्पतालका डाक्टर, नर्स तथा प्रशासनिक कर्मचारीहरू</p>
      </div>

      {orderedGroups.map((role) => (
        <section key={role} className="staff-page-section">
          <h2 className="staff-page-section-heading">{ROLE_LABELS[role] || role}</h2>
          <div className="staff-page-grid">
            {grouped[role].map((member: any) => {
              const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
              return (
                <div key={member.id} className="staff-page-card">
                  <div className="staff-page-photo">
                    {photo?.url ? (
                      <Image
                        src={photo.url}
                        alt={member.nameEn || member.name}
                        width={120}
                        height={120}
                        className="staff-page-img"
                      />
                    ) : (
                      <div className="staff-page-avatar">👤</div>
                    )}
                  </div>
                  <div className="staff-page-info">
                    <p className="staff-page-name">{member.name}</p>
                    {member.nameEn && <p className="staff-page-name-en">{member.nameEn}</p>}
                    <p className="staff-page-designation">{member.designation}</p>
                    {member.department && <p className="staff-page-dept">{member.department}</p>}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="staff-page-contact">
                        📞 {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="staff-page-contact">
                        ✉️ {member.email}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {staff.length === 0 && <p className="page-empty">कुनै कर्मचारी जानकारी उपलब्ध छैन।</p>}
    </main>
  );
}
