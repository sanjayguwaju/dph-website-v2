import Link from "next/link";
import { getSiteSettings } from "@/lib/queries/globals";

export async function Footer() {
  const settings = await getSiteSettings();
  const s = settings as any;

  const importantLinks = [
    { label: "सूचना", href: "/notices" },
    { label: "समाचार", href: "/news" },
    { label: "सेवाहरू", href: "/services" },
    { label: "कर्मचारी", href: "/staff" },
    { label: "फोटो ग्यालरी", href: "/gallery/photos" },
    { label: "भिडियो ग्यालरी", href: "/gallery/videos" },
    { label: "हाम्रोबारे", href: "/about" },
    { label: "सम्पर्क", href: "/contact" },
  ];

  return (
    <footer className="hospital-footer">
      <div className="hospital-footer-grid">
        {/* Column 1: Important Links */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">महत्त्वपूर्ण लिङ्कहरू</h3>
          <ul className="hospital-footer-links">
            {importantLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hospital-footer-link">
                  › {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Map Embed */}
        <div className="hospital-footer-col">
          <h3 className="hospital-footer-heading">कार्यालयको अवस्थिति</h3>
          {s.mapEmbedUrl ? (
            <iframe
              src={s.mapEmbedUrl}
              width="100%"
              height="220"
              style={{ border: 0, borderRadius: "6px" }}
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
          <h3 className="hospital-footer-heading">सम्पर्क विवरण</h3>
          <div className="hospital-footer-contact">
            {s.hospitalNameNe && <p className="hospital-footer-org">{s.hospitalNameNe}</p>}
            {s.address && (
              <p>
                <span className="footer-label">📍 ठेगाना:</span> {s.address}
              </p>
            )}
            {s.contactPhone && (
              <p>
                <span className="footer-label">📞 फोन:</span>{" "}
                <a href={`tel:${s.contactPhone}`}>{s.contactPhone}</a>
              </p>
            )}
            {s.emergencyNumber && (
              <p>
                <span className="footer-label">🚨 आपतकालीन:</span>{" "}
                <a href={`tel:${s.emergencyNumber}`} className="emergency-link">
                  {s.emergencyNumber}
                </a>
              </p>
            )}
            {s.contactEmail && (
              <p>
                <span className="footer-label">✉️ इमेल:</span>{" "}
                <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
              </p>
            )}
            {s.siteUrl && (
              <p>
                <span className="footer-label">🌐 वेबसाइट:</span>{" "}
                <a href={s.siteUrl} target="_blank" rel="noopener noreferrer">
                  {s.siteUrl.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hospital-footer-bottom">
        <p>
          © {new Date().getFullYear()} {s.hospitalNameNe || s.hospitalNameEn || "District Hospital"}
          . सर्वाधिकार सुरक्षित।
        </p>
        <div className="hospital-footer-bottom-links">
          <Link href="/privacy">गोपनीयता नीति</Link>
          <Link href="/sitemap">साइटम्याप</Link>
          <Link href="/contact">सम्पर्क</Link>
        </div>
      </div>
    </footer>
  );
}
