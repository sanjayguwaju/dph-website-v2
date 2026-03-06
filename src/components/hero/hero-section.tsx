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
}

export function HeroSection({ slides, staff }: HeroSectionProps) {
    return (
        <section className="hero-section">
            <HeroSlider slides={slides} />
            <StaffCards staff={staff} />
        </section>
    );
}
