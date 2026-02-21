"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function FooterTabs() {
  const t = useTranslations("footer");
  const tl = useTranslations("footerLinks");
  const [activeTab, setActiveTab] = useState("province");

  const PROVINCE_LINKS = [
    { label: tl("ocmcm"), href: "https://ocmcm.gandaki.gov.np" },
    { label: tl("mofa"), href: "https://mofa.gandaki.gov.np" },
    { label: tl("mowr"), href: "https://mowr.gandaki.gov.np" },
    { label: tl("ppsc"), href: "https://ppsc.gandaki.gov.np" },
    { label: tl("gu"), href: "https://gandakiuniversity.edu.np" },
    { label: tl("pta"), href: "https://pta.gandaki.gov.np" },
    { label: tl("oag"), href: "https://oag.gandaki.gov.np" },
    { label: tl("assembly"), href: "https://assembly.gandaki.gov.np" },
  ];

  const FEDERAL_LINKS = [
    { label: tl("mohp"), href: "https://mohp.gov.np" },
    { label: tl("dohs"), href: "https://dohs.gov.np" },
    { label: tl("nepalGov"), href: "https://nepal.gov.np" },
  ];

  const OTHER_LINKS = [
    { label: tl("donidcr"), href: "https://donidcr.gov.np" },
    { label: tl("psc"), href: "https://psc.gov.np" },
  ];

  const TABS = [
    { id: "province", label: t("province") },
    { id: "federal", label: t("federal") },
    { id: "other", label: t("other") },
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
