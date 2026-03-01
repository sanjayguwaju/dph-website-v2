"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/payload-types";
import { cn } from "@/lib/utils";

interface HeroSliderProps {
    slides: HeroSlide[];
}

const AUTO_PLAY_INTERVAL = 6000;

export function HeroSlider({ slides }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartX = useRef<number | null>(null);
    const count = slides.length;

    const goTo = useCallback(
        (index: number) => {
            setCurrent(((index % count) + count) % count);
        },
        [count],
    );

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    // Auto play logic
    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!isPaused && count > 1) {
            timerRef.current = setTimeout(() => {
                next();
            }, AUTO_PLAY_INTERVAL);
        }
    }, [count, isPaused, next]);

    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [current, resetTimer]);

    // Touch / swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
        touchStartX.current = null;
    };

    if (!slides || slides.length === 0) {
        return (
            <div className="hero-slider-v3 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden border border-slate-200">
                <p className="text-slate-500 font-medium">No slides available</p>
            </div>
        );
    }

    return (
        <div
            className="hero-slider-v3 group rounded-xl bg-slate-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Hero slider"
        >
            {/* Main slider track */}
            <div className="slider-viewport-v3">
                <div
                    className="slider-track-v3 flex"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((slide, i) => {
                        const imageUrl =
                            (typeof slide.image === "object" && slide.image?.url) ||
                            slide.externalImage ||
                            null;

                        return (
                            <div
                                key={slide.id || i}
                                className="slide-v3 relative w-full flex-shrink-0 flex items-center justify-center min-h-[400px]"
                                aria-hidden={i !== current}
                            >
                                {/* Background Image */}
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={slide.title || ""}
                                        fill
                                        priority={i === 0}
                                        className="slide-img-v3 object-cover brightness-[0.7] transform group-hover:scale-105 transition-transform duration-10000"
                                        sizes="(max-width: 768px) 100vw, 80vw"
                                    />
                                ) : (
                                    <div className="slide-no-img-fallback absolute inset-0" />
                                )}

                                {/* Content Overlay */}
                                <div className="slide-overlay-v3 flex flex-col items-center justify-center p-6 text-center z-10 w-full h-full max-w-2xl mx-auto">
                                    <div className={cn(
                                        "slide-content-v3 transition-all duration-700 delay-300 transform",
                                        i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    )}>
                                        <h2 className="slide-title-v3 text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                                            {slide.title}
                                        </h2>
                                        {slide.caption && (
                                            <p className="slide-caption-v3 text-lg md:text-xl text-white/90 mb-8 max-w-xl line-clamp-2 font-medium drop-shadow-md">
                                                {slide.caption}
                                            </p>
                                        )}
                                        {slide.link && (
                                            <Link
                                                href={slide.link}
                                                className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl"
                                            >
                                                थप जान्नुहोस् <ArrowRight size={18} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Arrows */}
            {count > 1 && (
                <>
                    <button
                        className="slider-nav-btn prev left-4"
                        onClick={prev}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className="slider-nav-btn next right-4"
                        onClick={next}
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Pagination Dotted/Line Indicators */}
            {count > 1 && (
                <div className="slider-pagination-v3 absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={cn(
                                "slider-dot-v3 h-1.5 transition-all duration-300 rounded-full",
                                i === current ? "w-10 bg-brand-red shadow-lg" : "w-2.5 bg-white/40 hover:bg-white/60"
                            )}
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Counter badge */}
            <div className="absolute top-6 right-6 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white/90 text-xs font-bold tracking-widest uppercase">
                {current + 1} <span className="mx-1 opacity-50">/</span> {count}
            </div>

            {/* Progress line */}
            {!isPaused && count > 1 && (
                <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full overflow-hidden">
                    <div
                        key={current}
                        className="h-full bg-brand-red/80 animate-progress"
                        style={{ animationDuration: `${AUTO_PLAY_INTERVAL}ms` }}
                    />
                </div>
            )}
        </div>
    );
}
