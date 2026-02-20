"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Notice } from "@/payload-types";

const POPUP_SESSION_KEY = "notices_popup_seen";

interface NoticesPopupProps {
  notices: Notice[];
}

export function NoticesPopup({ notices }: NoticesPopupProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (notices.length === 0) return;
    const seen = sessionStorage.getItem(POPUP_SESSION_KEY);
    if (!seen) {
      setOpen(true);
      sessionStorage.setItem(POPUP_SESSION_KEY, "true");
    }
  }, [notices.length]);

  if (!open || notices.length === 0) return null;

  const notice = notices[current];
  const image = notice.image && typeof notice.image === "object" ? notice.image : null;
  const file = notice.file && typeof notice.file === "object" ? notice.file : null;
  const total = notices.length;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Notice"
      className="notices-popup-backdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("notices-popup-backdrop")) setOpen(false);
      }}
    >
      {/* Dialog box */}
      <div className="notices-popup-dialog">
        {/* Header */}
        <div className="notices-popup-header">
          <span className="notices-popup-badge">Notice</span>
          <button
            className="notices-popup-close"
            onClick={() => setOpen(false)}
            aria-label="Close notice"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        {image?.url && (
          <div className="notices-popup-image-wrap">
            <Image
              src={image.url}
              alt={image.alt || notice.title}
              width={800}
              height={400}
              className="notices-popup-image"
            />
          </div>
        )}

        {/* Body */}
        <div className="notices-popup-body">
          <h2 className="notices-popup-title">{notice.title}</h2>
          {notice.description && <p className="notices-popup-description">{notice.description}</p>}

          {/* PDF download */}
          {file?.url && (
            <a
              href={file.url}
              download={file.filename || "notice.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="notices-popup-download"
            >
              <span>📄</span> Download PDF
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="notices-popup-footer">
          {/* Carousel navigation */}
          {total > 1 && (
            <div className="notices-popup-nav">
              <button
                className="notices-popup-nav-btn"
                onClick={() => setCurrent((c) => (c - 1 + total) % total)}
                disabled={current === 0}
                aria-label="Previous notice"
              >
                ← Prev
              </button>

              {/* Dot indicators */}
              <div className="notices-popup-dots">
                {notices.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to notice ${i + 1}`}
                    className={`notices-popup-dot${i === current ? "active" : ""}`}
                  />
                ))}
              </div>

              <button
                className="notices-popup-nav-btn"
                onClick={() => setCurrent((c) => (c + 1) % total)}
                disabled={current === total - 1}
                aria-label="Next notice"
              >
                Next →
              </button>
            </div>
          )}

          <button className="notices-popup-dismiss" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
