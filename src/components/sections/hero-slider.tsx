"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "@/payload-types";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [total, paused, next]);

  if (total === 0) return null;

  const slide = slides[current];
  const image = slide.image && typeof slide.image === "object" ? slide.image : null;

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero image slider"
    >
      {/* Slides */}
      {slides.map((s, i) => {
        const img = s.image && typeof s.image === "object" ? s.image : null;
        return (
          <div
            key={s.id}
            className={`hero-slide${i === current ? "active" : ""}`}
            aria-hidden={i !== current}
          >
            {img?.url && (
              <Image
                src={img.url}
                alt={img.alt || s.title}
                fill
                className="hero-slide-img"
                priority={i === 0}
                sizes="100vw"
              />
            )}
            {/* Gradient overlay */}
            <div className="hero-slide-overlay" />

            {/* Text content */}
            <div className="hero-slide-content">
              <h1 className="hero-slide-title">{s.title}</h1>
              <p className="hero-slide-caption">{s.caption}</p>
              {s.link && (
                <Link href={s.link} className="hero-slide-cta">
                  Read more →
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <button className="hero-arrow hero-arrow-prev" onClick={prev} aria-label="Previous slide">
            ‹
          </button>
          <button className="hero-arrow hero-arrow-next" onClick={next} aria-label="Next slide">
            ›
          </button>

          {/* Dot indicators */}
          <div className="hero-dots" role="tablist" aria-label="Slide indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                className={`hero-dot${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}

      {/* Slide counter */}
      {total > 1 && (
        <span className="hero-counter" aria-live="polite">
          {current + 1} / {total}
        </span>
      )}
    </section>
  );
}
