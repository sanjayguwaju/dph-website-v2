"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "suggestion",
    message: "",
  });

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
        setError(data.error || "Failed to submit feedback");
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
        <h3 className="feedback-title-v3">Feedback & Suggestion</h3>
        <p className="feedback-desc-v3 text-slate-500 text-sm mb-6">
          Let us know how we can improve our services.
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
            <User size={14} /> Name *
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Your Name"
            required
          />
        </div>

        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
            <MessageSquare size={14} /> Feedback Type *
          </div>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          >
            <option value="suggestion">Suggestion</option>
            <option value="complaint">Complaint</option>
            <option value="appreciation">Appreciation</option>
            <option value="general">General Feedback</option>
          </select>
        </div>

        <div className="input-group-v3">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-sm">
            <MessageSquare size={14} /> Your Feedback *
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
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
