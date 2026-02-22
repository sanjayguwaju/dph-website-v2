import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { TopBar } from "@/components/layout/top-bar";
import { NoticesPopup } from "@/components/notices";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { getPopupNotices } from "@/lib/queries/notices";
import { getSiteSettings } from "@/lib/queries/globals";
import "./globals.css";

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [popupNotices, settings, messagesData] = await Promise.all([
    getPopupNotices(),
    getSiteSettings(),
    getMessages(),
  ]);

  const s = settings as any;
  const messages = messagesData as any;
  const locale = messages?.locale || "ne";

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
        <NextIntlClientProvider messages={messages}>
          {/* Accessibility + Date + Emergency + Social + Lang Switcher */}
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

          {/* Scroll to Top Arrow */}
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
