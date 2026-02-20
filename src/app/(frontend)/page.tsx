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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const s = settings as any;

  return {
    title: s.hospitalNameEn || s.hospitalNameNe || "District Hospital",
    description: s.taglineEn || s.taglineNe || "Government Hospital",
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
  ]);

  const s = settings as any;

  return (
    <>
      {/* ── Hero Image Slider ─────────────────────────────────────── */}
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

      {/* ── OPD Stats Banner ─────────────────────────────────────── */}
      <OpdStatsBanner stats={opdStats as any} />

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="homepage-layout">
        {/* Left / Main column */}
        <div className="homepage-main">
          {/* About Us */}
          <AboutUs aboutText={s.aboutUs} />

          {/* News & Activities */}
          <NewsActivities featured={newsData.featured as any} recent={newsData.recent as any} />

          {/* Notices Tabs */}
          <NoticesTabs
            notices={noticesData.notices as any}
            news={noticesData.news as any}
            pressReleases={noticesData.pressReleases as any}
            publications={noticesData.publications as any}
            bids={noticesData.bids as any}
          />

          {/* Services Grid */}
          <ServicesGrid services={services as any} />
        </div>

        {/* Right Sidebar */}
        <aside className="homepage-sidebar">
          {/* Staff Cards */}
          <StaffCards staff={staff as any} />

          {/* Nepali Calendar */}
          <NepaliCalendar />
        </aside>
      </div>

      {/* ── Photo Gallery ─────────────────────────────────── */}
      <PhotoGallery albums={photoAlbums as any} />

      {/* ── Video Gallery ─────────────────────────────────── */}
      <VideoGallery videos={videos as any} />

      {/* ── Quick Access Links ────────────────────────────── */}
      <QuickAccessLinks links={quickLinks as any} />
    </>
  );
}
