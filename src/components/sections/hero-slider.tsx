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
            className="hero-slider-v3 group relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Hero slider"
        >
            {/* Slide track */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: 520 }}>
                <div
                    className="flex h-full transition-transform duration-1000 cubic-bezier(0.65, 0, 0.35, 1) will-change-transform"
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
                                className="relative w-full h-full flex-shrink-0 flex items-end"
                                style={{ minHeight: 520 }}
                                aria-hidden={i !== current}
                            >
                                {/* Background with Ken Burns */}
                                <div className="absolute inset-0 overflow-hidden">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={slide.title || ""}
                                            fill
                                            priority={i === 0}
                                            className={cn(
                                                "object-cover transition-opacity duration-1000",
                                                i === current ? "opacity-100 ken-burns" : "opacity-0"
                                            )}
                                            sizes="(max-width: 768px) 100vw, 75vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-900" />
                                    )}
                                    {/* Overlay for better text legibility */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                {/* Caption Area */}
                                <div className="hero-caption-bar">
                                    <div className={cn(
                                        "transition-all duration-1000 delay-300",
                                        i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                    )}>
                                        <h2 className="hero-slide-title">
                                            {slide.title || (locale === "ne" ? "गुणस्तरीय स्वास्थ्य सेवा नै हाम्रो प्रतिबद्धता" : "Commitment to Quality Healthcare")}
                                        </h2>

                                        {slide.link && (
                                            <Link
                                                href={slide.link}
                                                className="inline-flex items-center gap-2 bg-[var(--brand-red)] hover:bg-[#c22d3b] text-white text-sm font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-900/20"
                                            >
                                                {ctaLabel}
                                                <ArrowRight size={18} />
                                            </Link>
                                        )}
                                    </div>
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
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dot pagination */}
            {count > 1 && (
                <div className="absolute bottom-8 left-8 z-20 flex items-center gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={cn(
                                "h-2 rounded-full transition-all duration-500",
                                i === current
                                    ? "w-10 bg-[var(--brand-red)]"
                                    : "w-2 bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Slide counter badge */}
            <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white text-xs font-bold tracking-widest">
                {mounted
                    ? (locale === "ne" ? toNepaliNum(current + 1) : current + 1)
                    : (current + 1)
                }
                <span className="mx-2 opacity-50">/</span>
                {mounted
                    ? (locale === "ne" ? toNepaliNum(count) : count)
                    : (count)
                }
            </div>

            {/* Progress bar */}
            {!isPaused && count > 1 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden z-20">
                    <div
                        key={current}
                        className="h-full bg-[var(--brand-red)]/80 animate-progress"
                        style={{ animationDuration: `${AUTO_PLAY_INTERVAL}ms` }}
                    />
                </div>
            )}
        </div>
    );
}
