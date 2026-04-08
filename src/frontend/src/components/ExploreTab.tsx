import { Compass, Search, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

/* ─── Data ─── */
const TAGS = [
  "#Cyberpunk",
  "#Anime",
  "#Nature",
  "#Abstract",
  "#Space",
  "#Portraits",
  "#Digital",
  "#Surreal",
];

/* ─── Main ExploreTab ─── */
export function ExploreTab() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Section 1: Search Bar ── */}
      <div
        className="sticky top-0 z-20 px-4 py-3"
        style={{
          background: "rgba(10,10,20,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(138,43,226,0.12)",
        }}
      >
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300"
          style={{
            background: "rgba(20,10,35,0.85)",
            border: isFocused
              ? "1px solid rgba(138,43,226,0.7)"
              : "1px solid rgba(138,43,226,0.3)",
            boxShadow: isFocused
              ? "0 0 0 2px rgba(138,43,226,0.18), 0 0 20px rgba(138,43,226,0.12)"
              : "none",
          }}
        >
          <Search
            className="w-4 h-4 flex-shrink-0 transition-colors duration-200"
            style={{ color: isFocused ? "#8A2BE2" : "rgba(138,43,226,0.6)" }}
          />
          <input
            ref={inputRef}
            data-ocid="explore.search.input"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask AI to explore..."
            className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-gray-500 font-inter"
          />
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 transition-all duration-300"
            style={{
              background: isFocused
                ? "rgba(138,43,226,0.2)"
                : "rgba(138,43,226,0.08)",
              border: "1px solid rgba(138,43,226,0.35)",
              boxShadow: isFocused ? "0 0 8px rgba(138,43,226,0.3)" : "none",
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: "#8A2BE2" }} />
            <span
              className="text-[9px] font-inter font-semibold tracking-wider"
              style={{ color: "#8A2BE2" }}
            >
              AI
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Pill Tags ── */}
      <div
        className="flex flex-row gap-2 px-4 py-3 overflow-x-auto scrollbar-hide flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        {TAGS.map((tag) => {
          const isActive = activeTag === tag;
          const tagId = tag.replace("#", "").toLowerCase();
          return (
            <button
              key={tag}
              type="button"
              data-ocid={`explore.tag.${tagId}`}
              onClick={() => setActiveTag(isActive ? null : tag)}
              className="flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-inter transition-all duration-200"
              style={{
                background: isActive ? "#8A2BE2" : "rgba(138,43,226,0.08)",
                border: isActive
                  ? "1px solid #8A2BE2"
                  : "1px solid rgba(138,43,226,0.45)",
                color: isActive ? "#ffffff" : "#d1d5db",
                boxShadow: isActive
                  ? "0 0 12px rgba(138,43,226,0.5), 0 0 24px rgba(138,43,226,0.2)"
                  : "none",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* ── Section 3: Empty State ── */}
      <div
        className="flex-1 flex items-center justify-center py-16 px-6"
        data-ocid="explore.empty.grid"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(138,43,226,0.06)",
              border: "1px solid rgba(138,43,226,0.15)",
            }}
          >
            <Compass
              className="w-7 h-7"
              style={{ color: "rgba(138,43,226,0.35)" }}
            />
          </div>

          <div className="space-y-1.5">
            <p
              className="text-[15px] font-semibold text-gray-300"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              No signals found
            </p>
            <p
              className="text-[12px] text-gray-600 leading-relaxed max-w-[220px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Explore content will appear here once connected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
