import Link from "next/link";
import { MapPin, Phone, Mail, Globe, ExternalLink, ShieldCheck } from "lucide-react";
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
      <div className="container-refined">
        <div className="hospital-footer-grid">
          {/* Column 1: tabbed links */}
          <div className="hospital-footer-col">
            <h3 className="hospital-footer-heading">
              {labels.importantLinks}
            </h3>
            <div className="footer-card-v3">
              <FooterTabs locale={locale} />
            </div>
          </div>

          {/* Column 2: Map Embed */}
          <div className="hospital-footer-col">
            <h3 className="hospital-footer-heading">
              {labels.location}
            </h3>
            <div className="footer-map-v3 shadow-2xl">
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
                <div className="flex flex-col items-center justify-center h-full bg-slate-800 text-slate-500 gap-3">
                  <MapPin size={40} />
                  <span className="font-bold text-sm">Location Map Unavailable</span>
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
                    <div className="footer-icon-wrap"><MapPin size={18} /></div>
                    <div className="footer-detail-content">
                      <strong>{address}</strong>
                    </div>
                  </div>
                )}

                {s.contactPhone && (
                  <div className="footer-detail-item">
                    <div className="footer-icon-wrap"><Phone size={18} /></div>
                    <div className="footer-detail-content">
                      <p><strong>{labels.admin}</strong> <a href={`tel:${s.contactPhone}`} className="hover:text-white transition-colors">{s.contactPhone}</a></p>
                      {s.emergencyNumber && (
                        <p className="mt-1">
                          <strong>{labels.emergency}</strong>
                          <a href={`tel:${s.emergencyNumber}`} className="text-red-500 font-black hover:text-red-400 transition-colors ml-1">
                            {s.emergencyNumber}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {s.contactEmail && (
                  <div className="footer-detail-item">
                    <div className="footer-icon-wrap"><Mail size={18} /></div>
                    <div className="footer-detail-content">
                      <a href={`mailto:${s.contactEmail}`} className="hover:text-white transition-colors">{s.contactEmail}</a>
                    </div>
                  </div>
                )}

                {s.siteUrl && (
                  <div className="footer-detail-item">
                    <div className="footer-icon-wrap"><Globe size={18} /></div>
                    <div className="footer-detail-content">
                      <a href={s.siteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                        {s.siteUrl.replace(/^https?:\/\//, "")}
                        <ExternalLink size={14} className="opacity-50" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hospital-footer-bottom">
        <div className="container-refined flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="footer-bottom-left flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <p className="footer-bottom-text">
              {f.copyright || (
                locale === "ne"
                  ? `© ${toNepaliNum(new Date().getFullYear())} ${hospitalName}। सर्वाधिकार सुरक्षित।`
                  : `© ${new Date().getFullYear()} ${hospitalName}. All rights reserved.`
              )}
            </p>
          </div>

          <div className="footer-developed-by">
            <span className="flex items-center gap-2">
              Developed By{" "}
              <a
                href="https://www.instagram.com/dark_alaric8/"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-link-v3"
              >
                Abhishek Pyakurel
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
