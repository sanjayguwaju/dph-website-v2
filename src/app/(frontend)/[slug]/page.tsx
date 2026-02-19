import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/queries/pages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="px-page py-section container mx-auto">
      <article className="mx-auto max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl font-[var(--font-display)] font-bold text-[var(--color-ink-50)] lg:text-5xl">
            {page.title}
          </h1>
        </header>

        <div className="prose-editorial">
          {/* Rich text content would be rendered here */}
          <div className="text-lg leading-relaxed text-[var(--color-ink-200)]">
            <p>
              Page content would be rendered here using a Lexical/Rich Text renderer. The content is
              stored as structured data.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
