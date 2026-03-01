"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getLocalizedValue } from "@/lib/utils/localized";
import { memo, useMemo } from "react";

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

// Static role order - defined outside component to prevent recreation
const ROLE_ORDER = ["chair", "cms", "info-officer"];

export const StaffCards = memo(function StaffCards({ staff }: { staff: StaffMember[] }) {
  const sorted = useMemo(
    () => [...staff].sort((a, b) => ROLE_ORDER.indexOf(a.role || "") - ROLE_ORDER.indexOf(b.role || "")),
    [staff]
  );

  if (staff.length === 0) return null;

  return (
    <div className="staff-cards-list">
      {sorted.map((member) => {
        const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
        const photoUrl = photo?.url || (member as any).externalPhoto || null;
        const isChair = member.role === "chair";
        const isCMS = member.role === "cms";
        const isInfo = member.role === "info-officer";
        const name = getLocalizedValue(member.nameEn || member.name);

        return (
          <ScrollReveal
            key={member.id}
            animation="animate-in fade-in slide-in-from-right-10"
            duration={500}
          >
            <div className="staff-card-v3">
              <div className="staff-avatar-wrapper-v3">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={name}
                    width={160}
                    height={160}
                    className="staff-avatar-img-v3"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="staff-avatar-placeholder-v3">👤</div>
                )}
              </div>

              <div className="staff-info-v3">
                <p className="staff-role-v3">{getLocalizedValue(member.designation)}</p>
                <h3 className="staff-name-v3">{name}</h3>

                {isInfo && (
                  <div className="staff-contact-v3">
                    {member.phone && <p>{getLocalizedValue(member.phone)}</p>}
                    {member.email && <p>{getLocalizedValue(member.email)}</p>}
                  </div>
                )}

                <div className="staff-actions-v3">
                  {isChair ? (
                    <Link href="/committee" className="staff-btn-v3">
                      व्यवस्थापन समितिका पदाधिकारीहरू
                    </Link>
                  ) : (
                    <Link href={`/staff/${member.id}`} className="staff-btn-v3">
                      पुरा विवरण
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
});
