import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import { getHeroSlides } from "@/lib/queries/hero-slides";
import {
  getHomepageStaff,
  getHomepageServices,
  getHomepageNews,
  getNoticesByType,
  getPhotoGalleryPreview,
  getVideoGalleryPreview,
  getQuickLinks,
  getOpdStats,
} from "@/lib/queries/homepage";

import { HeroSection } from "@/components/sections/hero-section";
import { AboutUs } from "@/components/sections/about-us";
import { NewsActivities } from "@/components/sections/news-activities";
import { NepaliCalendar } from "@/components/sections/nepali-calendar";
import { FacebookWidget } from "@/components/sections/facebook-widget";
import { VisitorCounter } from "@/components/sections/visitor-counter";
import { OpdStatsBanner } from "@/components/sections/opd-stats-banner";
import { ServicesGrid } from "@/components/sections/services-grid";
import { NoticesTabs } from "@/components/sections/notices-tabs";
import { OptimizedPhotoGallery } from "@/components/sections/optimized-photo-gallery";
import { VideoGallery } from "@/components/sections/video-gallery";
import { QuickAccessLinks } from "@/components/sections/quick-access-links";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { EmergencyFloatingButton } from "@/components/ui/emergency-float";
import { getLocale } from "@/utils/locale-server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = await getLocale();
  const s = settings as any;
  const hospitalName = s.hospitalName || "Amppipal Hospital";

  const description = locale === "ne"
    ? "गण्डकी प्रदेश सरकार, स्वास्थ्य मन्त्रालय"
    : "Government of Nepal, Ministry of Health and Population";

  return {
    title: hospitalName,
    description: description,
  };
}

export default async function HomePage() {
  // Parallel data fetching for optimal performance
  const [
    heroSlides,
    settings,
    staff,
    services,
    newsData,
    noticesData,
    photoAlbums,
    videos,
    quickLinks,
    opdStats,
    aboutPage,
    locale,
  ] = await Promise.all([
    getHeroSlides(),
    getSiteSettings(),
    getHomepageStaff(),
    getHomepageServices(),
    getHomepageNews(),
    getNoticesByType(),
    getPhotoGalleryPreview(),
    getVideoGalleryPreview(),
    getQuickLinks(),
    getOpdStats(),
    import("@/lib/queries/pages").then((m) => m.getPageBySlug("about")),
    getLocale(),
  ]);

  const s = settings as any;
  const ap = aboutPage as any;

  // Sanitize Payload docs to plain objects before passing to Client Components.
  // Payload attaches locale descriptor objects ({label, code, toString: fn}) to fields
  // which cannot be serialized across the Server -> Client boundary.
  const sanitizeDoc = (doc: any): any => {
    if (!doc || typeof doc !== "object") return doc;
    if (Array.isArray(doc)) return doc.map(sanitizeDoc);
    const plain: Record<string, any> = {};
    for (const key of Object.keys(doc)) {
      const val = doc[key];
      if (typeof val === "function") continue; // strip functions
      if (val && typeof val === "object" && typeof val.toString === "function" && val.constructor?.name !== "Object" && val.constructor?.name !== "Array") {
        // Possible Payload locale object or Date
        if (val instanceof Date) { plain[key] = val.toISOString(); continue; }
        continue; // skip non-plain objects with custom prototypes
      }
      plain[key] = sanitizeDoc(val);
    }
    return plain;
  };

  const safeNotices = (noticesData.notices as any[]).map(sanitizeDoc);
  const safeNews = (noticesData.news as any[]).map(sanitizeDoc);
  const safePressReleases = (noticesData.pressReleases as any[]).map(sanitizeDoc);
  const safePublications = (noticesData.publications as any[]).map(sanitizeDoc);
  const safeBids = (noticesData.bids as any[]).map(sanitizeDoc);


  return (
    <main className="animate-in fade-in zoom-in-[0.98] duration-1000 ease-out fill-mode-both">
      {/* ── Top Hero Section (Slider + Staff) ──────────────────────── */}
      <HeroSection slides={heroSlides} staff={staff as any} />

      {/* ── OPD Stats Banner ─────────────────────────────────────── */}
      <ScrollReveal animation="flip-up" duration={700}>
        <OpdStatsBanner stats={opdStats as any} locale={locale} />
      </ScrollReveal>

      {/* ── Main Layout (Content + Sidebar) ────────────────────────── */}
      <div className="home-main-layout">
        <div className="home-content-col">
          {/* About Us */}
          <ScrollReveal animation="fade-up" duration={700} delay={0}>
            <AboutUs aboutText={s.aboutUs} content={ap?.content} locale={locale} />
          </ScrollReveal>

          {/* News & Activities */}
          <ScrollReveal animation="fade-up" duration={700} delay={100}>
            <NewsActivities featured={newsData.featured as any} recent={newsData.recent as any} locale={locale} />
          </ScrollReveal>

          {/* Notices Tabs - NoticesTabs is a Client Component, only pass sanitized plain data */}
          <ScrollReveal animation="fade-up" duration={700} delay={200}>
            <NoticesTabs
              notices={safeNotices}
              news={safeNews}
              pressReleases={safePressReleases}
              publications={safePublications}
              bids={safeBids}
              locale={locale}
            />
          </ScrollReveal>
        </div>

        <aside className="home-sidebar-col">
          {/* Facebook Widget */}
          <ScrollReveal animation="fade-up" duration={600} delay={150}>
            <FacebookWidget
              pageName={s.facebookPageName || s.hospitalName}
              followerCount={s.facebookFollowers}
              facebookUrl={s.facebook || "https://facebook.com"}
              locale={locale}
            />
          </ScrollReveal>

          {/* Nepali Calendar */}
          <ScrollReveal animation="fade-up" duration={600} delay={250}>
            <NepaliCalendar />
          </ScrollReveal>

          {/* Visitor Counter */}
          <ScrollReveal animation="fade-up" duration={600} delay={350}>
            <VisitorCounter locale={locale} />
          </ScrollReveal>
        </aside>
      </div>

      {/* ── Services Grid Full Width ────────────────────────────── */}
      <ScrollReveal animation="flip-up" duration={800}>
        <ServicesGrid services={services as any} locale={locale} />
      </ScrollReveal>

      {/* ── Photo Gallery ─────────────────────────────────── */}
      <ScrollReveal animation="zoom-in" duration={700}>
        <OptimizedPhotoGallery albums={photoAlbums as any} />
      </ScrollReveal>

      {/* ── Video Gallery ─────────────────────────────────── */}
      <ScrollReveal animation="fade-up" duration={700}>
        <VideoGallery videos={videos as any} locale={locale} />
      </ScrollReveal>

      {/* ── Quick Access Links ────────────────────────────── */}
      <ScrollReveal animation="zoom-in" duration={600}>
        <QuickAccessLinks links={[
          ...quickLinks as any,
          {
            id: 'online-appointment',
            label: locale === "ne" ? 'अनलाइन टिकट' : 'Online Appointment',
            icon: '📅',
            url: '/appointments'
          }
        ]} />
      </ScrollReveal>

      <EmergencyFloatingButton phone={s.emergencyNumber} locale={locale} />
    </main>
  );
}
