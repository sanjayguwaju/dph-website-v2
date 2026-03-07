import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import Image from "next/image";
import { getLocalizedValue } from "@/lib/utils/localized";

import { getLocale } from "@/utils/locale-server";
import "./staff.css";
import { PageLayout } from "@/components/layout/page-layout";
import { PrintButton } from "@/components/ui/print-button";

import { getAllStaff } from "@/lib/queries/staff";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || (locale === "ne" ? "धौलागिरी प्रादेशिक अस्पताल" : "Dhaulagiri Provincial Hospital");

  return {
    title: locale === "ne" ? `कर्मचारीहरू | ${hospitalName}` : `Staff | ${hospitalName}`,
  };
}

export default async function StaffPage() {
  const locale = await getLocale();
  const staffDocs = await getAllStaff();

  // Roles in hierarchy order
  const ROLE_ORDER = ["chair", "cms", "management-committee", "info-officer", "doctor", "nurse", "administrative", "other"];

  // Sanitize CMS data into plain objects — Payload adds locale descriptor objects
  const sanitizeStaff = (s: any) => ({
    id: String(s.id || ""),
    name: getLocalizedValue(s.name),
    designation: getLocalizedValue(s.designation),
    department: s.department ? getLocalizedValue(s.department) : "",
    phone: typeof s.phone === "string" ? s.phone : "",
    email: typeof s.email === "string" ? s.email : "",
    role: typeof s.role === "string" ? s.role : "other",
    order: typeof s.order === "number" ? s.order : 0,
    isActive: Boolean(s.isActive),
    externalPhoto: typeof s.externalPhoto === "string" ? s.externalPhoto : "",
    photoUrl: (s.photo && typeof s.photo === "object" && typeof s.photo.url === "string") ? s.photo.url : "",
  });

  const staff = staffDocs.map(sanitizeStaff).sort((a: any, b: any) => {
    const roleA = ROLE_ORDER.indexOf(a.role || "other");
    const roleB = ROLE_ORDER.indexOf(b.role || "other");
    if (roleA !== roleB) return roleA - roleB;
    return (a.order || 0) - (b.order || 0);
  });

  // Featured member (typically the first CMS or Chairperson)
  const featuredMember = staff.find(m => m.role === "cms" || m.role === "chair") || staff[0];
  const gridMembers = staff.filter(m => m.id !== featuredMember?.id);

  const labels = {
    staff: locale === "ne" ? "कर्मचारीहरु" : "Staff Members",
    print: locale === "ne" ? "प्रिन्ट" : "Print",
    empty: locale === "ne" ? "कुनै डेटा उपलब्ध छैन" : "No data available",
  };

  const renderStaffCard = (member: any, isFeatured = false) => {
    const name = member.name || "";
    const designation = member.designation || "";
    const photoUrl = member.photoUrl || member.externalPhoto || "https://api.dicebear.com/7.x/avataaars/png?seed=user";
    const phoneLabel = locale === "ne" ? "फोन" : "Phone";

    if (isFeatured) {
      return (
        <div className="featured-staff-wrapper" key={member.id}>
          <div className="featured-staff-card">
            <div className="featured-photo-wrap">
              <Image src={photoUrl} alt={name} width={180} height={220} className="object-cover" />
            </div>
            <a href={`/staff/${member.id}`} className="featured-name">{name}</a>
            <div className="featured-designation">{designation}</div>
            <div className="featured-contact-info">
              {member.phone && <div>{phoneLabel}: {member.phone}</div>}
              {member.email && <div>{member.email}</div>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="staff-card-v2" key={member.id}>
        <div className="staff-card-photo-wrap">
          <Image src={photoUrl} alt={name} width={140} height={160} className="object-cover" />
        </div>
        <div className="staff-card-details">
          <a href={`/staff/${member.id}`} className="staff-name-link">{name}</a>
          <div className="staff-designation">{designation}</div>
          <div className="staff-contact-details">
            {member.phone && <div>{member.phone}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: labels.staff },
      ]}
      maxWidth="max-w-7xl"
    >
      <div className="staff-page-wrapper">
        <header className="staff-header">
          <h1 className="staff-title">
            {labels.staff}
          </h1>
        </header>

        <PrintButton label={labels.print} />

        {featuredMember && renderStaffCard(featuredMember, true)}

        <div className="staff-grid-v2">
          {gridMembers.map(member => renderStaffCard(member))}
        </div>

        {staff.length === 0 && (
          <p className="text-center py-20 text-gray-400 font-bold">{labels.empty}</p>
        )}
      </div>
    </PageLayout>
  );
}
