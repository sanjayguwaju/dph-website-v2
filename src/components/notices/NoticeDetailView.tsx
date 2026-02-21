"use client";

import { useState } from "react";

import {
  Facebook,
  Twitter,
  Share2,
  Eye,
  Download,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Menu,
} from "lucide-react";
import { useTranslations } from "next-intl";


interface NoticeFile {
  url: string;
  filename?: string;
  mimeType?: string;
}

interface NoticeDetailViewProps {
  title: string;
  description?: string | null;
  date?: string | null;
  file?: NoticeFile | null;
  image?: { url: string; alt?: string } | null;
  views?: number;
  shareUrl: string;
  tweetUrl: string;
}

export function NoticeDetailView({
  title,
  description,
  date,
  file,
  image,
  views = 31,
  shareUrl,
  tweetUrl,
}: NoticeDetailViewProps) {
  const tc = useTranslations("common");
  const tn = useTranslations("notices");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(14);
  const [zoom, setZoom] = useState(100);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageInput, setPageInput] = useState("1");

  // Determine if we have a PDF file
  const isPdf =
    file?.mimeType === "application/pdf" ||
    file?.url?.toLowerCase().endsWith(".pdf");
  const hasFile = !!file?.url;
  const hasImage = !!image?.url;

  const thumbnailPages = Array.from(
    { length: Math.min(totalPages, 20) },
    (_, i) => i + 1
  );

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    setPageInput(String(target));
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  const handleShare = (platform: "facebook" | "twitter" | "native") => {
    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank",
        "width=600,height=400"
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        "_blank",
        "width=600,height=400"
      );
    } else if (navigator.share) {
      navigator.share({ title, url: shareUrl });
    }
  };

  return (
    <div className="notice-detail-wrapper">
      {/* ── Page Title ── */}
      <div className="notice-detail-title-section">
        <h1 className="notice-detail-h1">{title}</h1>
        {date && (
          <div className="notice-detail-date-row">
            <Clock size={14} className="text-[var(--brand-blue)]" />
            <span>{date}</span>
          </div>
        )}
      </div>

      {/* ── PDF VIEWER ── */}
      {hasFile && isPdf && (
        <div className="notice-pdf-container">
          {/* Toolbar */}
          <div className="pdf-viewer-toolbar">
            <div className="pdf-toolbar-left">
              <button
                className="pdf-tool-icon-btn"
                onClick={() => setShowSidebar((s) => !s)}
                title={tn("toggleSidebar")}
              >
                <Menu size={15} />
              </button>
              <span className="pdf-file-label" title={file?.filename || "document.pdf"}>
                {(file?.filename || "document.pdf").slice(0, 50)}
              </span>
            </div>

            <div className="pdf-toolbar-center">
              {/* Prev page */}
              <button
                className="pdf-tool-icon-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={15} />
              </button>

              {/* Page input */}
              <div className="pdf-page-ctrl">
                <input
                  type="number"
                  className="pdf-page-num-input"
                  value={pageInput}
                  min={1}
                  max={totalPages}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => goToPage(parseInt(pageInput) || 1)}
                  onKeyDown={(e) => e.key === "Enter" && goToPage(parseInt(pageInput) || 1)}
                />
                <span className="pdf-page-sep-text">/ {totalPages}</span>
              </div>

              {/* Next page */}
              <button
                className="pdf-tool-icon-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight size={15} />
              </button>

              <div className="pdf-toolbar-divider" />

              {/* Zoom out */}
              <button className="pdf-tool-icon-btn" onClick={handleZoomOut} title={tn("zoomOut")}>
                <ZoomOut size={15} />
              </button>
              <span className="pdf-zoom-text">{zoom}%</span>
              {/* Zoom in */}
              <button className="pdf-tool-icon-btn" onClick={handleZoomIn} title={tn("zoomIn")}>
                <ZoomIn size={15} />
              </button>
            </div>

            <div className="pdf-toolbar-right">
              <a
                href={file?.url}
                download={file?.filename}
                className="pdf-tool-icon-btn"
                title={tn("downloadPdf")}
              >
                <Download size={15} />
              </a>
              <button
                className="pdf-tool-icon-btn"
                onClick={() => window.print()}
                title={tn("print")}
              >
                <Printer size={15} />
              </button>
              <a
                href={file?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-tool-icon-btn"
                title={tn("openNewTab")}
              >
                <Maximize2 size={15} />
              </a>
            </div>
          </div>

          {/* Viewer body */}
          <div className="pdf-viewer-body">
            {/* Thumbnail sidebar */}
            {showSidebar && (
              <div className="pdf-thumb-sidebar">
                {thumbnailPages.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`pdf-thumb-item ${currentPage === pageNum ? "active" : ""}`}
                  >
                    <div className="pdf-thumb-frame">
                      <div className="pdf-thumb-doc-icon">
                        <FileText size={24} className="text-[var(--brand-blue)] opacity-40" />
                        <span className="pdf-thumb-page-num-inner">{pageNum}</span>
                      </div>
                    </div>
                    <span className="pdf-thumb-label">{pageNum}</span>
                  </button>
                ))}
              </div>
            )}

            {/* PDF iframe */}
            <div className="pdf-main-panel">
              {isLoading && (
                <div className="pdf-loading-overlay">
                  <div className="pdf-spinner" />
                  <span>{tc("loading")}</span>
                </div>
              )}
              <iframe
                src={file?.url ? `${file.url}#page=${currentPage}&zoom=${zoom}&toolbar=1&navpanes=0&scrollbar=1` : undefined}
                className="pdf-iframe-main"
                title={title}
                onLoad={() => setIsLoading(false)}
                allow="fullscreen"
              />

            </div>
          </div>
        </div>
      )}

      {/* ── Scanned image notice ── */}
      {hasImage && !isPdf && (
        <div className="notice-image-viewer">
          <img
            src={image!.url}
            alt={image!.alt || title}
            className="notice-image-full"
          />
        </div>
      )}

      {/* ── Description (if no PDF/image, or as supplement) ── */}
      {description && !isPdf && !hasImage && (
        <div className="notice-text-body">
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{description}</p>
        </div>
      )}

      {/* ── Download Bar ── */}
      {hasFile && (
        <div className="notice-download-bar">
          <a
            href={file!.url}
            download={file?.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="notice-download-link"
          >
            <FileText size={14} />
            {tc("download")}: {file?.filename || "document.pdf"}
          </a>
        </div>
      )}

      {/* ── Share Row ── */}
      <div className="notice-share-row">
        <div className="notice-share-btns">
          <button
            onClick={() => handleShare("facebook")}
            className="notice-share-btn facebook"
          >
            <Facebook size={14} /> {tn("share")}
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="notice-share-btn twitter"
          >
            <Twitter size={14} /> {tn("tweet")}
          </button>
          <button
            onClick={() => handleShare("native")}
            className="notice-share-btn share"
          >
            <Share2 size={14} /> {tn("share")}
          </button>
        </div>

        <div className="notice-view-count">
          <Eye size={14} className="text-[var(--brand-blue)]" />
          <span>{views}</span>
        </div>
      </div>
    </div>
  );
}
