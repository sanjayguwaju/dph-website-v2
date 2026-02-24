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

import { HeroSlider } from "@/components/sections";
import { StaffCards } from "@/components/sections/staff-cards";
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
import { toNepaliNum } from "@/utils/nepali-date";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { EmergencyFloatingButton } from "@/components/ui/emergency-float";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dhaulagiri Hospital",
    description: "Government of Nepal, Ministry of Health and Population",
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
  ]);

  const s = settings as any;
  const ap = aboutPage as any;
  const hospitalName = s.hospitalNameNe || s.hospitalNameEn;

  return (
    <>
      {/* ── Top Hero Section (Slider + Staff) ──────────────────────── */}
      <div className="hero-staff-container">
        <div className="hero-staff-inner">
          <ScrollReveal className="hero-column" animation="fade-in zoom-in" duration={800}>
            {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}
          </ScrollReveal>
          <ScrollReveal className="staff-column" delay={200}>
            <StaffCards staff={staff as any} />
          </ScrollReveal>
        </div>
      </div>

      {/* ── OPD Stats Banner ─────────────────────────────────────── */}
      <ScrollReveal>
        <OpdStatsBanner stats={opdStats as any} />
      </ScrollReveal>

      {/* ── Main Layout (Content + Sidebar) ────────────────────────── */}
      <div className="home-main-layout">
        <div className="home-content-col">
          {/* About Us */}
          <ScrollReveal delay={100}>
            <AboutUs aboutText={s.aboutUs} content={ap?.content} />
          </ScrollReveal>

          {/* News & Activities */}
          <ScrollReveal delay={200}>
            <NewsActivities featured={newsData.featured as any} recent={newsData.recent as any} />
          </ScrollReveal>

          {/* Notices Tabs */}
          <ScrollReveal delay={300}>
            <NoticesTabs
              notices={noticesData.notices as any}
              news={noticesData.news as any}
              pressReleases={noticesData.pressReleases as any}
              publications={noticesData.publications as any}
              bids={noticesData.bids as any}
            />
          </ScrollReveal>
        </div>

        <aside className="home-sidebar-col">
          {/* Facebook Widget */}
          <ScrollReveal delay={400}>
            <FacebookWidget pageName={hospitalName} />
          </ScrollReveal>

          {/* Nepali Calendar */}
          <ScrollReveal delay={500}>
            <NepaliCalendar />
          </ScrollReveal>

          {/* Visitor Counter */}
          <ScrollReveal delay={600}>
            <VisitorCounter />
          </ScrollReveal>
        </aside>
      </div>

      {/* ── Services Grid Full Width ────────────────────────────── */}
      <ScrollReveal>
        <ServicesGrid services={services as any} />
      </ScrollReveal>

      {/* ── Photo Gallery ─────────────────────────────────── */}
      <ScrollReveal>
        <OptimizedPhotoGallery albums={photoAlbums as any} />
      </ScrollReveal>

      {/* ── Video Gallery ─────────────────────────────────── */}
      <ScrollReveal>
        <VideoGallery videos={videos as any} />
      </ScrollReveal>

      {/* ── Quick Access Links ────────────────────────────── */}
      <ScrollReveal>
        <QuickAccessLinks links={[
          ...quickLinks as any,
          {
            id: 'online-appointment',
            label: 'Online Appointment',
            icon: '📅',
            url: '/appointments'
          }
        ]} />
      </ScrollReveal>

      <EmergencyFloatingButton />
    </>
  );
}
