"use client";

import { Phone } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";

interface EmergencyFloatingButtonProps {
  phone?: string;
}

const SCROLL_THRESHOLD = 400;

export function EmergencyFloatingButton({ phone = "068-520101" }: EmergencyFloatingButtonProps) {
  const { isScrolled } = useScroll(SCROLL_THRESHOLD);

  return (
    <div
      className={`emergency-float-wrap ${isScrolled ? 'visible' : ''}`}
      role="complementary"
      aria-label="Emergency contact"
    >
      <a
        href={`tel:${phone}`}
        className="emergency-float-btn"
        aria-label={`Call emergency number ${phone}`}
        title={`Emergency: ${phone}`}
      >
        <div className="btn-icon-pulse" aria-hidden="true">
          <Phone size={24} fill="currentColor" />
        </div>
        <div className="emergency-labels">
          <span className="emergency-tag">Emergency</span>
          <span className="emergency-num" aria-hidden="true">{phone}</span>
        </div>
      </a>
    </div>
  );
}
