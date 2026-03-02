import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
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
  // Don't render if no content available
  if (!aboutText && !content) return null;

  const labels = {
    title: locale === "ne" ? "हाम्रो बारेमा" : "About Us",
    readMore: locale === "ne" ? "थप पढ्नुहोस्" : "Read More",
    fallback: locale === "ne"
      ? "अम्पिपाल अस्पताल पालुङटार नगरबासीको स्वास्थ्य सेवामा समर्पित एक सुलभ संस्था हो।"
      : "Amppipal Hospital is a government institution dedicated to quality healthcare for all."
  };

  return (
    <section className="about-section-common">
      <ScrollReveal animation="animate-in fade-in" duration={600}>
        <div className="section-header-v2">
          <h2 className="section-heading-v2">{labels.title}</h2>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="animate-in fade-in" duration={600} delay={200}>
        <div className="about-content-refined">
          {content ? (
            <div className="about-text-refined prose-editorial line-clamp-6">
              <RichText data={content} />
            </div>
          ) : (
            <p className="about-text-refined line-clamp-6">
              {aboutText || labels.fallback}
            </p>
          )}
          <div className="about-action">
            <Link href="/about" className="btn-read-more-red" aria-label={labels.readMore}>
              {labels.readMore} <span>›</span>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
