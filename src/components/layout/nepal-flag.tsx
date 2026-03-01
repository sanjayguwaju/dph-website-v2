"use client";

import Image from "next/image";

interface AnimatedNepalFlagProps {
    /** Height in px */
    height?: number;
    /** Extra Tailwind / CSS classes */
    className?: string;
}

export function AnimatedNepalFlag({
    height = 90,
    className = "",
}: AnimatedNepalFlagProps) {
    return (
        <div
            className={`nepal-flag-image-container ${className}`}
            style={{
                height: `${height}px`,
                aspectRatio: "1/1",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <img
                src="/assets/nepal-flag.png"
                alt="Nepal National Flag"
                width={height}
                height={height}
                className="nepal-flag-standard-img"
                style={{
                    objectFit: "contain",
                    width: `${height}px`,
                    height: `${height}px`
                }}
            />
            <style jsx global>{`
                .nepal-flag-standard-img {
                    animation: flagFloat 3s ease-in-out infinite;
                }
                @keyframes flagFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `}</style>
        </div>
    );
}
