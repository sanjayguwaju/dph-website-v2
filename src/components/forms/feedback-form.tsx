"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, User, Mail } from "lucide-react";
import { useLocale } from "next-intl";

export function FeedbackForm() {
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="feedback-success-v3 animate-in zoom-in">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={48} className="text-blue-500" />
        </div>
        <h4 className="text-center font-black text-xl text-slate-800 mb-2">
          {locale === "ne" ? "धन्यवाद!" : "Thank You!"}
        </h4>
        <p className="text-center text-slate-500 text-sm">
          {locale === "ne" 
            ? "तपाईंको प्रतिक्रिया प्राप्त भयो। हामी यसलाई सुधार गर्न प्रयोग गर्नेछौं।"
            : "Your feedback has been received. We appreciate your input."}
        </p>
        <button onClick={() => setSubmitted(false)} className="mx-auto block mt-4 text-blue-600 font-bold text-sm">
          {locale === "ne" ? "अर्को प्रतिक्रिया" : "Send Another"}
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-card-v3">
      <div className="feedback-header-v3">
        <h3 className="feedback-title-v3">
          {locale === "ne" ? "प्रतिक्रिया र सुझाव" : "Feedback & Suggestion"}
        </h3>
        <p className="feedback-desc-v3 text-slate-500 text-sm mb-6">
          {locale === "ne" 
             ? "हामीलाई कसरी राम्रो गर्ने बताउनुहोस्।"
             : "Let us know how we can improve our services."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
             <User size={14} /> {locale === "ne" ? "नाम" : "Name"}
          </div>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder={locale === "ne" ? "तपाईंको नाम" : "Your Name"}
            required 
          />
        </div>

        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
             <MessageSquare size={14} /> {locale === "ne" ? "तपाईंको सुझाव" : "Your Feedback"}
          </div>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            placeholder={locale === "ne" ? "यहाँ लेख्नुहोस्..." : "Write here..."}
            required 
          />
        </div>

        <button type="submit" disabled={loading} className="feedback-submit-btn-v3">
          {loading ? (
             <div className="spinner-small border-white"></div>
          ) : (
            <div className="flex items-center justify-center gap-2">
               <Send size={16} /> {locale === "ne" ? "पठाउनुहोस्" : "Send Feedback"}
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
