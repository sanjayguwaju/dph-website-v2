"use client";

import { useState } from "react";
import { Calendar, User, Phone, Mail, Building2, Send, CheckCircle2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function AppointmentForm() {
  const t = useTranslations("appointments");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const departments = [
    { id: "general", label: locale === "ne" ? "जनरल मेडिसिन" : "General Medicine" },
    { id: "opd", label: locale === "ne" ? "ओपीडी" : "OPD" },
    { id: "pediatrics", label: locale === "ne" ? "बाल रोग" : "Pediatrics" },
    { id: "gynecology", label: locale === "ne" ? "स्त्री रोग" : "Gynecology" },
    { id: "orthopedics", label: locale === "ne" ? "हाडजोर्नी" : "Orthopedics" },
    { id: "cardiology", label: locale === "ne" ? "मुटु रोग" : "Cardiology" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="appointment-success-v3 animate-in zoom-in duration-500">
        <div className="success-icon-wrap">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h3 className="success-title">{locale === "ne" ? "अनुरोध सफल भयो!" : "Request Submitted!"}</h3>
        <p className="success-msg">
          {locale === "ne" 
            ? "तपाईंको अपोइन्टमेन्ट अनुरोध प्राप्त भएको छ। हामी छिट्टै तपाईंसँग सम्पर्क गर्नेछौं।" 
            : "Your appointment request has been received. We will contact you shortly to confirm."}
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-v3-primary mt-6">
          {locale === "ne" ? "नयाँ अपोइन्टमेन्ट" : "New Appointment"}
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-card-v3">
      <div className="form-header-v3">
        <h2 className="form-title-v3">
          {locale === "ne" ? "अनलाइन अपोइन्टमेन्ट" : "Online Appointment"}
        </h2>
        <p className="form-desc-v3">
          {locale === "ne" 
            ? "कृपया तलका विवरणहरू भर्नुहोस् र तपाईंको भ्रमणको समय सुरक्षित गर्नुहोस्।" 
            : "Please fill in the details below to schedule your hospital visit."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="appointment-form-v3">
        <div className="form-grid-v3">
          <div className="input-field-v3">
            <label><User size={16} /> {locale === "ne" ? "पूरा नाम" : "Full Name"}</label>
            <input type="text" placeholder={locale === "ne" ? "तपाईंको नाम" : "Your Name"} required />
          </div>

          <div className="input-field-v3">
            <label><Phone size={16} /> {locale === "ne" ? "फोन नम्बर" : "Phone Number"}</label>
            <input type="tel" placeholder="98XXXXXXXX" required />
          </div>

          <div className="input-field-v3">
            <label><Building2 size={16} /> {locale === "ne" ? "विभाग छान्नुहोस्" : "Select Department"}</label>
            <select required>
              <option value="">{locale === "ne" ? "-- विभाग चयन गर्नुहोस् --" : "-- Select --"}</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.label}</option>
              ))}
            </select>
          </div>

          <div className="input-field-v3">
            <label><Calendar size={16} /> {locale === "ne" ? "रुचाइएको मिति" : "Preferred Date"}</label>
            <input type="date" required />
          </div>
        </div>

        <div className="input-field-v3 full-width">
          <label>{locale === "ne" ? "विवरण / समस्या (वैकल्पिक)" : "Detail / Message (Optional)"}</label>
          <textarea rows={3} placeholder={locale === "ne" ? "तपाईंको सन्देश..." : "Your message..."}></textarea>
        </div>

        <button type="submit" disabled={loading} className="form-submit-btn-v3">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="spinner-small"></div> {locale === "ne" ? "पठाउँदै..." : "Sending..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
               <Send size={18} /> {locale === "ne" ? "अनुरोध पठाउनुहोस्" : "Send Request"}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
