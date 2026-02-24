"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";

export function FeedbackForm() {
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
          Thank You!
        </h4>
        <p className="text-center text-slate-500 text-sm">
          Your feedback has been received. We appreciate your input.
        </p>
        <button onClick={() => setSubmitted(false)} className="mx-auto block mt-4 text-blue-600 font-bold text-sm">
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-card-v3">
      <div className="feedback-header-v3">
        <h3 className="feedback-title-v3">
          Feedback & Suggestion
        </h3>
        <p className="feedback-desc-v3 text-slate-500 text-sm mb-6">
          Let us know how we can improve our services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
            <User size={14} /> Name
          </div>
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Your Name"
            required
          />
        </div>

        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
            <MessageSquare size={14} /> Your Feedback
          </div>
          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            placeholder="Write here..."
            required
          />
        </div>

        <button type="submit" disabled={loading} className="feedback-submit-btn-v3">
          {loading ? (
            <div className="spinner-small border-white"></div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send size={16} /> Send Feedback
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
