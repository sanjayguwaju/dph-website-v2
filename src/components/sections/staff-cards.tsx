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

const ROLE_ORDER = ["chair", "cms", "info-officer"];
const AVATAR_COLORS = ["#1E73BE", "#1AACA0", "#e12027", "#F4A100"];

function Avatar({
    photoUrl,
    name,
    color,
}: {
    photoUrl: string | null;
    name: string;
    color: string;
}) {
    const initial = name ? name.charAt(0) : "?";
    return (
        <div
            className="staff-avatar-wrapper-v3"
            style={{ backgroundColor: color, flexShrink: 0 }}
        >
            {photoUrl ? (
                <Image
                    src={photoUrl}
                    alt={name}
                    width={76}
                    height={76}
                    className="staff-avatar-img-v3"
                />
            ) : (
                <span className="staff-avatar-initial">{initial}</span>
            )}
        </div>
    );
}

export const StaffCards = memo(function StaffCards({
    staff = [],
}: {
    staff: StaffMember[];
}) {
    const [locale, setLocale] = useState("ne");

    useEffect(() => { setLocale(getLocaleClient()); }, []);

    const sorted = useMemo(
        () =>
            [...(staff ?? [])]
                .sort(
                    (a, b) =>
                        ROLE_ORDER.indexOf(a.role ?? "") -
                        ROLE_ORDER.indexOf(b.role ?? "")
                )
                .slice(0, 3),
        [staff]
    );

    if (!sorted.length) return null;

    const labels = {
        viewDetails: locale === "ne" ? "पुरा विवरण" : "View Details",
        boardMembers:
            locale === "ne"
                ? "व्यवस्थापन समितिका पदाधिकारीहरू"
                : "Board Members",
    };

    return (
        <div className="staff-cards-list">
            {sorted.map((member, idx) => {
                const photo =
                    member.photo && typeof member.photo === "object"
                        ? member.photo
                        : null;
                const photoUrl =
                    photo?.url || (member as any).externalPhoto || null;
                const isChair = member.role === "chair";
                const name = getLocalizedValue(member.name);
                const avatarBg = AVATAR_COLORS[(member.id?.length ?? idx) % AVATAR_COLORS.length];

                return (
                    <ScrollReveal
                        key={member.id}
                        animation="animate-in fade-in slide-in-from-right-10"
                        duration={500}
                    >
                        <div className="staff-card-v3">
                            <Avatar
                                photoUrl={photoUrl}
                                name={name}
                                color={avatarBg}
                            />

                            <div className="staff-info-v3">
                                <p className="staff-role-v3">
                                    {getLocalizedValue(member.designation)}
                                </p>
                                <h3 className="staff-name-v3">
                                    {name}
                                </h3>

                                {(member.phone || member.email) && (
                                    <div className="staff-contact-v3">
                                        {member.phone && (
                                            <span className="staff-phone-v3">
                                                {getLocalizedValue(member.phone)}
                                            </span>
                                        )}
                                        {member.phone && member.email && (
                                            <span className="staff-contact-sep"> | </span>
                                        )}
                                        {member.email && (
                                            <span className="staff-email-v3">
                                                {getLocalizedValue(member.email)}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="staff-actions-v3">
                                    <Link
                                        href={isChair ? "/committee" : `/staff/${member.id}`}
                                        className="staff-btn-v3"
                                    >
                                        {isChair ? labels.boardMembers : labels.viewDetails}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                );
            })}
        </div>
    );
});
