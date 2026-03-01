"use client";

import { Facebook } from "lucide-react";

interface FacebookWidgetProps {
  pageName?: string;
  followerCount?: string;
  facebookUrl?: string;
  locale?: string;
}

export function FacebookWidget({
  pageName,
  followerCount = "4.5K",
  facebookUrl = "https://facebook.com",
  locale = "ne",
}: FacebookWidgetProps) {
  // Don't render if no page name provided
  if (!pageName) return null;

  return (
    <div className="fb-card-v3">
      <div className="fb-header-v3">
        <div className="fb-profile-v3">
          <div className="fb-logo-wrap-v3">
            <Facebook size={20} fill="white" stroke="none" />
          </div>
          <div className="fb-profile-info-v3">
            <h4 className="fb-name-v3">{pageName}</h4>
            <p className="fb-meta-v3">
              {followerCount} {locale === "ne" ? "फलोअर्स" : "Followers"}
            </p>
          </div>
        </div>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fb-btn-v3"
        >
          {locale === "ne" ? "पेज फलो गर्नुहोस्" : "Follow Page"}
        </a>
      </div>

      <div className="fb-content-v3">
        <div className="fb-placeholder-v3">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fb-placeholder-text-v3 hover:underline"
          >
            {locale === "ne" ? "फेसबुकमा हेर्नुहोस्" : "View on Facebook"}
          </a>
        </div>
      </div>
    </div>
  );
}
