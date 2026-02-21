"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSliderProps {
  slides: any[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Swipe logic
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  };

  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [total, paused, next]);

  if (total === 0) return null;

  return (
    <section
      className="hero-slider-v3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="slider-track-v3">
        {slides.map((s, i) => {
          const img = s.image && typeof s.image === "object" ? s.image : null;
          const imgUrl = img?.url || s.externalImage || `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200`;
          
          return (
            <div
              key={s.id || i}
              className={`slide-v3${i === current ? " active" : ""}`}
            >
              <Image
                src={imgUrl}
                alt={s.title || "Hero Image"}
                fill
                className="slide-img-v3"
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
              
              <div className="slide-overlay-v3">
                <div className="slide-info-v3">
                  <h2 className="slide-title-v3">{s.title}</h2>
                  <p className="slide-caption-v3">{s.caption}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button className="slider-control-v3 prev" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft size={24} />
          </button>
          <button className="slider-control-v3 next" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight size={24} />
          </button>

          <div className="slider-dots-v3">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`slider-dot-v3${i === current ? " active" : ""}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
