interface PulseWaveLogoProps {
  /** sm = header, md = auth/onboarding, lg = splash */
  size?: "sm" | "md" | "lg";
  /** vertical = icon above text (splash only), horizontal = icon left + text right */
  layout?: "vertical" | "horizontal";
  className?: string;
}

const SIZE_MAP = {
  sm: { svgW: 36, svgH: 20, fontSize: "14px", gap: "8px", strokeW: 2.5 },
  md: { svgW: 52, svgH: 28, fontSize: "18px", gap: "10px", strokeW: 3 },
  lg: { svgW: 72, svgH: 38, fontSize: "24px", gap: "12px", strokeW: 3.5 },
};

/**
 * Compact EKG heartbeat path across a 80×40 viewBox.
 * Single clean spike — flat → sharp up spike → sharp down → flat.
 * Thick stroke, compact proportions, NO letter shapes.
 */
const EKG_PATH =
  "M 0 22 L 18 22 L 24 22 L 32 4 L 38 36 L 44 22 L 52 22 L 80 22";

export function PulseWaveLogo({
  size = "md",
  layout = "horizontal",
  className = "",
}: PulseWaveLogoProps) {
  const { svgW, svgH, fontSize, gap, strokeW } = SIZE_MAP[size];
  const filterId = `ekgGlow_${size}`;

  const svgEl = (
    <svg
      viewBox="0 0 80 40"
      width={svgW}
      height={svgH}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pulse wave"
      style={{ flexShrink: 0, overflow: "visible" }}
    >
      <defs>
        <filter id={filterId} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow halo layer */}
      <path
        d={EKG_PATH}
        stroke="#8A2BE2"
        strokeWidth={strokeW * 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.2}
        filter={`url(#${filterId})`}
      />

      {/* Main crisp line */}
      <path
        d={EKG_PATH}
        stroke="#8A2BE2"
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
      />
    </svg>
  );

  const textEl = (
    <span
      style={{
        fontFamily: "Syncopate, sans-serif",
        fontSize,
        fontWeight: 700,
        color: "#ffffff",
        letterSpacing: "0.15em",
        textShadow: "0 0 10px rgba(138,43,226,0.5)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      PULSE AI
    </span>
  );

  if (layout === "vertical") {
    return (
      <div
        className={`inline-flex flex-col items-center select-none ${className}`}
        style={{ gap: "12px" }}
      >
        {svgEl}
        {textEl}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-row items-center select-none ${className}`}
      style={{ gap }}
    >
      {svgEl}
      {textEl}
    </div>
  );
}
