"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Facebook } from "lucide-react";

export function FacebookWidget({ 
  pageName, 
  followerCount = "4.4", 
  locale = "ne" 
}: { 
  pageName?: string; 
  followerCount?: string; 
  locale?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="fb-card-v3 animate-pulse">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
           <div className="w-12 h-12 rounded-full bg-gray-200"></div>
           <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
           </div>
        </div>
        <div className="h-48 bg-gray-50 m-4 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="fb-card-v3">
      <div className="fb-header-v3">
        <div className="fb-profile-v3">
           <div className="fb-logo-wrap-v3">
              <Facebook size={20} fill="white" stroke="none" />
           </div>
           <div className="fb-profile-info-v3">
              <h4 className="fb-name-v3">{pageName || "धौलागिरी प्रादेशिक अस्पताल"}</h4>
              <p className="fb-meta-v3">{followerCount}K {locale === "ne" ? "फलोअर्स" : "Followers"}</p>
           </div>
        </div>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="fb-btn-v3">
           {locale === "ne" ? "पेज फलो गर्नुहोस्" : "Follow Page"}
        </a>
      </div>
      
      <div className="fb-content-v3">
         <div className="fb-placeholder-v3">
            <span className="fb-placeholder-text-v3">
               {locale === "ne" ? "फेसबुक फिड" : "Facebook Feed"}
            </span>
         </div>
      </div>
    </div>
  );
}
