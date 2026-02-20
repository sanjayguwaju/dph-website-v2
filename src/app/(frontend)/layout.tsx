import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { TopBar } from "@/components/layout/top-bar";
import { Marquee } from "@/components/layout/marquee";
import { NoticesPopup } from "@/components/notices";
import { getPopupNotices } from "@/lib/queries/notices";
import { getSiteSettings } from "@/lib/queries/globals";
import "./globals.css";

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [popupNotices, settings, messages] = await Promise.all([
    getPopupNotices(),
    getSiteSettings(),
    getMessages(),
  ]);

  const s = settings as any;

  return (
    <html lang="ne">
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* Accessibility + Date + Emergency + Social + Lang Switcher */}
          <TopBar
            emergencyNumber={s.emergencyNumber}
            facebook={s.facebook}
            youtube={s.youtube}
            twitter={s.twitter}
          />

          {/* Hospital Logo + Navigation */}
          <Header />

          {/* Scrolling notices marquee */}
          <Marquee />

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Notices Popup Dialog */}
          <NoticesPopup notices={popupNotices} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
