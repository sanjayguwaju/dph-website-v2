import { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries/globals";
import Link from "next/link";

export const metadata: Metadata = {
  title: "हाम्रोबारे | About Us",
  description: "जिल्ला अस्पतालको परिचय, उद्देश्य, र इतिहास",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const s = settings as any;

  return (
    <main className="page-container">
      <div className="page-hero">
        <h1 className="page-hero-title">🏛️ हाम्रोबारे</h1>
        <p className="page-hero-sub">
          {s.hospitalNameNe || "जिल्ला अस्पताल"} — {s.taglineNe || "स्वास्थ्य सेवा, सबैका लागि"}
        </p>
      </div>

      <div className="about-page-content">
        <section className="about-page-section">
          <h2 className="about-page-heading">परिचय</h2>
          <p className="about-page-text">
            {s.aboutUs ||
              `${s.hospitalNameNe || "यो अस्पताल"} सरकारी स्वास्थ्य सेवा प्रदान गर्ने एक महत्त्वपूर्ण संस्था हो। यहाँ विभिन्न स्वास्थ्य सेवाहरू उपलब्ध छन् जसले जनताको स्वास्थ्य सुनिश्चित गर्दछ।`}
          </p>
        </section>

        <section className="about-page-section">
          <h2 className="about-page-heading">सम्पर्क जानकारी</h2>
          <div className="about-contact-grid">
            {s.address && (
              <div className="about-contact-item">
                <span className="about-contact-icon">📍</span>
                <div>
                  <p className="about-contact-label">ठेगाना</p>
                  <p className="about-contact-value">{s.address}</p>
                </div>
              </div>
            )}
            {s.contactPhone && (
              <div className="about-contact-item">
                <span className="about-contact-icon">📞</span>
                <div>
                  <p className="about-contact-label">फोन</p>
                  <a href={`tel:${s.contactPhone}`} className="about-contact-value">
                    {s.contactPhone}
                  </a>
                </div>
              </div>
            )}
            {s.emergencyNumber && (
              <div className="about-contact-item">
                <span className="about-contact-icon">🚨</span>
                <div>
                  <p className="about-contact-label">आपतकालीन</p>
                  <a
                    href={`tel:${s.emergencyNumber}`}
                    className="about-contact-value emergency-link"
                  >
                    {s.emergencyNumber}
                  </a>
                </div>
              </div>
            )}
            {s.contactEmail && (
              <div className="about-contact-item">
                <span className="about-contact-icon">✉️</span>
                <div>
                  <p className="about-contact-label">इमेल</p>
                  <a href={`mailto:${s.contactEmail}`} className="about-contact-value">
                    {s.contactEmail}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {s.mapEmbedUrl && (
          <section className="about-page-section">
            <h2 className="about-page-heading">अवस्थिति</h2>
            <iframe
              src={s.mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospital Location"
            />
          </section>
        )}

        <div className="about-page-links">
          <Link href="/services" className="page-nav-btn">
            हाम्रा सेवाहरू →
          </Link>
          <Link href="/staff" className="page-nav-btn">
            कर्मचारीहरू →
          </Link>
          <Link href="/notices" className="page-nav-btn">
            सूचनाहरू →
          </Link>
        </div>
      </div>
    </main>
  );
}
