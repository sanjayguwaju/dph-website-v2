import { SpeedInsights } from "@vercel/speed-insights/next"
import { Header, Footer, PageTransition, ProgressBar } from "@/components/layout"
import { TopBar } from "@/components/layout/top-bar"
import { NoticesPopup } from "@/components/notices"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { Suspense } from "react"
import { getPopupNotices } from "@/lib/queries/notices"
import { getSiteSettings } from "@/lib/queries/globals"
import { getLocale } from "@/utils/locale-server"
import "./globals.css"

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [popupNotices, settings, locale] = await Promise.all([
    getPopupNotices(),
    getSiteSettings(),
    getLocale(),
  ])

  const s = settings as any

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('no-transitions');
                var stored = null;
                try { stored = localStorage.getItem('theme'); } catch(e) {}
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var isDark = stored === 'dark' || (!stored && prefersDark);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                requestAnimationFrame(function() {
                  requestAnimationFrame(function() {
                    document.documentElement.classList.remove('no-transitions');
                  });
                });
              })()
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="relative bg-white min-h-screen font-sans text-slate-900 antialiased">
        <TopBar
          contactPhone={s.contactPhone}
          emergencyNumber={s.emergencyNumber}
          initialLocale={locale}
        />

        <header className="site-header-sticky-v3 relative z-[1050]">
          <Header />
        </header>

        <main className="min-h-screen relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        <Footer />
        <NoticesPopup notices={popupNotices} />

        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>

        <ScrollToTop />
        <SpeedInsights />
      </body>
    </html>
  )
}
