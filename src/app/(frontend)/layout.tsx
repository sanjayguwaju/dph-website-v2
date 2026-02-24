import { SpeedInsights } from "@vercel/speed-insights/next"
import { Header, Footer } from "@/components/layout";
import { TopBar } from "@/components/layout/top-bar";
import { NoticesPopup } from "@/components/notices";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { ProgressBar } from "@/components/layout/progress-bar";
import { getPopupNotices } from "@/lib/queries/notices";
import { getSiteSettings } from "@/lib/queries/globals";
import "./globals.css";

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [popupNotices, settings] = await Promise.all([
    getPopupNotices(),
    getSiteSettings(),
  ]);

  const s = settings as any;
  const locale = "ne";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Disable transitions during init to prevent flash
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
                
                // Re-enable transitions after a frame
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
      <body suppressHydrationWarning>
        {/* Accessibility + Date + Emergency + Social */}
        <TopBar
          contactPhone={s.contactPhone}
          emergencyNumber={s.emergencyNumber}
        />

        {/* Hospital Logo + Navigation */}
        <Header />



        {/* Page Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Notices Popup Dialog */}
        <NoticesPopup notices={popupNotices} />

        {/* Progress Bar for navigation feedback */}
        <ProgressBar />

        {/* Scroll to Top Arrow */}
        <ScrollToTop />

        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
