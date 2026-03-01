"use client";

import { useState, useEffect } from "react";
import { Calendar, User, Phone, Building2, Send, CheckCircle2, Mail } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug?: string;
}

export function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    department: "",
    appointmentDate: "",
    message: "",
  });

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
        setError(data.error || "Failed to submit appointment");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
        <h3 className="success-title">Request Submitted!</h3>
        <p className="success-msg">
          Your appointment request has been received. We will contact you shortly to confirm.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-v3-primary mt-6">
          New Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-card-v3">
      <div className="form-header-v3">
        <h2 className="form-title-v3">Online Appointment</h2>
        <p className="form-desc-v3">
          Please fill in the details below to schedule your hospital visit.
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
            <label><User size={16} /> Full Name *</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="input-field-v3">
            <label><Phone size={16} /> Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="98XXXXXXXX"
              required
            />
          </div>

          <div className="input-field-v3">
            <label><Mail size={16} /> Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div className="input-field-v3">
            <label><Building2 size={16} /> Select Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={servicesLoading}
            >
              <option value="">{servicesLoading ? "Loading..." : "-- Select --"}</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-field-v3">
            <label><Calendar size={16} /> Preferred Date *</label>
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
          <label>Detail / Message (Optional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Your message..."
          />
        </div>

        <button type="submit" disabled={loading} className="form-submit-btn-v3">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="spinner-small"></div> Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send size={18} /> Send Request
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
