import { Layers } from "lucide-react";
import { useState } from "react";

type FilterTab = "All" | "Sparks" | "Moments" | "Echoes";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "All", label: "All (\u221e)" },
  { id: "Sparks", label: "Sparks (\u2728)" },
  { id: "Moments", label: "Moments (\ud83d\udcf8)" },
  { id: "Echoes", label: "Echoes (\ud83d\udc64)" },
];

export function TwinTab() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  return (
    <div
      className="flex flex-col min-h-full"
      style={{
        background:
          "linear-gradient(180deg, #050508 0%, #0a0514 60%, #050508 100%)",
      }}
      data-ocid="twin.page"
    >
      {/* ── TOP SECTION: Avatar + Username ── */}
      <div className="flex flex-col items-center pt-7 pb-4 px-4">
        {/* Glowing ring wrapper */}
        <div
          className="relative flex items-center justify-center nexus-twin-ring"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 50%, #8A2BE2 100%)",
            padding: 2,
          }}
        >
          {/* 3D Sphere Avatar */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(220,180,255,0.6) 0%, rgba(138,43,226,0.8) 28%, rgba(80,0,160,0.9) 55%, rgba(20,5,40,1) 80%, rgba(5,0,15,1) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Specular highlight */}
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "18%",
                width: 22,
                height: 14,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%)",
                transform: "rotate(-20deg)",
                filter: "blur(1.5px)",
              }}
            />
            {/* Initials */}
            <span
              style={{
                fontFamily: "Syncopate, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                letterSpacing: "0.06em",
                userSelect: "none",
              }}
            >
              AK
            </span>
          </div>
        </div>

        {/* Username */}
        <p
          className="mt-3 text-white"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          @akhilesh
        </p>

        {/* AI Twin badge */}
        <div
          className="mt-2 px-3 py-1 rounded-full text-[11px] font-medium"
          style={{
            fontFamily: "Inter, sans-serif",
            color: "#c084fc",
            border: "1px solid rgba(138,43,226,0.6)",
            background: "rgba(138,43,226,0.1)",
            boxShadow:
              "0 0 10px rgba(138,43,226,0.35), inset 0 0 8px rgba(138,43,226,0.08)",
          }}
        >
          AI Twin 🤖
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div
        className="flex items-stretch mx-4 rounded-xl"
        style={{
          background: "rgba(15,10,25,0.7)",
          border: "1px solid rgba(138,43,226,0.15)",
        }}
        data-ocid="twin.panel"
      >
        {[
          { value: "1.5T", label: "Synapses" },
          { value: "320", label: "Pulsing" },
          { value: "42", label: "Sparks" },
          { value: "85", label: "Moments" },
        ].map((stat, i, arr) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col items-center py-3 relative"
          >
            {i < arr.length - 1 && (
              <div
                className="absolute right-0 top-3 bottom-3"
                style={{ width: 1, background: "rgba(138,43,226,0.25)" }}
              />
            )}
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#8A2BE2",
                textShadow: "0 0 8px rgba(138,43,226,0.6)",
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                color: "rgba(160,160,190,0.85)",
                marginTop: 2,
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── BIO SECTION: Twin Persona ── */}
      <div
        className="mx-4 mt-3 px-4 py-3"
        style={{
          background: "rgba(15,10,25,0.7)",
          border: "1px solid rgba(138,43,226,0.2)",
          borderRadius: 12,
        }}
        data-ocid="twin.card"
      >
        <h3
          style={{
            fontFamily: "Syncopate, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "#8A2BE2",
            textShadow:
              "0 0 10px rgba(138,43,226,0.7), 0 0 20px rgba(138,43,226,0.3)",
            letterSpacing: "0.12em",
            marginBottom: 10,
          }}
        >
          TWIN PERSONA
        </h3>
        <ul className="space-y-2">
          {[
            "Friendly",
            "Tech Enthusiast",
            "Status: 🟢 Active (Auto-replying)",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "rgba(200,195,220,0.9)",
              }}
            >
              <span
                style={{
                  color: "#8A2BE2",
                  textShadow: "0 0 6px rgba(138,43,226,0.7)",
                  flexShrink: 0,
                  lineHeight: "1.4",
                }}
              >
                ✦
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── FILTER TABS ── */}
      <div
        className="flex gap-2 mt-4 scrollbar-hide"
        style={{
          overflowX: "auto",
          padding: "0 16px 12px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        data-ocid="twin.tab"
      >
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-ocid={`twin.${tab.id.toLowerCase()}.tab`}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontFamily: "Outfit, sans-serif",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.25s ease",
                border: isActive
                  ? "1px solid #8A2BE2"
                  : "1px solid rgba(138,43,226,0.25)",
                background: isActive
                  ? "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)"
                  : "transparent",
                color: isActive ? "#ffffff" : "rgba(160,155,185,0.85)",
                boxShadow: isActive
                  ? "0 0 14px rgba(138,43,226,0.6), 0 0 28px rgba(138,43,226,0.25)"
                  : "none",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── GRID EMPTY STATE ── */}
      <div
        className="flex-1 flex items-center justify-center py-12 px-6"
        data-ocid="twin.empty.grid"
        style={{ minHeight: 160 }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(138,43,226,0.06)",
              border: "1px solid rgba(138,43,226,0.15)",
            }}
          >
            <Layers
              className="w-6 h-6"
              style={{ color: "rgba(138,43,226,0.35)" }}
            />
          </div>

          <div className="space-y-1.5">
            <p
              className="text-[14px] font-semibold text-gray-300"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              No posts yet
            </p>
            <p
              className="text-[11px] text-gray-600 leading-relaxed max-w-[200px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Your Sparks and Moments will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
