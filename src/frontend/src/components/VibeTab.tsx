import { PlusCircle, Radio } from "lucide-react";

/* ───────── Main VibeTab ───────── */
export function VibeTab() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Stories row — empty state */}
      <div className="border-b border-gray-800/50">
        <div className="flex flex-row items-center gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
          {/* Your Story button — always visible */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              data-ocid="vibe.story.add_button"
              className="w-14 h-14 rounded-full flex items-center justify-center bg-[#1a1a2e] border border-dashed border-gray-600 hover:border-[#8A2BE2] transition-colors"
            >
              <PlusCircle className="w-7 h-7 text-gray-500" />
            </button>
            <span className="text-[10px] text-center text-gray-400 font-inter truncate max-w-[60px]">
              Your Story
            </span>
          </div>

          {/* Empty state for other stories */}
          <div className="flex items-center">
            <span className="text-[11px] text-gray-600 font-inter">
              No stories yet
            </span>
          </div>
        </div>
      </div>

      {/* Feed — empty state */}
      <div
        className="flex-1 flex items-center justify-center py-16 px-6"
        data-ocid="vibe.empty.feed"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Muted neon violet icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(138,43,226,0.06)",
              border: "1px solid rgba(138,43,226,0.15)",
            }}
          >
            <Radio
              className="w-7 h-7"
              style={{ color: "rgba(138,43,226,0.35)" }}
            />
          </div>

          <div className="space-y-1.5">
            <p
              className="text-[15px] font-semibold text-gray-300"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              No posts yet
            </p>
            <p
              className="text-[12px] text-gray-600 leading-relaxed max-w-[220px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Follow others to see their vibes here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
