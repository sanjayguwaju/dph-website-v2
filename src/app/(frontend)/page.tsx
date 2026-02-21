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
import { OpdStatsBanner } from "@/components/sections/opd-stats-banner";
import { ServicesGrid } from "@/components/sections/services-grid";
import { NoticesTabs } from "@/components/sections/notices-tabs";
import { PhotoGallery } from "@/components/sections/photo-gallery";
import { VideoGallery } from "@/components/sections/video-gallery";
import { QuickAccessLinks } from "@/components/sections/quick-access-links";
import { getLocale, getTranslations } from "next-intl/server";
import { toNepaliNum } from "@/utils/nepali-date";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export async function generateMetadata(): Promise<Metadata> {
  const tc = await getTranslations("common");
  const th = await getTranslations("nav");

  return {
    title: tc("hospitalName"),
    description: `${th("govText")}, ${th("ministryText")}`,
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const tf = await getTranslations("facebookWidget");
  const tc = await getTranslations("common");

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
  const hospitalName = locale === "en" ? s.hospitalNameEn : s.hospitalNameNe;

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
          <ScrollReveal delay={400} className="facebook-widget-card">
            <div className="fb-header">
               <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#1877f2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>f</span>
               <div className="fb-header-text">
                  <p className="fb-page-name">{hospitalName || tc("hospitalName")}</p>
                  <p className="fb-follow-count">
                    {locale === "ne" ? toNepaliNum(4.4) : "4.4"}K {tf("followers")}
                  </p>
               </div>
               <a href="https://facebook.com/dhaulagirihospital" target="_blank" rel="noopener noreferrer" className="fb-follow-btn">
                 {tf("followPage")}
               </a>
            </div>
            <div className="fb-body">
               <div className="fb-placeholder-img" style={{ background: '#f0f2f5', padding: '20px', textAlign: 'center', color: '#1877f2', fontWeight: 600, minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span>{tf("facebookFeed")}</span>
               </div>
            </div>
          </ScrollReveal>

          {/* Nepali Calendar */}
          <ScrollReveal delay={500} className="sidebar-calendar-wrap">
             <NepaliCalendar />
          </ScrollReveal>
        </aside>
      </div>

      {/* ── Services Grid Full Width ────────────────────────────── */}
      <ScrollReveal>
        <ServicesGrid services={services as any} />
      </ScrollReveal>

      {/* ── Photo Gallery ─────────────────────────────────── */}
      <ScrollReveal>
        <PhotoGallery albums={photoAlbums as any} />
      </ScrollReveal>

      {/* ── Video Gallery ─────────────────────────────────── */}
      <ScrollReveal>
        <VideoGallery videos={videos as any} />
      </ScrollReveal>

      {/* ── Quick Access Links ────────────────────────────── */}
      <ScrollReveal>
        <QuickAccessLinks links={quickLinks as any} />
      </ScrollReveal>
    </>
  );
}
