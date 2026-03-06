"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/payload-types";
import { cn } from "@/lib/utils";
import { getLocaleClient } from "@/utils/locale-client";
import { toNepaliNum } from "@/utils/nepali-date";
import { getLocalizedValue } from "@/lib/utils/localized";

interface HeroSliderProps {
    slides: HeroSlide[];
    locale: string;
}

const AUTO_PLAY_INTERVAL = 6000;

export function HeroSlider({ slides, locale: initialLocale }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [locale, setLocale] = useState(initialLocale);
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartX = useRef<number | null>(null);
    const count = slides?.length ?? 0;

    useEffect(() => {
        setMounted(true);
        const activeLocale = getLocaleClient();
        if (activeLocale !== locale) {
            setLocale(activeLocale);
        }
    }, [locale]);

    const goTo = useCallback(
        (index: number) => {
            if (count === 0) return;
            setCurrent(((index % count) + count) % count);
        },
        [count]
    );

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!isPaused && count > 1) {
            timerRef.current = setTimeout(next, AUTO_PLAY_INTERVAL);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [current, isPaused, count, next]);

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
            <div className="hero-slider-v3 flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200 h-[520px]">
                <p className="text-slate-400 text-sm">No slides available</p>
            </div>
        );
    }

    const ctaLabel = locale === "ne" ? "थप जान्नुहोस्" : "Learn More";

    return (
        <div
            className="hero-slider-v3 group relative overflow-hidden bg-slate-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Hero slider"
        >
            {/* Slide track */}
            <div className="relative w-full h-full overflow-hidden">
                <div
                    className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((slide, i) => {
                        const imageUrl = (typeof slide.image === "object" && slide.image?.url) || slide.externalImage || null;
                        const title = getLocalizedValue(slide.title);

                        return (
                            <div
                                key={slide.id || i}
                                className="relative w-full h-full flex-shrink-0 flex items-end"
                                aria-hidden={i !== current}
                            >
                                {/* Background */}
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={mounted ? title : (slide.title as string || "")}
                                        fill
                                        priority={i === 0}
                                        className={cn(
                                            "object-cover transition-transform duration-[8000ms] ease-out",
                                            i === current ? "scale-110" : "scale-100"
                                        )}
                                        sizes="(max-width: 1024px) 100vw, 75vw"
                                        suppressHydrationWarning
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black">
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                                    </div>
                                )}

                                {/* Premium Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                                {/* Caption Area */}
                                <div className="relative z-10 w-full px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
                                    <div className={cn(
                                        "flex flex-col max-w-2xl transition-all duration-1000 delay-300",
                                        i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    )}>
                                        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight drop-shadow-xl" suppressHydrationWarning>
                                            {mounted
                                                ? (title || (locale === "ne" ? "अस्पतालको भवन र पहाडी दृश्य" : "Hospital Building and View"))
                                                : (slide.title as string || (initialLocale === "ne" ? "अस्पतालको भवन र पहाडी दृश्य" : "Hospital Building and View"))
                                            }
                                        </h2>
                                    </div>
                                    {slide.link && (
                                        <Link
                                            href={slide.link}
                                            className="pointer-events-auto self-start md:self-end flex items-center gap-2 bg-white text-slate-900 text-sm font-bold px-8 py-3.5 rounded-full transition-all hover:bg-[#e12027] hover:text-white hover:scale-105 active:scale-95 shadow-2xl whitespace-nowrap"
                                        >
                                            {ctaLabel}
                                            <ArrowRight size={18} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls */}
            {count > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="slider-nav-btn-v3 prev"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={next}
                        className="slider-nav-btn-v3 next"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Pagination Indicators */}
                    <div className="absolute bottom-10 left-10 z-30 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-500",
                                    i === current
                                        ? "w-10 bg-white shadow-lg"
                                        : "w-2.5 bg-white/30 hover:bg-white/60"
                                )}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Progress Bar */}
                    {!isPaused && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden z-30">
                            <div
                                key={current}
                                className="h-full bg-[#e12027] animate-progress"
                                style={{ animationDuration: `${AUTO_PLAY_INTERVAL}ms` }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Slide Counter */}
            <div className="absolute top-8 left-10 z-20 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-bold tracking-widest uppercase">
                {locale === "ne" ? toNepaliNum(current + 1) : current + 1}
                <span className="mx-2 opacity-40">/</span>
                {locale === "ne" ? toNepaliNum(count) : count}
            </div>
        </div>
    );
}
