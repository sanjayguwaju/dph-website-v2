"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
import type { Notice } from "@/payload-types";

// Helper to extract string from potentially localized CMS fields
function getLocalizedValue(value: any): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return value.ne || value.en || String(value);
  }
  return String(value);
}

interface NoticesPopupProps {
  notices: Notice[];
}

export function NoticesPopup({ notices }: NoticesPopupProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const closePopup = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const nextNotice = useCallback(() => {
    setCurrent((prev) => (prev + 1) % notices.length);
  }, [notices.length]);

  const prevNotice = useCallback(() => {
    setCurrent((prev) => (prev - 1 + notices.length) % notices.length);
  }, [notices.length]);

  // Open on mount if notices exist
  useEffect(() => {
    if (notices.length > 0) {
      setOpen(true);
    }
  }, [notices.length]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
      if (e.key === "ArrowRight" && notices.length > 1) nextNotice();
      if (e.key === "ArrowLeft" && notices.length > 1) prevNotice();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closePopup, nextNotice, prevNotice, notices.length]);

  if (!open || notices.length === 0) return null;

  const notice = notices[current];
  const image = notice.image && typeof notice.image === "object" ? notice.image : null;
  const externalImage = (notice as any).externalImage as string | undefined;
  const file = notice.file && typeof notice.file === "object" ? notice.file : null;
  const externalFile = (notice as any).externalFile as string | undefined;
  const fileUrl = file?.url || externalFile;
  const imgSrc = image?.url || externalImage;
  const total = notices.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Important Notice"
      className="np-overlay"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("np-overlay")) closePopup();
      }}
    >
      <div className="notice-popup-frame group">
        <div className="notice-popup-header-v2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#dc2626] rounded-full"></div>
            <div>
              <span className="text-[10px] font-black text-[#dc2626] uppercase tracking-[0.2em] block mb-0.5">Important Notice</span>
              <h3 className="text-sm font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">{getLocalizedValue(notice.title)}</h3>
            </div>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#dc2626] hover:text-white transition-all shadow-sm"
            onClick={closePopup}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="notice-popup-scrollarea-v2 shadow-inner bg-gray-50/50">
          {(image?.url || externalImage) ? (
            <div className="relative w-full">
              <img
                src={image?.url || externalImage}
                alt={image?.alt || getLocalizedValue(notice.title)}
                className="w-full h-auto block object-contain max-h-[70vh]"
              />
            </div>
          ) : (
            <div className="p-10 md:p-16 text-center">
              <div className="w-20 h-20 bg-red-50 text-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🪧</div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{getLocalizedValue(notice.title)}</h2>
              {notice.description && (
                <div className="text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto prose prose-red">
                  {getLocalizedValue(notice.description)}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {total > 1 && (
              <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-100">
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-gray-600 shadow-sm hover:text-[#dc2626] transition-colors"
                  onClick={prevNotice}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-gray-400 w-10 text-center">{current + 1} / {total}</span>
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-gray-600 shadow-sm hover:text-[#dc2626] transition-colors"
                  onClick={nextNotice}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href={`/notices/${notice.id}`}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
              onClick={closePopup}
            >
              <ExternalLink size={14} />
              Details
            </Link>

            {fileUrl && (
              <a
                href={fileUrl}
                download
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#dc2626] text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={14} />
                PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
