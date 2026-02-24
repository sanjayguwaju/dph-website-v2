"use client";

import { Phone, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function EmergencyFloatingButton({ phone = "068-520101" }: { phone?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`emergency-float-wrap ${visible ? 'visible' : ''}`}>
       <a href={`tel:${phone}`} className="emergency-float-btn">
          <div className="btn-icon-pulse">
             <Phone size={24} fill="currentColor" />
          </div>
          <div className="emergency-labels">
             <span className="emergency-tag">Emergency</span>
             <span className="emergency-num">{phone}</span>
          </div>
       </a>
    </div>
  );
}
