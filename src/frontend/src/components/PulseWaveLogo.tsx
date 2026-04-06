interface PulseWaveLogoProps {
  size?: "large" | "small" | "tiny";
  className?: string;
}

export function PulseWaveLogo({
  size = "large",
  className = "",
}: PulseWaveLogoProps) {
  const dimensions = {
    large: { width: 160, height: 80, strokeWidth: 3 },
    small: { width: 100, height: 50, strokeWidth: 2.5 },
    tiny: { width: 64, height: 32, strokeWidth: 2 },
  };

  const { width, height, strokeWidth } = dimensions[size];

  const waveformPath =
    "M 10 50 L 38 50 L 38 20 Q 38 10 50 10 Q 62 10 62 22 Q 62 34 50 34 L 38 34 L 38 50 L 58 50 L 68 20 L 78 80 L 88 10 L 98 70 L 110 50 L 190 50";

  return (
    <div
      className={`animate-pulse-glow inline-flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <svg
        viewBox="0 0 200 100"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Pulse Wave Logo"
      >
        <title>Pulse Wave Logo</title>
        {/* Glow filter */}
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="neon-glow-intense"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind the waveform */}
        <path
          d={waveformPath}
          stroke="#8A2BE2"
          strokeWidth={strokeWidth * 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
          filter="url(#neon-glow-intense)"
        />

        {/* Main waveform + P shape */}
        <path
          d={waveformPath}
          stroke="#8A2BE2"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#neon-glow)"
        />

        {/* Accent dot at start */}
        <circle
          cx="10"
          cy="50"
          r={strokeWidth * 1.2}
          fill="#8A2BE2"
          filter="url(#neon-glow)"
        />

        {/* Accent dot at end */}
        <circle
          cx="190"
          cy="50"
          r={strokeWidth * 0.8}
          fill="#8A2BE2"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
