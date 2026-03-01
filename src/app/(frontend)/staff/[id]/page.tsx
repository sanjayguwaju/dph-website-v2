import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { PageLayout } from "@/components/layout/page-layout";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const payload = await getPayloadClient();
  const staff = await payload.findByID({
    collection: "staff",
    id,
  });

  if (!staff) return { title: "Not Found" };

  return {
    title: `${staff.name} | Amppipal Hospital`,
  };
}

export default async function StaffDetailPage({ params }: Props) {
  const { id } = await params;
  const payload = await getPayloadClient();

  let staff;
  try {
    staff = await payload.findByID({
      collection: "staff",
      id,
    });
  } catch (e) {
    notFound();
  }

  if (!staff) notFound();

  const photo = staff.photo && typeof staff.photo === "object" ? staff.photo : null;
  const photoUrl = (photo as any)?.url || (staff as any).externalPhoto || null;

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Staff", href: "/staff" },
        { label: staff.name as string },
      ]}
      maxWidth="max-w-4xl"
    >
      <div className="shadow-sm border border-gray-100 rounded-lg overflow-hidden flex flex-col md:flex-row p-8 gap-8">
        <div className="shrink-0 mx-auto md:mx-0">
          <div className="w-[200px] h-[240px] relative rounded shadow-sm border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={(staff.nameEn as string) || (staff.name as string)}
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            ) : (
              <div className="text-6xl">👤</div>
            )}
          </div>

          <div className="mt-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-black">{staff.name}</h1>
            <p className="text-[#2563eb] font-semibold mt-1">{staff.designation}</p>
          </div>
        </div>

        <div className="flex-1 text-[#212529]">
          <h2 className="text-xl font-bold mb-6 border-b border-[#eee] pb-4">
            Personal Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] border-b border-gray-50 pb-4">
              <span className="font-semibold text-gray-500">Name</span>
              <span className="text-black font-medium">{staff.name}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] border-b border-gray-50 pb-4">
              <span className="font-semibold text-gray-500">Designation</span>
              <span className="text-black">{staff.designation}</span>
            </div>
            {staff.department && (
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] border-b border-gray-50 pb-4">
                <span className="font-semibold text-gray-500">Department</span>
                <span className="text-black">{staff.department}</span>
              </div>
            )}
            {staff.phone && (
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] border-b border-gray-50 pb-4">
                <span className="font-semibold text-gray-500">Mobile</span>
                <a href={`tel:${staff.phone}`} className="text-[#2563eb] hover:underline">
                  {staff.phone}
                </a>
              </div>
            )}
            {staff.email && (
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] border-b border-gray-50 pb-4">
                <span className="font-semibold text-gray-500">Email</span>
                <a href={`mailto:${staff.email}`} className="text-[#2563eb] hover:underline">
                  {staff.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
