import { Play, Search, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

/* ─── Types ─── */
interface GridItem {
  id: number;
  src: string;
  label: string;
  isVideo?: boolean;
}

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

const GRID_ITEMS: GridItem[] = [
  {
    id: 1,
    src: "/assets/generated/explore-cyberpunk-1.dim_200x280.jpg",
    label: "#Cyberpunk",
    isVideo: false,
  },
  {
    id: 2,
    src: "/assets/generated/explore-anime-1.dim_200x240.jpg",
    label: "#Anime",
    isVideo: false,
  },
  {
    id: 3,
    src: "/assets/generated/explore-abstract-1.dim_200x200.jpg",
    label: "#Abstract",
    isVideo: true,
  },
  {
    id: 4,
    src: "/assets/generated/explore-cyberpunk-2.dim_200x300.jpg",
    label: "#Cyberpunk",
    isVideo: false,
  },
  {
    id: 5,
    src: "/assets/generated/explore-anime-2.dim_200x250.jpg",
    label: "#Anime",
    isVideo: true,
  },
  {
    id: 6,
    src: "/assets/generated/explore-abstract-2.dim_200x220.jpg",
    label: "#Abstract",
    isVideo: false,
  },
  {
    id: 7,
    src: "/assets/generated/explore-nature-2.dim_200x230.jpg",
    label: "#Nature",
    isVideo: false,
  },
  {
    id: 8,
    src: "/assets/generated/explore-nature-1.dim_200x260.jpg",
    label: "#Nature",
    isVideo: true,
  },
];

/* ─── Grid Item ─── */
function MasonryItem({ item, index }: { item: GridItem; index: number }) {
  return (
    <div
      data-ocid={`explore.grid.item.${index + 1}`}
      className="break-inside-avoid mb-2 rounded-xl overflow-hidden relative border border-white/5 cursor-pointer group"
    >
      <img
        src={item.src}
        alt={item.label}
        className="w-full object-cover block"
        loading="lazy"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Play button overlay (video items) */}
      {item.isVideo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/50 rounded-full p-2">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Tag label */}
      <span
        className="absolute bottom-2 left-2 text-[9px] font-inter text-white/80 px-1.5 py-0.5 rounded"
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
      >
        {item.label}
      </span>

      {/* Video indicator dot */}
      {item.isVideo && (
        <div
          className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full"
          style={{
            background: "rgba(138,43,226,0.8)",
            boxShadow: "0 0 6px rgba(138,43,226,0.6)",
          }}
        >
          <Play className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      )}
    </div>
  );
}

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
          {/* Left: Search icon */}
          <Search
            className="w-4 h-4 flex-shrink-0 transition-colors duration-200"
            style={{ color: isFocused ? "#8A2BE2" : "rgba(138,43,226,0.6)" }}
          />

          {/* Input */}
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

          {/* Right: AI badge */}
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

      {/* ── Section 3: Masonry Grid ── */}
      <div className="px-3 pt-3 pb-4">
        <div className="columns-2 gap-2">
          {GRID_ITEMS.map((item, i) => (
            <MasonryItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
