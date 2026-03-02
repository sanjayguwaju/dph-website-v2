"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { getLocaleClient } from "@/utils/locale-client";

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState("ne");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "suggestion",
    message: "",
  });

  useEffect(() => {
    setLocale(getLocaleClient());
  }, []);

  const labels = {
    thanks: locale === "ne" ? "धन्यवाद!" : "Thank You!",
    successMsg: locale === "ne" ? "तपाईंको प्रतिक्रिया प्राप्त भएको छ। हामी तपाईंको लगानीको कदर गर्छौं।" : "Your feedback has been received. We appreciate your input.",
    sendAnother: locale === "ne" ? "अर्को पठाउनुहोस्" : "Send Another",
    title: locale === "ne" ? "प्रतिक्रिया र सुझाव" : "Feedback & Suggestion",
    desc: locale === "ne" ? "हामी कसरी हाम्रा सेवाहरू सुधार गर्न सक्छौं हामीलाई थाहा दिनुहोस्।" : "Let us know how we can improve our services.",
    nameLabel: locale === "ne" ? "नाम *" : "Name *",
    namePlaceholder: locale === "ne" ? "तपाईंको नाम" : "Your Name",
    typeLabel: locale === "ne" ? "प्रतिक्रियाको प्रकार *" : "Feedback Type *",
    msgLabel: locale === "ne" ? "तपाईंको प्रतिक्रिया *" : "Your Feedback *",
    msgPlaceholder: locale === "ne" ? "यहाँ लेख्नुहोस्..." : "Write here...",
    submitBtn: locale === "ne" ? "प्रतिक्रिया पठाउनुहोस्" : "Send Feedback",
    errorSubmit: locale === "ne" ? "प्रतिक्रिया पेश गर्न असफल भयो" : "Failed to submit feedback",
    errorNetwork: locale === "ne" ? "नेटवर्क त्रुटि। कृपया फेरि प्रयास गर्नुहोस।" : "Network error. Please try again.",
    types: {
      suggestion: locale === "ne" ? "सुझाव" : "Suggestion",
      complaint: locale === "ne" ? "गुनासो" : "Complaint",
      appreciation: locale === "ne" ? "प्रशंसा" : "Appreciation",
      general: locale === "ne" ? "सामान्य प्रतिक्रिया" : "General Feedback",
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          type: "suggestion",
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
      <div className="feedback-success-v3 animate-in zoom-in">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={48} className="text-blue-500" />
        </div>
        <h4 className="text-center font-black text-xl text-slate-800 mb-2">
          {labels.thanks}
        </h4>
        <p className="text-center text-slate-500 text-sm">
          {labels.successMsg}
        </p>
        <button onClick={() => setSubmitted(false)} className="mx-auto block mt-4 text-blue-600 font-bold text-sm">
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-card-v3">
      <div className="feedback-header-v3">
        <h3 className="feedback-title-v3">{labels.title}</h3>
        <p className="feedback-desc-v3 text-slate-500 text-sm mb-6">
          {labels.desc}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
            <User size={14} /> {labels.nameLabel}
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder={labels.namePlaceholder}
            required
          />
        </div>

        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
            <MessageSquare size={14} /> {labels.typeLabel}
          </div>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          >
            <option value="suggestion">{labels.types.suggestion}</option>
            <option value="complaint">{labels.types.complaint}</option>
            <option value="appreciation">{labels.types.appreciation}</option>
            <option value="general">{labels.types.general}</option>
          </select>
        </div>

        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
            <MessageSquare size={14} /> {labels.msgLabel}
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            placeholder={labels.msgPlaceholder}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="feedback-submit-btn-v3">
          {loading ? (
            <div className="spinner-small border-white"></div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send size={16} /> {labels.submitBtn}
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
