"use client";
import { useState } from "react";
import Link from "next/link";

export function FooterTabs() {
  const [activeTab, setActiveTab] = useState("province");

  const PROVINCE_LINKS = [
    { label: "Office of Chief Minister", href: "https://ocmcm.gandaki.gov.np" },
    { label: "Ministry of Finance", href: "https://mofa.gandaki.gov.np" },
    { label: "Ministry of Water Resources", href: "https://mowr.gandaki.gov.np" },
    { label: "Public Service Commission", href: "https://ppsc.gandaki.gov.np" },
    { label: "Gandaki University", href: "https://gandakiuniversity.edu.np" },
    { label: "Provincial Tax Office", href: "https://pta.gandaki.gov.np" },
    { label: "Office of Auditor General", href: "https://oag.gandaki.gov.np" },
    { label: "Provincial Assembly", href: "https://assembly.gandaki.gov.np" },
  ];

  const FEDERAL_LINKS = [
    { label: "Ministry of Health", href: "https://mohp.gov.np" },
    { label: "Department of Health Services", href: "https://dohs.gov.np" },
    { label: "Nepal Government", href: "https://nepal.gov.np" },
  ];

  const OTHER_LINKS = [
    { label: "Department of National ID", href: "https://donidcr.gov.np" },
    { label: "Public Service Commission", href: "https://psc.gov.np" },
  ];

  const TABS = [
    { id: "province", label: "Province" },
    { id: "federal", label: "Federal" },
    { id: "other", label: "Other" },
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
