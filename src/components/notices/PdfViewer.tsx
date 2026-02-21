"use client";

import { useState, useRef } from "react";
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCw,
  Search,
  Menu,
} from "lucide-react";

interface PdfViewerProps {
  fileUrl: string;
  fileName?: string;
  title?: string;
}

export function PdfViewer({ fileUrl, fileName = "document.pdf", title }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(14); // will be updated when PDF loads
  const [zoom, setZoom] = useState(100);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Direct PDF embed URL (use zoom state directly)
  const directPdfUrl = `${fileUrl}#page=${currentPage}&zoom=${zoom}`;

  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  // Generate thumbnail page numbers
  const thumbnailPages = Array.from({ length: Math.min(totalPages, 20) }, (_, i) => i + 1);

  const shortName = fileName.length > 35 ? fileName.slice(0, 35) + "..." : fileName;

  return (
    <div className="pdf-viewer-wrapper">
      {/* ── Top Toolbar ── */}
      <div className="pdf-toolbar">
        <div className="pdf-toolbar-left">
          <button
            className="pdf-tool-btn"
            onClick={() => setShowSidebar((s) => !s)}
            title="Toggle sidebar"
          >
            <Menu size={16} />
          </button>
          <span className="pdf-filename" title={fileName}>
            {shortName}
          </span>
        </div>

        <div className="pdf-toolbar-center">
          {/* Page navigation */}
          <button
            className="pdf-tool-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="pdf-page-input-wrap">
            <input
              type="number"
              className="pdf-page-input"
              value={currentPage}
              min={1}
              max={totalPages}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            />
            <span className="pdf-page-sep">/ {totalPages}</span>
          </div>
          <button
            className="pdf-tool-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>

          {/* Zoom */}
          <div className="pdf-divider" />
          <button className="pdf-tool-btn" onClick={handleZoomOut} title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <span className="pdf-zoom-label">{zoom}%</span>
          <button className="pdf-tool-btn" onClick={handleZoomIn} title="Zoom in">
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="pdf-toolbar-right">
          <a
            href={fileUrl}
            download={fileName}
            className="pdf-tool-btn"
            title="Download"
          >
            <Download size={16} />
          </a>
          <button
            className="pdf-tool-btn"
            onClick={() => window.print()}
            title="Print"
          >
            <Printer size={16} />
          </button>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-tool-btn"
            title="Open in new tab"
          >
            <Maximize2 size={16} />
          </a>
        </div>
      </div>

      {/* ── Main viewer area ── */}
      <div className="pdf-body">
        {/* Sidebar thumbnails */}
        {showSidebar && (
          <div className="pdf-sidebar">
            {thumbnailPages.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`pdf-thumb-btn ${currentPage === pageNum ? "active" : ""}`}
              >
                {/* Thumbnail preview using iframe */}
                <div className="pdf-thumb-preview">
                  <iframe
                    src={`${fileUrl}#page=${pageNum}&view=fit&toolbar=0&navpanes=0&scrollbar=0`}
                    className="pdf-thumb-iframe"
                    title={`Page ${pageNum}`}
                    loading="lazy"
                  />
                </div>
                <span className="pdf-thumb-num">{pageNum}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main PDF iframe */}
        <div className="pdf-main-view">
          {isLoading && (
            <div className="pdf-loading">
              <div className="pdf-loading-spinner" />
              <p>Loading document...</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={`${fileUrl}#page=${currentPage}&zoom=${zoom}&toolbar=1&navpanes=0`}
            className="pdf-main-iframe"
            title={title || fileName}
            onLoad={() => setIsLoading(false)}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
