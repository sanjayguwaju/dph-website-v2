"use client";

import { HeroSlider } from "./HeroSlider";
import { StaffCards } from "./StaffCards";
import type { HeroSlide } from "@/payload-types";

type StaffMember = {
    id: string;
    name: string;
    nameEn?: string | null;
    designation: string;
    role?: string | null;
    photo?: any;
    phone?: string | null;
    email?: string | null;
};

interface HeroSectionProps {
    slides: HeroSlide[];
    staff: StaffMember[];
    locale: string;
}

export function HeroSection({ slides, staff, locale }: HeroSectionProps) {
    return (
        <div className="container-refined py-6">
            <section className="hero-section" aria-label="Hospital Hero Slider and Important People">
                <div className="hero-slider-v3">
                    <HeroSlider slides={slides} locale={locale} />
                </div>
                <aside className="staff-cards-list">
                    <StaffCards staff={staff} locale={locale} />
                </aside>
            </section>
        </div>
    );
}
