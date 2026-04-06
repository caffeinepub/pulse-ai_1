import { ImageIcon, RefreshCw, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { generateSpark } from "../services/apiService";

const AI_STYLES = [
  "Cyberpunk",
  "Anime",
  "Oil Painting",
  "Watercolor",
  "Neon Noir",
  "Glitch Art",
  "Pixel Art",
];

/* ─── Keyframe animations ─── */
const scanlineKeyframes = `
  @keyframes scan-line {
    0% { top: 0%; opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes shutter-flash {
    0% { opacity: 0; }
    15% { opacity: 0.9; }
    100% { opacity: 0; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 0.3; }
    100% { transform: scale(0.8); opacity: 0.6; }
  }
  @keyframes spark-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export function IgniteTab() {
  const [selectedStyle, setSelectedStyle] = useState("Cyberpunk");
  const [isFlashed, setIsFlashed] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShutter = () => {
    if (isFlashed) return;
    setIsFlashed(true);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setIsFlashed(false), 500);
  };

  const handleFlip = () => {
    setFlipCount((c) => c + 1);
  };

  const handleSparkTap = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateSpark("", selectedStyle);
      setGeneratedImageUrl(imageUrl);
      toast.success("Spark created successfully!", {
        description: `${selectedStyle} style generated.`,
        duration: 3000,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to generate Spark. Try again.";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratedImageUrl(null);
    handleSparkTap();
  };

  return (
    <>
      <style>{scanlineKeyframes}</style>

      {/* Flash overlay */}
      {isFlashed && (
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: "rgba(255,255,255,0.85)",
            animation: "shutter-flash 500ms ease-out forwards",
          }}
        />
      )}

      <div
        className="flex flex-col h-full"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* ── IGNITE Header ── */}
        <div
          className="flex items-center justify-center gap-2 py-2 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(138,43,226,0.2)" }}
        >
          <Zap
            className="w-4 h-4"
            style={{
              color: "#8A2BE2",
              filter: "drop-shadow(0 0 8px rgba(138,43,226,0.9))",
            }}
          />
          <span
            className="text-base font-bold tracking-[0.25em]"
            style={{
              fontFamily: "Syncopate, sans-serif",
              color: "#c084fc",
              textShadow:
                "0 0 16px rgba(138,43,226,0.9), 0 0 32px rgba(138,43,226,0.4)",
            }}
          >
            IGNITE
          </span>
          <Zap
            className="w-4 h-4"
            style={{
              color: "#8A2BE2",
              filter: "drop-shadow(0 0 8px rgba(138,43,226,0.9))",
            }}
          />
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {/* ════════ SPARK Section ════════ */}
          <div
            className="flex flex-col flex-1 min-h-0 px-3 pt-2 pb-1"
            style={{ borderBottom: "1px solid rgba(138,43,226,0.15)" }}
          >
            <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-semibold"
                style={{
                  fontFamily: "Outfit, sans-serif",
                  color: "#8A2BE2",
                  textShadow: "0 0 8px rgba(138,43,226,0.6)",
                }}
              >
                ✨ SPARK
              </span>
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(138,43,226,0.4), transparent)",
                }}
              />
            </div>

            {/* SPARK canvas — button when idle, div when generating/showing image */}
            {!isGenerating && !generatedImageUrl ? (
              <button
                type="button"
                data-ocid="ignite.spark.canvas_target"
                onClick={handleSparkTap}
                className="relative flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-0 w-full"
                style={{
                  background: "rgba(10,5,20,0.95)",
                  border: "1px solid rgba(138,43,226,0.35)",
                  boxShadow:
                    "inset 0 0 40px rgba(138,43,226,0.08), 0 0 20px rgba(138,43,226,0.1)",
                  cursor: "pointer",
                }}
              >
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(138,43,226,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(138,43,226,0.06) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {/* Scanning line */}
                <div
                  className="absolute left-0 right-0 h-px pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(138,43,226,0.8), transparent)",
                    animation: "scan-line 3s linear infinite",
                    boxShadow: "0 0 8px rgba(138,43,226,0.6)",
                  }}
                />
                {/* AI badge */}
                <div
                  className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(10,5,25,0.9)",
                    border: "1px solid rgba(138,43,226,0.6)",
                    boxShadow: "0 0 8px rgba(138,43,226,0.3)",
                  }}
                >
                  <Sparkles
                    className="w-2.5 h-2.5"
                    style={{ color: "#8A2BE2" }}
                  />
                  <span
                    className="text-[9px] font-semibold tracking-wider"
                    style={{ color: "#8A2BE2" }}
                  >
                    AI
                  </span>
                </div>
                {/* Center content */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(138,43,226,0.12)",
                      border: "1px solid rgba(138,43,226,0.3)",
                      boxShadow: "0 0 20px rgba(138,43,226,0.2)",
                    }}
                  >
                    <Sparkles
                      className="w-6 h-6"
                      style={{
                        color: "#8A2BE2",
                        filter: "drop-shadow(0 0 6px rgba(138,43,226,0.8))",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium tracking-widest uppercase"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      color: "rgba(160,130,200,0.7)",
                      letterSpacing: "0.18em",
                    }}
                  >
                    AI Creation Mode
                  </span>
                  <span
                    className="text-[9px]"
                    style={{
                      color: "rgba(138,43,226,0.5)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Tap to generate
                  </span>
                </div>
              </button>
            ) : (
              <div
                data-ocid="ignite.spark.canvas_target"
                className="relative flex-1 rounded-xl overflow-hidden flex items-center justify-center min-h-0"
                style={{
                  background: "rgba(10,5,20,0.95)",
                  border: generatedImageUrl
                    ? "1px solid rgba(138,43,226,0.6)"
                    : "1px solid rgba(138,43,226,0.35)",
                  boxShadow: generatedImageUrl
                    ? "inset 0 0 40px rgba(138,43,226,0.12), 0 0 30px rgba(138,43,226,0.2)"
                    : "inset 0 0 40px rgba(138,43,226,0.08), 0 0 20px rgba(138,43,226,0.1)",
                }}
              >
                {isGenerating ? (
                  /* ── Generating state ── */
                  <>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(138,43,226,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(138,43,226,0.08) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <div
                      className="absolute left-0 right-0 h-px pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(138,43,226,0.9), transparent)",
                        animation: "scan-line 1.5s linear infinite",
                        boxShadow: "0 0 12px rgba(138,43,226,0.8)",
                      }}
                    />
                    <div className="flex flex-col items-center gap-3 z-10">
                      <div className="relative flex items-center justify-center">
                        <div
                          className="absolute w-16 h-16 rounded-full"
                          style={{
                            border: "1px solid rgba(138,43,226,0.5)",
                            animation: "pulse-ring 1.5s ease-in-out infinite",
                          }}
                        />
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                          role="img"
                          aria-label="Generating Spark"
                          style={{ animation: "spark-spin 1s linear infinite" }}
                        >
                          <title>Generating Spark</title>
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="rgba(138,43,226,0.2)"
                            strokeWidth="2"
                          />
                          <path
                            d="M24 4 A20 20 0 0 1 44 24"
                            stroke="#8A2BE2"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <Sparkles
                          className="absolute w-5 h-5"
                          style={{
                            color: "#8A2BE2",
                            filter: "drop-shadow(0 0 8px rgba(138,43,226,0.9))",
                          }}
                        />
                      </div>
                      <span
                        className="text-[11px] font-medium tracking-widest uppercase"
                        style={{
                          fontFamily: "Outfit, sans-serif",
                          color: "rgba(138,43,226,0.8)",
                        }}
                      >
                        Generating Spark...
                      </span>
                    </div>
                    <div
                      className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(10,5,25,0.9)",
                        border: "1px solid rgba(138,43,226,0.6)",
                        boxShadow: "0 0 8px rgba(138,43,226,0.3)",
                      }}
                    >
                      <Sparkles
                        className="w-2.5 h-2.5"
                        style={{ color: "#8A2BE2" }}
                      />
                      <span
                        className="text-[9px] font-semibold tracking-wider"
                        style={{ color: "#8A2BE2" }}
                      >
                        AI
                      </span>
                    </div>
                  </>
                ) : generatedImageUrl ? (
                  /* ── Generated image state ── */
                  <>
                    <img
                      src={generatedImageUrl}
                      alt={`${selectedStyle} Spark`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full z-10"
                      style={{
                        background: "rgba(10,5,25,0.85)",
                        border: "1px solid rgba(138,43,226,0.7)",
                        boxShadow: "0 0 10px rgba(138,43,226,0.4)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Sparkles
                        className="w-2.5 h-2.5"
                        style={{ color: "#8A2BE2" }}
                      />
                      <span
                        className="text-[9px] font-semibold tracking-wider"
                        style={{ color: "#c084fc" }}
                      >
                        Enhanced by Pulse AI
                      </span>
                    </div>
                    <button
                      type="button"
                      data-ocid="ignite.spark.secondary_button"
                      onClick={handleRegenerate}
                      className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-200"
                      style={{
                        background: "rgba(10,5,25,0.85)",
                        border: "1px solid rgba(138,43,226,0.6)",
                        boxShadow: "0 0 12px rgba(138,43,226,0.4)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <RefreshCw
                        className="w-3.5 h-3.5"
                        style={{ color: "#8A2BE2" }}
                      />
                    </button>
                    <div
                      className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full z-10"
                      style={{
                        background: "rgba(10,5,25,0.8)",
                        border: "1px solid rgba(138,43,226,0.4)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <span
                        className="text-[9px] font-medium tracking-wider"
                        style={{ color: "rgba(192,132,252,0.9)" }}
                      >
                        {selectedStyle}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {/* AI Styles row */}
            <div className="flex flex-row gap-2 py-2 overflow-x-auto scrollbar-hide flex-shrink-0">
              {AI_STYLES.map((style) => {
                const isActive = selectedStyle === style;
                const styleId = style.toLowerCase().replace(/\s+/g, "-");
                return (
                  <button
                    key={style}
                    type="button"
                    data-ocid={`ignite.style.${styleId}`}
                    onClick={() => {
                      setSelectedStyle(style);
                      if (generatedImageUrl) setGeneratedImageUrl(null);
                    }}
                    className="flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-200"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      background: isActive
                        ? "#8A2BE2"
                        : "rgba(138,43,226,0.07)",
                      border: isActive
                        ? "1px solid #8A2BE2"
                        : "1px solid rgba(138,43,226,0.4)",
                      color: isActive ? "#ffffff" : "#9ca3af",
                      boxShadow: isActive
                        ? "0 0 12px rgba(138,43,226,0.6), 0 0 24px rgba(138,43,226,0.2)"
                        : "none",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ════════ MOMENT Section ════════ */}
          <div className="flex flex-col flex-1 min-h-0 px-3 pt-2 pb-3">
            <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-semibold"
                style={{ fontFamily: "Outfit, sans-serif", color: "#6b7280" }}
              >
                📸 MOMENT
              </span>
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(100,100,120,0.4), transparent)",
                }}
              />
            </div>

            <div
              className="relative flex-1 rounded-xl overflow-hidden flex flex-col items-center justify-between min-h-0 py-3"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(20,20,30,0.95) 0%, rgba(5,5,10,0.98) 100%)",
                border: "1px solid rgba(80,80,100,0.35)",
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* Film grain overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Corner brackets - Top-left */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <div
                  style={{
                    width: 16,
                    height: 2,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{
                    width: 2,
                    height: 14,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
              </div>
              {/* Top-right */}
              <div className="absolute top-3 right-3 pointer-events-none flex flex-col items-end">
                <div
                  style={{
                    width: 16,
                    height: 2,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{
                    width: 2,
                    height: 14,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
              </div>
              {/* Bottom-left */}
              <div className="absolute bottom-3 left-3 pointer-events-none flex flex-col justify-end">
                <div
                  style={{
                    width: 2,
                    height: 14,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{
                    width: 16,
                    height: 2,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
              </div>
              {/* Bottom-right */}
              <div className="absolute bottom-3 right-3 pointer-events-none flex flex-col items-end justify-end">
                <div
                  style={{
                    width: 2,
                    height: 14,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
                <div
                  style={{
                    width: 16,
                    height: 2,
                    background: "rgba(255,255,255,0.45)",
                    borderRadius: 1,
                  }}
                />
              </div>

              {/* RAW badge */}
              <div
                className="absolute top-4 left-4 px-2 py-0.5 rounded"
                style={{
                  background: "rgba(10,10,15,0.85)",
                  border: "1px solid rgba(120,120,140,0.4)",
                }}
              >
                <span
                  className="text-[9px] font-semibold tracking-widest"
                  style={{
                    color: "rgba(160,160,180,0.85)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  RAW
                </span>
              </div>

              {/* Center crosshair */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-5 h-5">
                  <div
                    className="absolute top-1/2 left-0 right-0"
                    style={{ height: 1, background: "rgba(255,255,255,0.35)" }}
                  />
                  <div
                    className="absolute left-1/2 top-0 bottom-0"
                    style={{ width: 1, background: "rgba(255,255,255,0.35)" }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
                    style={{
                      transform: "translate(-50%, -50%)",
                      background: "rgba(255,255,255,0.7)",
                    }}
                  />
                </div>
              </div>

              {/* Shutter row */}
              <div className="flex items-center justify-between w-full px-8 pb-1 flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                  style={{
                    background: "rgba(30,30,45,0.9)",
                    border: "1px solid rgba(80,80,100,0.4)",
                  }}
                >
                  <ImageIcon
                    className="w-5 h-5"
                    style={{ color: "rgba(140,140,160,0.7)" }}
                  />
                </div>

                <button
                  type="button"
                  data-ocid="ignite.shutter.button"
                  onClick={handleShutter}
                  className="relative w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    border: "3px solid rgba(255,255,255,0.5)",
                    boxShadow:
                      "0 0 0 2px rgba(80,80,100,0.6), 0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{
                      background: "rgba(255,255,255,1)",
                      border: "2px solid rgba(200,200,220,0.6)",
                    }}
                  />
                </button>

                <button
                  type="button"
                  data-ocid="ignite.flip.button"
                  onClick={handleFlip}
                  className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200"
                  style={{
                    background: "rgba(30,30,45,0.9)",
                    border: "1px solid rgba(80,80,100,0.4)",
                  }}
                >
                  <RotateCcw
                    className="w-5 h-5 transition-transform duration-500"
                    style={{
                      color: "rgba(140,140,160,0.8)",
                      transform: `rotate(${flipCount * 180}deg)`,
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
