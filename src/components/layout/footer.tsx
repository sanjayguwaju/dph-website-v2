import Link from "next/link";
import { getSiteSettings, getFooter } from "@/lib/queries/globals";
import type { Footer as FooterType, Category, Page } from "@/payload-types";
import { FooterTabs } from "./footer-tabs";
import { toNepaliNum } from "@/utils/nepali-date";
import { getLocale, getTranslations } from "next-intl/server";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const ta = await getTranslations("accessibility");
  const [settings, footerGlobal] = await Promise.all([getSiteSettings(), getFooter()]);
  const s = settings as any;
  const f = footerGlobal as FooterType;

  const tn = await getTranslations("nav");
  const hospitalName = locale === "en" ? s.hospitalNameEn : s.hospitalNameNe;
  const address = locale === "en" ? s.addressEn : s.address;
  const govText = tn("govText");
  const ministryText = tn("ministryText");

  return (
    <footer className="hospital-footer">
      <div className="hospital-footer-grid">
        {/* Column 1: tabbed links */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">
            {t("importantLinks")}
          </h3>
          <FooterTabs />
        </div>

        {/* Column 2: Map Embed */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">
            {t("location")}
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
            {t("contactInfo")}
          </h3>
          <div className="hospital-footer-contact">
             <div className="footer-org-badge">
                <p className="footer-contact-org-sm">{govText} / {ministryText}</p>
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
                      <p><strong>{ta("administration")}:</strong> <a href={`tel:${s.contactPhone}`}>{s.contactPhone}</a></p>
                      {s.emergencyNumber && (
                        <p><strong>{ta("emergency")}:</strong> <a href={`tel:${s.emergencyNumber}`} className="text-red-400">{s.emergencyNumber}</a></p>
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
            locale === "en" 
            ? `© ${new Date().getFullYear()} ${hospitalName}. All Rights Reserved.`
            : `© ${toNepaliNum(new Date().getFullYear())} ${hospitalName}। सर्वाधिकार सुरक्षित।`
          )}
        </p>
        
        <div className="footer-developed-by">
           <span>{t("developedBy")}</span>
        </div>
      </div>
    </footer>
  );
}
