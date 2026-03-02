"use client";

import { useState, useEffect } from "react";
import { Calendar, User, Phone, Building2, Send, CheckCircle2, Mail } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug?: string;
}

import { getLocaleClient } from "@/utils/locale-client";

export function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState("ne");

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    department: "",
    appointmentDate: "",
    message: "",
  });

  useEffect(() => {
    setLocale(getLocaleClient());
  }, []);

  const labels = {
    formTitle: locale === "ne" ? "अनलाइन टिकट / नियुक्ति" : "Online Appointment",
    formDesc: locale === "ne" ? "अस्पताल भ्रमणको तालिका बनाउन कृपया तलका विवरणहरू भर्नुहोस्।" : "Please fill in the details below to schedule your hospital visit.",
    fullName: locale === "ne" ? "पूरा नाम *" : "Full Name *",
    namePlaceholder: locale === "ne" ? "तपाईंको नाम" : "Your Name",
    phoneLabel: locale === "ne" ? "फोन नम्बर *" : "Phone Number *",
    phonePlaceholder: locale === "ne" ? "९८XXXXXXXX" : "98XXXXXXXX",
    emailLabel: locale === "ne" ? "इमेल (वैकल्पिक)" : "Email (Optional)",
    emailPlaceholder: locale === "ne" ? "तपाईंको@email.com" : "your@email.com",
    departmentLabel: locale === "ne" ? "विभाग चयन गर्नुहोस् *" : "Select Department *",
    selectPlaceholder: locale === "ne" ? (servicesLoading ? "लोड हुँदैछ..." : "-- चयन गर्नुहोस् --") : (servicesLoading ? "Loading..." : "-- Select --"),
    dateLabel: locale === "ne" ? "रुचाइएको मिति *" : "Preferred Date *",
    messageLabel: locale === "ne" ? "विवरण / सन्देश (वैकल्पिक)" : "Detail / Message (Optional)",
    messagePlaceholder: locale === "ne" ? "तपाईंको सन्देश..." : "Your message...",
    submitBtn: locale === "ne" ? "अनुरोध पठाउनुहोस्" : "Send Request",
    sending: locale === "ne" ? "पठाउँदै..." : "Sending...",
    successTitle: locale === "ne" ? "अनुरोध पेश गरियो!" : "Request Submitted!",
    successMsg: locale === "ne" ? "तपाईंको नियुक्ति अनुरोध प्राप्त भएको छ। हामी छिट्टै पुष्टिको लागि तपाईंलाई सम्पर्क गर्नेछौं।" : "Your appointment request has been received. We will contact you shortly to confirm.",
    newBtn: locale === "ne" ? "नयाँ नियुक्ति" : "New Appointment",
    errorSubmit: locale === "ne" ? "नियुक्ति पेश गर्न असफल भयो" : "Failed to submit appointment",
    errorNetwork: locale === "ne" ? "नेटवर्क त्रुटि। कृपया फेरि प्रयास गर्नुहोस।" : "Network error. Please try again.",
  };

  // Fetch services dynamically
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services?limit=100&isActive=true");
        if (res.ok) {
          const data = await res.json();
          setServices(data.docs || []);
        }
      } catch (err) {
        // Silently fail - error is not user-facing
      } finally {
        setServicesLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          patientName: "",
          phone: "",
          email: "",
          department: "",
          appointmentDate: "",
          message: "",
        });
      } else {
        setError(data.error || labels.errorSubmit);
      }
    } catch (err) {
      setError(labels.errorNetwork);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (submitted) {
    return (
      <div className="appointment-success-v3 animate-in zoom-in duration-500">
        <div className="success-icon-wrap">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h3 className="success-title">{labels.successTitle}</h3>
        <p className="success-msg">
          {labels.successMsg}
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-v3-primary mt-6">
          {labels.newBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-card-v3">
      <div className="form-header-v3">
        <h2 className="form-title-v3">{labels.formTitle}</h2>
        <p className="form-desc-v3">
          {labels.formDesc}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="appointment-form-v3">
        <div className="form-grid-v3">
          <div className="input-field-v3">
            <label><User size={16} /> {labels.fullName}</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder={labels.namePlaceholder}
              required
            />
          </div>

          <div className="input-field-v3">
            <label><Phone size={16} /> {labels.phoneLabel}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={labels.phonePlaceholder}
              required
            />
          </div>

          <div className="input-field-v3">
            <label><Mail size={16} /> {labels.emailLabel}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={labels.emailPlaceholder}
            />
          </div>

          <div className="input-field-v3">
            <label><Building2 size={16} /> {labels.departmentLabel}</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={servicesLoading}
            >
              <option value="">{labels.selectPlaceholder}</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-field-v3">
            <label><Calendar size={16} /> {labels.dateLabel}</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="input-field-v3 full-width">
          <label>{labels.messageLabel}</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder={labels.messagePlaceholder}
          />
        </div>

        <button type="submit" disabled={loading} className="form-submit-btn-v3">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="spinner-small"></div> {labels.sending}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send size={18} /> {labels.submitBtn}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
