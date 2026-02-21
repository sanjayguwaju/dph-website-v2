"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ExternalLink, Download } from "lucide-react";
import type { Notice } from "@/payload-types";
import { useTranslations } from "next-intl";

interface NoticesPopupProps {
  notices: Notice[];
}

export function NoticesPopup({ notices }: NoticesPopupProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const tc = useTranslations("common");
  const tn = useTranslations("news");

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
  const externalImage = (notice as any).externalImage;
  const file = notice.file && typeof notice.file === "object" ? notice.file : null;
  const total = notices.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="notice-popup-overlay"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("notice-popup-overlay")) closePopup();
      }}
    >
      <div className="notice-popup-frame">
        <div className="notice-popup-header">
          <div className="notice-popup-title-group">
            <span className="notice-popup-tag">{tn("importantNotice")}</span>
            {total > 1 && (
              <p className="notice-popup-counter">
                {current + 1} / {total}
              </p>
            )}
          </div>
          <button
            className="notice-popup-close-btn"
            onClick={closePopup}
            aria-label={tc("closeMenu") || "Close"}
          >
            <X size={20} />
          </button>
        </div>

        <div className="notice-popup-scrollarea">
          {(image?.url || externalImage) ? (
            <div className="notice-popup-image-container">
              <Image
                src={image?.url || externalImage}
                alt={image?.alt || notice.title}
                width={1200}
                height={1600}
                className="notice-popup-main-image"
                priority
              />
            </div>
          ) : (

            <div className="notice-popup-text-container">
              <h2 className="notice-popup-main-title">{notice.title}</h2>
              {notice.description && <div className="notice-popup-main-desc">{notice.description}</div>}
            </div>
          )}
        </div>

        <div className="notice-popup-actions">
          <div className="notice-popup-nav-group">
            {total > 1 && (
              <>
                <button 
                  className="notice-popup-nav-btn" 
                  onClick={prevNotice}
                  aria-label={tc("prev")}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="notice-popup-dots-v3">
                  {notices.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`notice-popup-dot-v3${i === current ? " active" : ""}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button 
                  className="notice-popup-nav-btn" 
                  onClick={nextNotice}
                  aria-label={tc("next")}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          
          <div className="notice-popup-cta-row">
            <Link 
              href={`/notices/${notice.id}`} 
              className="notice-popup-link-btn"
              onClick={closePopup}
            >
              <ExternalLink size={16} />
              <span>{tc("readMore")?.replace(" →", "") || "Details"}</span>
            </Link>
            
            {file?.url && (
              <a
                href={file.url}
                download
                className="notice-popup-link-btn secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={16} />
                <span>{tc("download") || "PDF"}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

