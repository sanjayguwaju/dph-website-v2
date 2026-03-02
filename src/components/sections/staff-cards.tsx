"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getLocalizedValue } from "@/lib/utils/localized";
import { getLocaleClient } from "@/utils/locale-client";
import { memo, useMemo, useState, useEffect } from "react";

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

export const StaffCards = memo(function StaffCards({ staff = [] }: { staff: StaffMember[] }) {
  const [locale, setLocale] = useState("ne");

  useEffect(() => {
    setLocale(getLocaleClient());
  }, []);

  const sorted = useMemo(
    () => (staff && Array.isArray(staff) ? [...staff] : []).sort((a, b) => ROLE_ORDER.indexOf(a.role || "") - ROLE_ORDER.indexOf(b.role || "")),
    [staff]
  );

  if (!staff || staff.length === 0) return null;

  const labels = {
    viewDetails: locale === "ne" ? "पुरा विवरण" : "View Details",
    boardMembers: locale === "ne" ? "व्यवस्थापन समितिका पदाधिकारीहरू" : "Board Members",
  };

  return (
    <div className="staff-cards-list">
      {sorted.map((member) => {
        const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
        const photoUrl = photo?.url || (member as any).externalPhoto || null;
        const isChair = member.role === "chair";
        const name = getLocalizedValue(member.name);

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

                {member.role === "info-officer" && (
                  <div className="staff-contact-v3">
                    {member.phone && <p>{getLocalizedValue(member.phone)}</p>}
                    {member.email && <p>{getLocalizedValue(member.email)}</p>}
                  </div>
                )}

                <div className="staff-actions-v3">
                  {isChair ? (
                    <Link href="/committee" className="staff-btn-v3">
                      {labels.boardMembers}
                    </Link>
                  ) : (
                    <Link href={`/staff/${member.id}`} className="staff-btn-v3">
                      {labels.viewDetails}
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
