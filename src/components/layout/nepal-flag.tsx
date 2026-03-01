"use client";

/**
 * AnimatedNepalFlag
 * ─────────────────────────────────────────────────────────────
 * A fully-inline SVG Nepal flag with:
 *  • Accurate pennant shape (double-triangle, crimson + border)
 *  • Moon & sun symbols inside
 *  • Gentle wave/flutter animation via CSS keyframes
 *  • Flagpole with a golden finial
 *  • No external image dependency → zero network request
 *  • Respects prefers-reduced-motion
 * ─────────────────────────────────────────────────────────────
 */

interface AnimatedNepalFlagProps {
    /** Height in px (width is derived from the aspect ratio) */
    height?: number;
    /** Extra Tailwind / CSS classes on the root wrapper */
    className?: string;
}

export function AnimatedNepalFlag({
    height = 88,
    className = "",
}: AnimatedNepalFlagProps) {
    // Nepal flag proportions: height ≈ 1.219 × width of the flag proper
    // The flag is composed of two pennants stacked:
    //   Upper (larger): width = h * 4/6, height = h * 2/3
    //   Lower (smaller): width = h * 4/6, height = h * 1/3
    // Total flag width  ≈ 0.667 × height
    const flagH = height;
    const flagW = Math.round(flagH * 0.65);

    // Pole dims
    const poleW = 4;
    const poleTotalH = flagH + 20; // extends above & below
    const totalW = flagW + poleW + 2;
    const totalH = poleTotalH + 8; // room for finial + base

    return (
        <div
            className={`nepal-flag-wrapper ${className}`}
            style={{ display: "inline-flex", alignItems: "flex-start" }}
            role="img"
            aria-label="Nepal National Flag"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={totalW}
                height={totalH}
                viewBox={`0 0 ${totalW} ${totalH}`}
                overflow="visible"
                style={{ display: "block" }}
            >
                <defs>
                    {/* Drop shadow for the flag body */}
                    <filter id="flagShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.25" />
                    </filter>

                    {/* Gradient for the pole */}
                    <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8a6c00" />
                        <stop offset="40%" stopColor="#f5d060" />
                        <stop offset="70%" stopColor="#c8990a" />
                        <stop offset="100%" stopColor="#7a5c00" />
                    </linearGradient>

                    {/* Wave animation clip */}
                    <clipPath id="flagClip">
                        <rect x={poleW + 2} y={4} width={flagW} height={flagH} />
                    </clipPath>
                </defs>

                {/* ── Flagpole ──────────────────────────────────── */}
                {/* Base cap */}
                <ellipse
                    cx={poleW / 2 + 1}
                    cy={totalH - 6}
                    rx={poleW * 1.4}
                    ry={4}
                    fill="#b8960a"
                />
                {/* Shaft */}
                <rect
                    x={1}
                    y={12}
                    width={poleW}
                    height={poleTotalH}
                    rx={poleW / 2}
                    fill="url(#poleGrad)"
                />
                {/* Golden finial (ball on top) */}
                <circle
                    cx={poleW / 2 + 1}
                    cy={10}
                    r={7}
                    fill="#f5d060"
                    stroke="#b8960a"
                    strokeWidth={1}
                />
                <circle cx={poleW / 2 + 1} cy={8} r={2.5} fill="#fff9c4" opacity={0.6} />

                {/* ── Animated Flag Body ────────────────────────── */}
                <g
                    className="nepal-flag-body"
                    filter="url(#flagShadow)"
                    style={{ transformOrigin: `${poleW + 2}px 18px` }}
                >
                    {/*
           * Nepal flag outline (blue border): Two triangular pennants
           * Upper pentagon: larger, base at top
           * Lower triangle: smaller
           *
           * Coordinate origin: (poleW+2, 18) = top-left of the flag
           * The flag fits in a rectangle of (flagW × flagH)
           * Nepal convention (simplified faithful):
           *   Blue border = 1 unit
           *   Crimson fill inside
           */}
                    {(() => {
                        const ox = poleW + 2; // x origin (pole right edge)
                        const oy = 18;        // y origin (top of flag)
                        const w = flagW;
                        const h = flagH;

                        // Upper pennant: 57% of total height
                        const h1 = Math.round(h * 0.575);
                        // Lower pennant: 43% of total height
                        const h2 = h - h1;

                        // Blue border width (proportional)
                        const b = Math.max(3, Math.round(w * 0.055));

                        // Upper pennant points (blue outer)
                        const upperBluePts = [
                            [ox, oy],
                            [ox + w, oy],
                            [ox, oy + h1],
                        ]
                            .map((p) => p.join(","))
                            .join(" ");

                        // Upper pennant points (crimson inner - inset by border b)
                        const upperRedPts = [
                            [ox + b, oy + b * 0.7],
                            [ox + w - b * 1.4, oy + b * 0.7],
                            [ox + b, oy + h1 - b * 1.2],
                        ]
                            .map((p) => p.join(","))
                            .join(" ");

                        // Lower pennant points (blue outer)
                        const lowerBluePts = [
                            [ox, oy + h1],
                            [ox + Math.round(w * 0.74), oy + h1],
                            [ox, oy + h1 + h2],
                        ]
                            .map((p) => p.join(","))
                            .join(" ");

                        // Lower pennant points (crimson inner)
                        const lowerRedPts = [
                            [ox + b, oy + h1 + b * 0.5],
                            [ox + Math.round(w * 0.74) - b * 1.3, oy + h1 + b * 0.5],
                            [ox + b, oy + h1 + h2 - b * 1.2],
                        ]
                            .map((p) => p.join(","))
                            .join(" ");

                        // ── Moon (upper pennant, roughly centred horizontally)
                        const moonCx = ox + Math.round(w * 0.34);
                        const moonCy = oy + Math.round(h1 * 0.36);
                        const moonR = Math.round(h1 * 0.15);

                        // ── Sun (lower pennant)
                        const sunCx = ox + Math.round(w * 0.27);
                        const sunCy = oy + h1 + Math.round(h2 * 0.44);
                        const sunR = Math.round(h2 * 0.28);

                        return (
                            <>
                                {/* Blue outer shapes */}
                                <polygon points={upperBluePts} fill="#003893" />
                                <polygon points={lowerBluePts} fill="#003893" />

                                {/* Crimson inner shapes */}
                                <polygon points={upperRedPts} fill="#DC143C" />
                                <polygon points={lowerRedPts} fill="#DC143C" />

                                {/* ── Moon symbol (upper) ── */}
                                {/* Crescent: full white circle minus a smaller offset circle */}
                                <g>
                                    {/* White crescent via clipping */}
                                    <circle cx={moonCx} cy={moonCy} r={moonR} fill="white" />
                                    <circle
                                        cx={moonCx + moonR * 0.35}
                                        cy={moonCy - moonR * 0.1}
                                        r={moonR * 0.75}
                                        fill="#DC143C"
                                    />
                                    {/* Moon dots / points above */}
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                                        const rad = (deg * Math.PI) / 180;
                                        const dotR = moonR * 1.55;
                                        const dx = moonCx + dotR * Math.sin(rad);
                                        const dy = moonCy - dotR * Math.cos(rad);
                                        return (
                                            <circle
                                                key={i}
                                                cx={dx}
                                                cy={dy}
                                                r={moonR * 0.1}
                                                fill="white"
                                            />
                                        );
                                    })}
                                </g>

                                {/* ── Sun symbol (lower) ── */}
                                <g>
                                    {/* Sun rays */}
                                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                                        (deg, i) => {
                                            const rad = (deg * Math.PI) / 180;
                                            const innerR = sunR * 0.7;
                                            const outerR = sunR * 1.15;
                                            return (
                                                <line
                                                    key={i}
                                                    x1={(sunCx + innerR * Math.sin(rad)).toFixed(2)}
                                                    y1={(sunCy - innerR * Math.cos(rad)).toFixed(2)}
                                                    x2={(sunCx + outerR * Math.sin(rad)).toFixed(2)}
                                                    y2={(sunCy - outerR * Math.cos(rad)).toFixed(2)}
                                                    stroke="white"
                                                    strokeWidth={Math.max(1, sunR * 0.12).toFixed(2)}
                                                    strokeLinecap="round"
                                                />
                                            );
                                        }
                                    )}
                                    {/* Sun core */}
                                    <circle cx={sunCx} cy={sunCy} r={(sunR * 0.6).toFixed(2)} fill="white" />
                                </g>
                            </>
                        );
                    })()}
                </g>

                {/* ── CSS keyframe animation injected inline ── */}
                <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .nepal-flag-body {
              animation: nepalWave 3.2s ease-in-out infinite;
              transform-origin: ${poleW + 2}px 18px;
            }
          }

          @keyframes nepalWave {
            0%   { transform: skewY(0deg) scaleX(1); }
            20%  { transform: skewY(-1.5deg) scaleX(0.97); }
            40%  { transform: skewY(1.2deg)  scaleX(0.99); }
            60%  { transform: skewY(-0.8deg) scaleX(0.98); }
            80%  { transform: skewY(0.9deg)  scaleX(1); }
            100% { transform: skewY(0deg) scaleX(1); }
          }
        `}</style>
            </svg>
        </div>
    );
}
