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
          {s.mapEmbedUrl ? (
            <iframe
              src={s.mapEmbedUrl}
              width="100%"
              height="285"
              style={{ border: '1px solid #ddd', borderRadius: "2px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospital Location Map"
            />
          ) : (
            <div className="hospital-footer-map-placeholder">
              📍 Google Maps embed will appear here
            </div>
          )}
        </div>

        {/* Column 3: Contact Details */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">
            {t("contactInfo")}
          </h3>
          <div className="hospital-footer-contact">
             <p className="footer-contact-org" style={{ color: 'var(--brand-red)', fontWeight: 700 }}>{govText}</p>
             <p className="footer-contact-org" style={{ color: 'var(--brand-red)', fontWeight: 700 }}>{ministryText}</p>
             <p className="hospital-footer-org" style={{ color: 'var(--brand-red)', fontWeight: 800, fontSize: '1.1rem' }}>
               {hospitalName}
             </p>
            
            {address && (
              <p style={{ fontWeight: 600 }}>
                {address}
              </p>
            )}

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {s.contactPhone && (
                <p>
                  <span className="footer-label">📞 {ta("administration")}</span> <a href={`tel:${s.contactPhone}`}>{s.contactPhone}</a>
                  {s.emergencyNumber && (
                    <>
                      <span className="footer-label ml-2">{ta("emergency")}</span> <a href={`tel:${s.emergencyNumber}`}>{s.emergencyNumber}</a>
                    </>
                  )}
                </p>
              )}
              {s.contactEmail && (
                <p>
                  <span className="footer-label">✉️</span> <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
                </p>
              )}
              {s.siteUrl && (
                <p>
                  <span className="footer-label">🔗</span> <a href={s.siteUrl} target="_blank" rel="noopener noreferrer">
                    {s.siteUrl.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hospital-footer-bottom">
        <div className="footer-bottom-left">
          <p>
            {f.copyright || (
              locale === "en" 
              ? `© ${new Date().getFullYear()} ${hospitalName}. All Rights Reserved.`
              : `© ${toNepaliNum(new Date().getFullYear())} ${hospitalName}। सर्वाधिकार सुरक्षित।`
            )}
          </p>
        </div>
        
        <div className="footer-bottom-right">
           <span>{t("developedBy")}</span>
        </div>
      </div>
    </footer>
  );
}
