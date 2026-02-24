import { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { getSiteSettings } from "@/lib/queries/globals";
import { Download, FileText, Calendar, Search, Tag } from "lucide-react";
import { formatDate } from "@/utils/format";
import { PageLayout } from "@/components/layout/page-layout";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const s = settings as any;
  const hospitalName = s.hospitalNameEn || "Amppipal Hospital";

  return {
    title: `Downloads | ${hospitalName}`,
    description: "Download important documents, annual reports, and publications.",
  };
}

export default async function DownloadsPage() {
  const payload = await getPayloadClient();

  // Fetch both news (publications) and notices that have files
  const [newsRes, noticesRes] = await Promise.all([
    payload.find({
      collection: "news",
      where: {
        and: [
          { status: { equals: "published" } },
          {
            or: [
              { file: { exists: true } },
              { externalFile: { exists: true } }
            ]
          }
        ]
      },
      sort: "-publishedDate",
      limit: 50,
    }),
    payload.find({
      collection: "notices",
      where: {
        and: [
          { status: { equals: "published" } },
          {
            or: [
              { file: { exists: true } },
              { externalFile: { exists: true } }
            ]
          }
        ]
      },
      sort: "-publishedDate",
      limit: 50,
    })
  ]);

  // Combine and sort by date
  const downloads = [
    ...newsRes.docs.map(d => ({ ...d, resourceType: "News/Pub" })),
    ...noticesRes.docs.map(d => ({ ...d, resourceType: "Notice" }))
  ].sort((a: any, b: any) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return (
    <PageLayout
      breadcrumbs={[{ label: "Downloads" }]}
      maxWidth="max-w-6xl"
    >
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold text-[#003580] mb-3 flex items-center gap-3">
          <Download className="text-[#2563eb]" />
          Downloads & Publications
        </h1>
        <p className="text-gray-500 text-lg">
          Access and download annual reports, guidelines, and important notices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {downloads.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Search size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No data available</p>
          </div>
        ) : (
          downloads.map((item: any) => {
            const fileUrl = (item.file as any)?.url || item.externalFile;
            if (!fileUrl) return null;

            const fileName = (item.file as any)?.filename || item.externalFile?.split('/').pop() || "document.pdf";
            const fileSize = (item.file as any)?.filesize
              ? `${(item.file.filesize / 1024 / 1024).toFixed(2)} MB`
              : "";

            return (
              <div
                key={`${item.resourceType}-${item.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-[#2563eb]/20 transition-all gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#2563eb] group-hover:text-white transition-colors border border-blue-100">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                        <Tag size={10} /> {item.resourceType}
                      </span>
                      {item.publishedDate && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
                          <Calendar size={12} /> {formatDate(item.publishedDate, "short")}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#2563eb] transition-colors">
                      {typeof item.title === "object" ? item.title.ne || item.title.en || JSON.stringify(item.title) : item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{fileName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {fileSize && <span className="text-xs font-semibold text-gray-400">{fileSize}</span>}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-[#2563eb] border border-blue-100 rounded-full text-sm font-bold hover:bg-[#2563eb] hover:text-white transition-all shadow-sm"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-16 p-8 bg-[#003580] rounded-3xl text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Stay Updated
            </h2>
            <p className="text-blue-100">
              Check our News and Notices section regularly for the latest updates.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/news" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
              News
            </Link>
            <Link href="/notices" className="px-6 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Notices
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-10 rounded-full -mr-32 -mt-32"></div>
      </div>
    </PageLayout>
  );
}
