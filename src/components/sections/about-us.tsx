import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getTranslations } from "next-intl/server";
import { RichText } from "@/components/RichText";

export async function AboutUs({ 
  aboutText, 
  content 
}: { 
  aboutText?: string | null;
  content?: any;
}) {
  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  return (
    <section className="about-section-common">
      <div className="container-refined">
        <div className="about-grid">
           <ScrollReveal animation="animate-in fade-in slide-in-from-left-10" duration={600} className="w-full">
             <div className="about-branding">
                <h2 className="about-title-refined">{t("title")}</h2>
                <h3 className="about-subtitle-refined">ABOUT US</h3>
                <div className="about-accent-line"></div>
             </div>
           </ScrollReveal>
           <ScrollReveal animation="animate-in fade-in slide-in-from-right-10" duration={600} delay={200} className="w-full">
             <div className="about-content-refined">
                {content ? (
                  <div className="about-text-refined prose-editorial line-clamp-6">
                    <RichText data={content} />
                  </div>
                ) : (
                  <p className="about-text-refined line-clamp-6">
                    {aboutText || t("introContent")}
                  </p>
                )}
                <div className="about-action">
                  <Link href="/about" className="btn-v2-primary">
                    {tc("readMore")}
                  </Link>
                </div>
             </div>
           </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
