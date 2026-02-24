"use client";

import { useState } from "react";
import { Calendar, User, Phone, Building2, Send, CheckCircle2 } from "lucide-react";

export function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const departments = [
    { id: "general", label: "General Medicine" },
    { id: "opd", label: "OPD" },
    { id: "pediatrics", label: "Pediatrics" },
    { id: "gynecology", label: "Gynecology" },
    { id: "orthopedics", label: "Orthopedics" },
    { id: "cardiology", label: "Cardiology" },
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
        <h2 className="form-title-v3">
          Online Appointment
        </h2>
        <p className="form-desc-v3">
          Please fill in the details below to schedule your hospital visit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="appointment-form-v3">
        <div className="form-grid-v3">
          <div className="input-field-v3">
            <label><User size={16} /> Full Name</label>
            <input type="text" placeholder="Your Name" required />
          </div>

          <div className="input-field-v3">
            <label><Phone size={16} /> Phone Number</label>
            <input type="tel" placeholder="98XXXXXXXX" required />
          </div>

          <div className="input-field-v3">
            <label><Building2 size={16} /> Select Department</label>
            <select required>
              <option value="">-- Select --</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.label}</option>
              ))}
            </select>
          </div>

          <div className="input-field-v3">
            <label><Calendar size={16} /> Preferred Date</label>
            <input type="date" required />
          </div>
        </div>

        <div className="input-field-v3 full-width">
          <label>Detail / Message (Optional)</label>
          <textarea rows={3} placeholder="Your message..."></textarea>
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
