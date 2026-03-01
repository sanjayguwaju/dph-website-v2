import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { RichText } from "@/components/RichText";

export async function AboutUs({
  aboutText,
  content
}: {
  aboutText?: string | null;
  content?: any;
}) {
  // Don't render if no content available
  if (!aboutText && !content) return null;

  return (
    <section className="about-section-common">
      <ScrollReveal animation="animate-in fade-in" duration={600}>
        <div className="section-header-v2">
          <h2 className="section-heading-v2">About Us</h2>
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
              {aboutText}
            </p>
          )}
          <div className="about-action">
            <Link href="/about" className="btn-read-more-red">
              Read More <span>›</span>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
