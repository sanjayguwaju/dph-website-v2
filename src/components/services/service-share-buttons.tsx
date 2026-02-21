"use client";

import { Facebook, Twitter, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ServiceShareButtonsProps {
  title: string;
  shareUrl: string;
}

export function ServiceShareButtons({ title, shareUrl }: ServiceShareButtonsProps) {
  const tn = useTranslations("notices");

  const handleShare = (platform: "facebook" | "twitter" | "native") => {
    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank",
        "width=600,height=400",
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        "_blank",
        "width=600,height=400",
      );
    } else if (navigator.share) {
      navigator.share({ title, url: shareUrl });
    }
  };

  return (
    <div className="flex">
      <button
        onClick={() => handleShare("facebook")}
        className="flex items-center justify-center gap-1.5 bg-[#3b5998] px-4 py-2 text-[13px] text-white hover:bg-[#2d4373]"
      >
        <Facebook size={14} fill="currentColor" strokeWidth={0} /> {tn("share")}
      </button>
      <button
        onClick={() => handleShare("twitter")}
        className="flex items-center justify-center gap-1.5 bg-[#55acee] px-4 py-2 text-[13px] text-white hover:bg-[#2795e9]"
      >
        <Twitter size={14} fill="currentColor" strokeWidth={0} /> {tn("tweet")}
      </button>
      <button
        onClick={() => handleShare("native")}
        className="flex items-center justify-center gap-1.5 bg-[#dd4b39] px-4 py-2 text-[13px] text-white hover:bg-[#c23321]"
      >
        {/* Using a pseudo-Google or Generic share icon representation */}
        <span className="mr-0.5 text-[15px] leading-none font-bold">G</span> {tn("share")}
      </button>
    </div>
  );
}
