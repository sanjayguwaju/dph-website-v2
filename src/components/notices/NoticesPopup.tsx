"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";
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
      aria-label={tn("importantNotice")}
      className="np-overlay"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("np-overlay")) closePopup();
      }}
    >
      <div className="np-card">

        {/* ── Top header bar: title + close button ── */}
        <div className="np-header">
          <div className="np-header-left">
            <span className="np-tag">{tn("importantNotice")}</span>
            {total > 1 && (
              <span className="np-counter">{current + 1} / {total}</span>
            )}
          </div>
          <button
            className="np-close-btn"
            onClick={closePopup}
            aria-label={tc("closeMenu") || "Close"}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Notice title strip ── */}
        <div className="np-title-bar">
          <h2 className="np-title-text">{notice.title}</h2>
        </div>

        {/* ── Document Image / Text Body ── */}
        <div className="np-body">
          {imgSrc ? (
            <div className="np-image-wrap">
              <Image
                src={imgSrc}
                alt={image?.alt || notice.title}
                width={820}
                height={1160}
                className="np-document-img"
                priority
                unoptimized={!!externalImage}
              />
            </div>
          ) : (
            <div className="np-text-body">
              {notice.description && (
                <p className="np-text-desc">{notice.description}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Footer: nav dots + CTA buttons ── */}
        <div className="np-footer">

          {/* Prev / Dots / Next */}
          {total > 1 ? (
            <div className="np-nav-row">
              <button
                className="np-nav-arrow"
                onClick={prevNotice}
                aria-label={tc("prev") || "Previous"}
              >
                <ChevronLeft size={14} />
              </button>

              <div className="np-dots">
                {notices.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`np-dot${i === current ? " active" : ""}`}
                    aria-label={`Notice ${i + 1}`}
                  />
                ))}
              </div>

              <button
                className="np-nav-arrow"
                onClick={nextNotice}
                aria-label={tc("next") || "Next"}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* CTA row */}
          <div className="np-cta-row">
            <Link
              href={`/notices/${notice.id}`}
              className="np-btn np-btn-primary"
              onClick={closePopup}
            >
              <ExternalLink size={14} />
              <span>{tc("readMore")?.replace(" →", "") || "विस्तृत"}</span>
            </Link>

            {fileUrl && (
              <a
                href={fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="np-btn np-btn-secondary"
              >
                <Download size={14} />
                <span>{tc("download") || "PDF"}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
