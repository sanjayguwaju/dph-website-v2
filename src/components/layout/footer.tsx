import Link from "next/link";
import { getSiteSettings, getFooter } from "@/lib/queries/globals";
import type { Footer as FooterType } from "@/payload-types";
import { FooterTabs } from "./footer-tabs";
import { toNepaliNum } from "@/utils/nepali-date";
import { getLocale } from "@/utils/locale-server";

export async function Footer() {
  const [settings, footerGlobal, locale] = await Promise.all([
    getSiteSettings(),
    getFooter(),
    getLocale(),
  ]);
  const s = settings as any;
  const f = footerGlobal as FooterType;

  const hospitalName = s.hospitalName || (locale === "ne" ? "अम्पिपाल अस्पताल" : "Amppipal Hospital");
  const address = s.address || (locale === "ne" ? "पालुङटार-३, गोरखा" : "Palungtar-3, Gorkha");
  const govermentName = s.govermentName || (locale === "ne" ? "गण्डकी प्रदेश सरकार" : "Gandaki Province Government");
  const ministryName = s.ministryName || (locale === "ne" ? "स्वास्थ्य मन्त्रालय" : "Ministry of Health");

  const labels = {
    importantLinks: locale === "ne" ? "महत्वपूर्ण लिङ्कहरू" : "Important Links",
    location: locale === "ne" ? "हाम्रो स्थान" : "Location",
    contactInfo: locale === "ne" ? "सम्पर्क जानकारी" : "Contact Information",
    admin: locale === "ne" ? "प्रशासन:" : "Admin:",
    emergency: locale === "ne" ? "आकस्मिक:" : "Emergency:",
  };

  return (
    <footer className="hospital-footer">
      <div className="hospital-footer-grid">
        {/* Column 1: tabbed links */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">
            {labels.importantLinks}
          </h3>
          <FooterTabs locale={locale} />
        </div>

        {/* Column 2: Map Embed */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">
            {labels.location}
          </h3>
          <div className="footer-map-v3">
            {s.mapEmbedUrl ? (
              <iframe
                src={s.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hospital Location Map"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-800 text-slate-500 font-bold text-sm">
                📍 Map Placeholder
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Contact Details */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">
            {labels.contactInfo}
          </h3>
          <div className="hospital-footer-contact">
            <div className="footer-org-badge">
              <p className="footer-contact-org-sm">{govermentName} / {ministryName}</p>
              <h2 className="footer-contact-org-lg">
                {hospitalName}
              </h2>
            </div>

            <div className="footer-contact-details-v3">
              {address && (
                <div className="footer-detail-item">
                  <span>📍</span>
                  <strong>{address}</strong>
                </div>
              )}

              {s.contactPhone && (
                <div className="footer-detail-item">
                  <span>📞</span>
                  <div>
                    <p><strong>{labels.admin}</strong> <a href={`tel:${s.contactPhone}`}>{s.contactPhone}</a></p>
                    {s.emergencyNumber && (
                      <p><strong>{labels.emergency}</strong> <a href={`tel:${s.emergencyNumber}`} className="text-red-400">{s.emergencyNumber}</a></p>
                    )}
                  </div>
                </div>
              )}

              {s.contactEmail && (
                <div className="footer-detail-item">
                  <span>✉️</span>
                  <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
                </div>
              )}

              {s.siteUrl && (
                <div className="footer-detail-item">
                  <span>🔗</span>
                  <a href={s.siteUrl} target="_blank" rel="noopener noreferrer">
                    {s.siteUrl.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hospital-footer-bottom">
        <p className="footer-bottom-text">
          {f.copyright || (
            locale === "ne"
              ? `© ${toNepaliNum(new Date().getFullYear())} ${hospitalName}। सर्वाधिकार सुरक्षित।`
              : `© ${new Date().getFullYear()} ${hospitalName}. All rights reserved.`
          )}
        </p>

        <div className="footer-developed-by">
          <span>
            Developed By{" "}
            <a
              href="https://www.instagram.com/dark_alaric8/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              Abhishek Pyakurel
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
