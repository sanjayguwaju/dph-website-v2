import Link from "next/link";

export function AboutUs({ aboutText }: { aboutText?: string | null }) {
  const text =
    aboutText ||
    "यो अस्पताल सरकारी स्वास्थ्य सेवा प्रदान गर्ने एक महत्त्वपूर्ण संस्था हो। यहाँ विभिन्न स्वास्थ्य सेवाहरू उपलब्ध छन् जसले जनताको स्वास्थ्य सुनिश्चित गर्दछ।";

  return (
    <section className="about-section">
      <div className="section-header">
        <h2 className="section-heading">🏛️ हाम्रोबारे</h2>
        <Link href="/about" className="section-view-all">
          थप जानकारी →
        </Link>
      </div>
      <div className="about-content">
        <p className="about-text">{text}</p>
      </div>
    </section>
  );
}
