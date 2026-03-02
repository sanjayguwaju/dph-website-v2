"use client";

import { Phone } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";

interface EmergencyFloatingButtonProps {
  phone?: string;
}

const SCROLL_THRESHOLD = 400;

export function EmergencyFloatingButton({ phone = "068-520101", locale = "ne" }: EmergencyFloatingButtonProps & { locale?: string }) {
  const { isScrolled } = useScroll(SCROLL_THRESHOLD);
  const label = locale === "ne" ? "आकस्मिक" : "Emergency";

  return (
    <div
      className={`emergency-float-wrap ${isScrolled ? 'visible' : ''}`}
      role="complementary"
      aria-label={locale === "ne" ? "आकस्मिक सम्पर्क" : "Emergency contact"}
    >
      <a
        href={`tel:${phone}`}
        className="emergency-float-btn"
        aria-label={locale === "ne" ? `आकस्मिक नम्बर ${phone} मा कल गर्नुहोस्` : `Call emergency number ${phone}`}
        title={`${label}: ${phone}`}
      >
        <div className="btn-icon-pulse" aria-hidden="true">
          <Phone size={24} fill="currentColor" />
        </div>
        <div className="emergency-labels">
          <span className="emergency-tag">{label}</span>
          <span className="emergency-num" aria-hidden="true">{phone}</span>
        </div>
      </a>
    </div>
  );
}
