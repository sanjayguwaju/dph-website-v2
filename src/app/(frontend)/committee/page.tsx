import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import { getLocale } from "@/utils/locale-server";
import { PageLayout } from "@/components/layout/page-layout";
import { getManagementCommittee } from "@/lib/queries/staff";
import { getLocalizedValue } from "@/lib/utils/localized";
import Image from "next/image";
import "./management.css";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    const locale = await getLocale();
    const s = settings as any;
    const hospitalName = s.hospitalName || (locale === "ne" ? "धौलागिरी प्रादेशिक अस्पताल" : "Dhaulagiri Provincial Hospital");

    return {
        title: locale === "ne" ? `व्यवस्थापन समिति | ${hospitalName}` : `Management Committee | ${hospitalName}`,
    };
}

// Sub-component for rendering each member's card
function MemberCard({ member, locale }: { member: any, locale: string }) {
    const name = member.name || "";
    const designation = member.designation || "";
    const mobileLabel = locale === "ne" ? "मोबाइल" : "Mobile";
    const photoUrl = member.photoUrl || member.externalPhoto || "https://api.dicebear.com/7.x/avataaars/png?seed=user";

    return (
        <div className="member-card">
            <div className="member-photo-wrapper">
                <Image
                    src={photoUrl}
                    alt={name}
                    width={140}
                    height={160}
                    className="member-photo"
                />
            </div>
            <div className="member-name">{name}</div>
            <div className="member-role">{designation}</div>
            <div className="member-mobile">
                {member.phone && `${mobileLabel}: ${member.phone}`}
            </div>
        </div>
    );
}

export default async function CommitteePage() {
    const locale = await getLocale();
    const committeeDocs = await getManagementCommittee();
    const title = locale === "ne" ? "व्यवस्थापन समिति" : "Management Committee";

    const sanitizeStaff = (s: any) => ({
        id: String(s.id || ""),
        name: getLocalizedValue(s.name),
        designation: getLocalizedValue(s.designation),
        phone: typeof s.phone === "string" ? s.phone : "",
        photoUrl: (s.photo && typeof s.photo === "object" && typeof s.photo.url === "string") ? s.photo.url : "",
        externalPhoto: typeof s.externalPhoto === "string" ? s.externalPhoto : "",
    });

    const members = committeeDocs.map(sanitizeStaff);
    const chairman = members[0];
    const restOfMembers = members.slice(1);

    return (
        <PageLayout breadcrumbs={[{ label: title }]} maxWidth="max-w-7xl">
            <div className="management-container">
                <h1 className="management-title">{title}</h1>

                <div className="management-box">
                    {chairman && (
                        <div className="management-top-row">
                            <MemberCard member={chairman} locale={locale} />
                        </div>
                    )}
                    <div className="management-grid">
                        {restOfMembers.map((m) => (
                            <MemberCard key={m.id} member={m} locale={locale} />
                        ))}
                    </div>

                    {members.length === 0 && (
                        <div className="text-center py-20 text-gray-400 font-bold">
                            {locale === "ne" ? "डेटा उपलब्ध छैन" : "No data available"}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
