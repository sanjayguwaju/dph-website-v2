import Link from "next/link";
import { RichText } from "@/components/RichText";

export async function AboutUs({
  aboutText,
  content,
  locale = "ne"
}: {
  aboutText?: string | null;
  content?: any;
  locale?: string;
}) {
  if (!aboutText && !content) return null;

  const labels = {
    title: locale === "ne" ? "हाम्रो बारेमा" : "About Us",
    readMore: locale === "ne" ? "थप पढ्नुहोस्" : "Read More",
    fallback: locale === "ne"
      ? "धौलागिरी प्रादेशिक अस्पताल बागलुङ जिल्लाका धौलागिरी अञ्चलको मुख्य अस्पताल हो।"
      : "Dhaulagiri Provincial Hospital is the main hospital in Gorkha for providing quality healthcare.",
  };

  // Pre-render RichText strictly on the server side.
  // We do NOT pass the raw Payload `content` object to any Client Component.
  // RichText is a Server Component so we can render it here safely.
  const richContent = content ? (
    <div className="about-text-refined prose-editorial line-clamp-6 text-center-force">
      <RichText data={content} />
    </div>
  ) : (
    <p className="about-text-refined line-clamp-6">
      {aboutText || labels.fallback}
    </p>
  );

  return (
    <section className="about-section-common py-16">
      <div className="container-refined">
        <div className="about-header text-center mb-12">
          <h2 className="about-title">{labels.title}</h2>
        </div>

        <div className="about-content-refined max-w-4xl mx-auto text-center">
          {richContent}
          <div className="about-action flex justify-center mt-10">
            <Link
              href="/about"
              className="btn-read-more-red px-10 py-3 rounded text-white font-bold"
              aria-label={labels.readMore}
            >
              {labels.readMore} <span>›</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
