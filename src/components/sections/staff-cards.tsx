import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getLocale, getTranslations } from "next-intl/server";

type StaffMember = {
  id: string;
  name: string;
  nameEn?: string | null;
  designation: string;
  role?: string | null;
  photo?: any;
  phone?: string | null;
  email?: string | null;
};

export async function StaffCards({ staff }: { staff: StaffMember[] }) {
  const locale = await getLocale();
  const t = await getTranslations("staff");
  
  if (staff.length === 0) return null;

  const roleOrder = ["chair", "cms", "info-officer"];
  const sorted = [...staff].sort(
    (a, b) => roleOrder.indexOf(a.role || "") - roleOrder.indexOf(b.role || ""),
  );

  return (
    <div className="staff-cards-list">
      {sorted.map((member) => {
        const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
        const photoUrl = photo?.url || (member as any).externalPhoto || null;
        const isChair = member.role === "chair";
        const isCMS = member.role === "cms";
        const isInfo = member.role === "info-officer";
        const name = locale === "en" && member.nameEn ? member.nameEn : member.name;

        return (
          <ScrollReveal 
            key={member.id} 
            animation="animate-in fade-in slide-in-from-right-10" 
            duration={500}
          >
            <div className="staff-card">
              <div className="staff-card-photo">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={name}
                    width={90}
                    height={90}
                    className="staff-card-img"
                  />
                ) : (
                  <div className="staff-card-avatar secondary-bg">👤</div>
                )}
              </div>

              <div className="staff-card-info">
                <p className="staff-card-designation">{member.designation}</p>
                <p className="staff-card-name">{name}</p>

                {isInfo && (
                  <div className="staff-card-contacts">
                    {member.phone && (
                      <p className="staff-contact-item">
                        {member.phone}
                      </p>
                    )}
                    {member.email && (
                      <p className="staff-contact-item">
                        {member.email}
                      </p>
                    )}
                  </div>
                )}

                {isChair ? (
                  <Link href="/committee" className="staff-details-btn">
                    {t("managementCommittee")}
                  </Link>
                ) : (
                  <Link href={`/staff/${member.id}`} className="staff-details-btn">
                    {t("fullDetails")}
                  </Link>
                )}
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
