"use client";

import { HeroSlider } from "./hero-slider";
import { StaffCards } from "./staff-cards";
import type { HeroSlide } from "@/payload-types";
import "./hero.css";

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
        <section className="hero-section mx-auto max-w-[1400px]">
            <HeroSlider slides={slides} />
            <StaffCards staff={staff} />
        </section>
    );
}
