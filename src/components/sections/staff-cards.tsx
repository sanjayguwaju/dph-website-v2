import Image from "next/image";

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

export function StaffCards({ staff }: { staff: StaffMember[] }) {
  if (staff.length === 0) return null;

  const roleOrder = ["chair", "cms", "info-officer"];
  const sorted = [...staff].sort(
    (a, b) => roleOrder.indexOf(a.role || "") - roleOrder.indexOf(b.role || ""),
  );

  return (
    <aside className="staff-cards-aside">
      <h2 className="staff-cards-heading">🏥 प्रमुख व्यक्तिहरू</h2>
      <div className="staff-cards-list">
        {sorted.map((member) => {
          const photo = member.photo && typeof member.photo === "object" ? member.photo : null;
          return (
            <div key={member.id} className="staff-card">
              <div className="staff-card-photo">
                {photo?.url ? (
                  <Image
                    src={photo.url}
                    alt={member.nameEn || member.name}
                    width={80}
                    height={80}
                    className="staff-card-img"
                  />
                ) : (
                  <div className="staff-card-avatar">👤</div>
                )}
              </div>
              <div className="staff-card-info">
                <p className="staff-card-name">{member.name}</p>
                {member.nameEn && <p className="staff-card-name-en">{member.nameEn}</p>}
                <p className="staff-card-designation">{member.designation}</p>
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="staff-card-contact">
                    📞 {member.phone}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
