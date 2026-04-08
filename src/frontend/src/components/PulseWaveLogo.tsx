interface PulseWaveLogoProps {
  /** sm = header, md = auth/onboarding, lg = splash */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { svgW: 52, svgH: 18, fontSize: "0.9rem", gap: "0.5rem", strokeW: 2 },
  md: { svgW: 76, svgH: 26, fontSize: "1.3rem", gap: "0.65rem", strokeW: 2 },
  lg: {
    svgW: 108,
    svgH: 36,
    fontSize: "1.85rem",
    gap: "0.85rem",
    strokeW: 1.8,
  },
};

/**
 * EKG heartbeat path across a 160×40 viewBox — pure clinical single line.
 * NO letter shapes, NO circles, NO 'P' form — just the wave.
 */
const EKG_PATH =
  "M 0 20 L 30 20 L 36 24 L 42 20 L 52 2 L 60 38 L 68 20 L 78 14 L 86 20 L 160 20";

export function PulseWaveLogo({
  size = "md",
  className = "",
}: PulseWaveLogoProps) {
  const { svgW, svgH, fontSize, gap, strokeW } = SIZE_MAP[size];
  const filterId = `ekgGlow${size}`;

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap }}
    >
      {/* ── EKG / Heartbeat SVG ── */}
      <svg
        viewBox="0 0 160 40"
        width={svgW}
        height={svgH}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Pulse wave"
        style={{ flexShrink: 0, overflow: "visible" }}
      >
        <defs>
          <filter id={filterId} x="-40%" y="-100%" width="180%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow layer — wider, more transparent */}
        <path
          d={EKG_PATH}
          stroke="#8A2BE2"
          strokeWidth={strokeW * 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.18}
          filter={`url(#${filterId})`}
        />

        {/* Main line */}
        <path
          d={EKG_PATH}
          stroke="#8A2BE2"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${filterId})`}
        />
      </svg>

      {/* ── "PULSE AI" static text ── */}
      <span
        style={{
          fontFamily: "Syncopate, sans-serif",
          fontSize,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "0.18em",
          textShadow: "0 0 12px rgba(138,43,226,0.6)",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        PULSE AI
      </span>
    </div>
  );
}
