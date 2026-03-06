"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/payload-types";
import { cn } from "@/lib/utils";
import { getLocaleClient } from "@/utils/locale-client";
import { toNepaliNum } from "@/utils/nepali-date";

interface HeroSliderProps {
    slides: HeroSlide[];
}

const AUTO_PLAY_INTERVAL = 6000;

export function HeroSlider({ slides }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [locale, setLocale] = useState("ne");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartX = useRef<number | null>(null);
    const count = slides?.length ?? 0;

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setLocale(getLocaleClient());
        setMounted(true);
    }, []);

    const goTo = useCallback(
        (index: number) => setCurrent(((index % count) + count) % count),
        [count]
    );
    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!isPaused && count > 1) {
            timerRef.current = setTimeout(next, AUTO_PLAY_INTERVAL);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [current, isPaused, count, next]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        touchStartX.current = null;
    };

    if (!slides || slides.length === 0) {
        return (
            <div className="hero-slider-v3 flex items-center justify-center bg-gray-100 rounded-xl border border-slate-200">
                <p className="text-slate-400 text-sm">No slides available</p>
            </div>
        );
    }

    const ctaLabel = mounted
        ? (locale === "ne" ? "थप जान्नुहोस्" : "Learn More")
        : "थप जान्नुहोस्";

    return (
        <div
            className="hero-slider-v3 group relative rounded-xl overflow-hidden bg-slate-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Hero slider"
        >
            {/* Slide track */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: 420 }}>
                <div
                    className="flex transition-transform duration-700 ease-in-out will-change-transform"
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
                                className="relative w-full flex-shrink-0 flex items-end"
                                style={{ minHeight: 420 }}
                                aria-hidden={i !== current}
                            >
                                {/* Background */}
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={slide.title || ""}
                                        fill
                                        priority={i === 0}
                                        className={cn(
                                            "object-cover transition-transform duration-[8000ms] ease-out",
                                            i === current ? "scale-110" : "scale-100"
                                        )}
                                        sizes="(max-width: 768px) 100vw, 75vw"
                                    />
                                ) : (
                                    /* Fallback building illustration */
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
                                        <svg
                                            viewBox="0 0 1000 600"
                                            preserveAspectRatio="xMidYMax slice"
                                            className="absolute inset-0 w-full h-full opacity-20"
                                        >
                                            <path
                                                d="M150,600 L150,250 L350,250 L350,150 L650,150 L650,250 L850,250 L850,600 Z"
                                                fill="#fff"
                                            />
                                            {[200, 280, 400, 480, 560, 680, 760].map((x, idx) => (
                                                <rect key={idx} x={x} y={idx < 2 ? 300 : idx < 5 ? 200 : 300}
                                                    width="40" height="40" fill="#f5f0e8" opacity="0.4" />
                                            ))}
                                        </svg>
                                    </div>
                                )}

                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

                                {/* Caption bar */}
                                <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-sm">
                                    <p className={cn(
                                        "text-white text-sm font-medium transition-all duration-700 delay-300",
                                        i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                    )}>
                                        {slide.title || "अस्पतालको भवन र पहाडी दृश्य"}
                                    </p>
                                    {slide.link && (
                                        <Link
                                            href={slide.link}
                                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 transition-all backdrop-blur-md whitespace-nowrap"
                                        >
                                            {ctaLabel}
                                            <ArrowRight size={13} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Prev / Next arrows */}
            {count > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Previous slide"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next slide"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={22} strokeWidth={2.5} />
                    </button>
                </>
            )}

            {/* Dot pagination */}
            {count > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                i === current
                                    ? "w-8 bg-[#e12027] shadow"
                                    : "w-2.5 bg-white/40 hover:bg-white/60"
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Slide counter badge */}
            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white/90 text-xs font-bold tracking-widest">
                {mounted
                    ? (locale === "ne" ? toNepaliNum(current + 1) : current + 1)
                    : (toNepaliNum(current + 1))
                }
                <span className="mx-1 opacity-40">/</span>
                {mounted
                    ? (locale === "ne" ? toNepaliNum(count) : count)
                    : (toNepaliNum(count))
                }
            </div>

            {/* Progress bar */}
            {!isPaused && count > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden z-20">
                    <div
                        key={current}
                        className="h-full bg-[#e12027]/80 animate-progress"
                        style={{ animationDuration: `${AUTO_PLAY_INTERVAL}ms` }}
                    />
                </div>
            )}
        </div>
    );
}
