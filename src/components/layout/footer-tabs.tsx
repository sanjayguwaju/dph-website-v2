"use client";
import { useState } from "react";
import Link from "next/link";

export function FooterTabs({ locale = "ne" }: { locale?: string }) {
  const [activeTab, setActiveTab] = useState("province");

  const PROVINCE_LINKS = [
    { label: locale === "ne" ? "मुख्यमन्त्रीको कार्यालय" : "Office of Chief Minister", href: "https://ocmcm.gandaki.gov.np" },
    { label: locale === "ne" ? "अर्थ मन्त्रालय" : "Ministry of Finance", href: "https://mofa.gandaki.gov.np" },
    { label: locale === "ne" ? "जलस्रोत मन्त्रालय" : "Ministry of Water Resources", href: "https://mowr.gandaki.gov.np" },
    { label: locale === "ne" ? "लोक सेवा आयोग" : "Public Service Commission", href: "https://ppsc.gandaki.gov.np" },
    { label: locale === "ne" ? "गण्डकी विश्वविद्यालय" : "Gandaki University", href: "https://gandakiuniversity.edu.np" },
    { label: locale === "ne" ? "प्रादेशिक कर कार्यालय" : "Provincial Tax Office", href: "https://pta.gandaki.gov.np" },
    { label: locale === "ne" ? "महालेखा परीक्षकको कार्यालय" : "Office of Auditor General", href: "https://oag.gandaki.gov.np" },
    { label: locale === "ne" ? "प्रदेश सभा" : "Provincial Assembly", href: "https://assembly.gandaki.gov.np" },
  ];

  const FEDERAL_LINKS = [
    { label: locale === "ne" ? "स्वास्थ्य मन्त्रालय" : "Ministry of Health", href: "https://mohp.gov.np" },
    { label: locale === "ne" ? "स्वास्थ्य सेवा विभाग" : "Department of Health Services", href: "https://dohs.gov.np" },
    { label: locale === "ne" ? "नेपाल सरकार" : "Nepal Government", href: "https://nepal.gov.np" },
  ];

  const OTHER_LINKS = [
    { label: locale === "ne" ? "राष्ट्रिय परिचयपत्र विभाग" : "Department of National ID", href: "https://donidcr.gov.np" },
    { label: locale === "ne" ? "लोक सेवा आयोग (केन्द्र)" : "Public Service Commission", href: "https://psc.gov.np" },
  ];

  const TABS = [
    { id: "province", label: locale === "ne" ? "प्रदेश तर्फ" : "Province" },
    { id: "federal", label: locale === "ne" ? "संघ तर्फ" : "Federal" },
    { id: "other", label: locale === "ne" ? "अन्य" : "Other" },
  ];

  const getLinks = () => {
    switch (activeTab) {
      case "province": return PROVINCE_LINKS;
      case "federal": return FEDERAL_LINKS;
      case "other": return OTHER_LINKS;
      default: return [];
    }
  };

  return (
    <div className="footer-tabs-container">
      <div className="footer-tabs-header">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`footer-tab-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ul className="footer-tab-links-list">
        {getLinks().map((link, i) => (
          <li key={i}>
            <Link href={link.href} target="_blank" rel="noopener noreferrer" className="footer-tab-link-item">
              <span className="footer-link-icon">🔗</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
