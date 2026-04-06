import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PlusCircle,
  Share2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useState } from "react";

/* ───────── Types ───────── */
interface Story {
  id: number;
  name: string;
  avatarUrl?: string;
  initials?: string;
  gradientFrom?: string;
  gradientTo?: string;
  isAiTwin?: boolean;
}

interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  pulseCount: number;
  echoCount: number;
  remixCount: number;
  shareCount: number;
  saveCount: number;
  timestamp: string;
}

/* ───────── Data ───────── */
const stories: Story[] = [
  { id: 1, name: "Your Story", initials: "+" },
  {
    id: 2,
    name: "Coding Aura",
    avatarUrl: "/assets/generated/avatar-ai-twin.dim_80x80.jpg",
    isAiTwin: true,
  },
  {
    id: 3,
    name: "akhilesh",
    avatarUrl: "/assets/generated/avatar-akhilesh.dim_80x80.jpg",
  },
  {
    id: 4,
    name: "nova_x",
    avatarUrl: "/assets/generated/avatar-nova.dim_80x80.jpg",
  },
  {
    id: 5,
    name: "kira.ai",
    avatarUrl: "/assets/generated/avatar-kira.dim_80x80.jpg",
  },
  {
    id: 6,
    name: "zephyr",
    initials: "ZP",
    gradientFrom: "#00C6FF",
    gradientTo: "#0072FF",
  },
  {
    id: 7,
    name: "lyra_v",
    initials: "LV",
    gradientFrom: "#f953c6",
    gradientTo: "#b91d73",
  },
];

const posts: Post[] = [
  {
    id: 1,
    imageUrl: "/assets/generated/vibe-post-1.dim_390x480.jpg",
    caption: "The city that never sleeps, now dreaming in neon. ✨",
    hashtags: ["#PulseVibe", "#NeonCity", "#AIArt"],
    pulseCount: 2847,
    echoCount: 183,
    remixCount: 74,
    shareCount: 219,
    saveCount: 501,
    timestamp: "2m ago",
  },
  {
    id: 2,
    imageUrl: "/assets/generated/vibe-post-2.dim_390x480.jpg",
    caption:
      "She exists between signals and silence. AI breathes life into dreams.",
    hashtags: ["#CodingAura", "#PulseVibe", "#DigitalSoul"],
    pulseCount: 4312,
    echoCount: 327,
    remixCount: 141,
    shareCount: 88,
    saveCount: 962,
    timestamp: "18m ago",
  },
  {
    id: 3,
    imageUrl: "/assets/generated/vibe-post-3.dim_390x480.jpg",
    caption: "Lost in the vortex of creation. Every pixel a universe.",
    hashtags: ["#CosmicVibes", "#PulseAI", "#PulseVibe"],
    pulseCount: 1593,
    echoCount: 98,
    remixCount: 56,
    shareCount: 143,
    saveCount: 337,
    timestamp: "1h ago",
  },
];

/* ───────── Helpers ───────── */
function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/* ───────── Story Item ───────── */
function StoryItem({ story }: { story: Story }) {
  const isYourStory = story.id === 1;

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      {isYourStory ? (
        /* Your Story — plus button, no ring */
        <button
          type="button"
          data-ocid="vibe.story.add_button"
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#1a1a2e] border border-dashed border-gray-600 hover:border-[#8A2BE2] transition-colors"
        >
          <PlusCircle className="w-7 h-7 text-gray-500" />
        </button>
      ) : (
        /* Normal story — neon gradient ring */
        <div
          className="w-[60px] h-[60px] rounded-full p-[2px] flex-shrink-0"
          style={{
            background: story.isAiTwin
              ? "linear-gradient(135deg, #8A2BE2, #6F00FF, #00eaff)"
              : "linear-gradient(135deg, #8A2BE2, #6F00FF)",
            boxShadow: story.isAiTwin
              ? "0 0 14px rgba(138,43,226,0.6), 0 0 28px rgba(111,0,255,0.3)"
              : "0 0 8px rgba(138,43,226,0.35)",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-black">
            {story.avatarUrl ? (
              <img
                src={story.avatarUrl}
                alt={story.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-outfit font-bold"
                style={{
                  background: `linear-gradient(135deg, ${story.gradientFrom ?? "#8A2BE2"}, ${story.gradientTo ?? "#6F00FF"})`,
                }}
              >
                {story.initials}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Name */}
      <span className="text-[10px] text-center text-gray-400 font-inter truncate max-w-[60px]">
        {isYourStory ? "Your Story" : story.name}
      </span>

      {/* AI Twin badge */}
      {story.isAiTwin && (
        <div
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-inter font-semibold -mt-0.5"
          style={{
            background: "rgba(138,43,226,0.15)",
            border: "1px solid rgba(138,43,226,0.4)",
            color: "#8A2BE2",
          }}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Coding Aura</span>
        </div>
      )}
    </div>
  );
}

/* ───────── Post Card ───────── */
function PostCard({ post, index }: { post: Post; index: number }) {
  const [pulsed, setPulsed] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <article
      data-ocid={`vibe.item.${index + 1}`}
      className="rounded-2xl overflow-hidden mx-4 my-3"
      style={{
        background: "rgba(25, 20, 40, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(138, 43, 226, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar with neon ring */}
          <div
            className="w-9 h-9 rounded-full p-[2px] flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #8A2BE2, #6F00FF)",
              boxShadow: "0 0 8px rgba(138,43,226,0.4)",
            }}
          >
            <img
              src="/assets/generated/avatar-akhilesh.dim_80x80.jpg"
              alt="akhilesh"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* Name stack */}
          <div>
            <p className="font-outfit font-semibold text-[14px] leading-tight text-white">
              akhilesh
            </p>
            <p className="font-inter text-[12px] leading-tight text-gray-400">
              @akhilesh
            </p>
          </div>
        </div>

        <button
          type="button"
          data-ocid={`vibe.post.options.${index + 1}`}
          className="p-1 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-0"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image with Enhanced badge */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt="AI generated post"
          className="w-full object-cover"
          style={{ maxHeight: "280px" }}
        />
        {/* Enhanced by Pulse AI badge */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-inter text-white"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(138,43,226,0.4)",
          }}
        >
          <span>✨</span>
          <span>Enhanced by Pulse AI</span>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left actions: Pulse, Echo, Remix */}
        <div className="flex items-center gap-4">
          {/* Pulse */}
          <button
            type="button"
            data-ocid={`vibe.pulse.button.${index + 1}`}
            onClick={() => setPulsed((v) => !v)}
            className="flex items-center gap-1 bg-transparent border-0 p-0 transition-all duration-200 hover:scale-110"
          >
            <Heart
              className="w-5 h-5 transition-colors duration-200"
              style={{
                color: pulsed ? "#ff4d6d" : undefined,
                fill: pulsed ? "#ff4d6d" : "none",
              }}
              color={pulsed ? "#ff4d6d" : "#9ca3af"}
            />
            <span className="text-xs text-gray-400 font-inter ml-0.5">
              {formatCount(post.pulseCount + (pulsed ? 1 : 0))}
            </span>
          </button>

          {/* Echo */}
          <button
            type="button"
            data-ocid={`vibe.echo.button.${index + 1}`}
            className="flex items-center gap-1 bg-transparent border-0 p-0 hover:opacity-80 transition-opacity"
          >
            <MessageCircle className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400 font-inter ml-0.5">
              {formatCount(post.echoCount)}
            </span>
          </button>

          {/* Remix */}
          <button
            type="button"
            data-ocid={`vibe.remix.button.${index + 1}`}
            className="flex items-center gap-1 bg-transparent border-0 p-0 hover:opacity-80 transition-opacity"
          >
            <Wand2 className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400 font-inter ml-0.5">
              {formatCount(post.remixCount)}
            </span>
          </button>
        </div>

        {/* Right actions: Share, Save */}
        <div className="flex items-center gap-4">
          {/* Share */}
          <button
            type="button"
            data-ocid={`vibe.share.button.${index + 1}`}
            className="flex items-center gap-1 bg-transparent border-0 p-0 hover:opacity-80 transition-opacity"
          >
            <Share2 className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400 font-inter ml-0.5">
              {formatCount(post.shareCount)}
            </span>
          </button>

          {/* Save */}
          <button
            type="button"
            data-ocid={`vibe.save.button.${index + 1}`}
            onClick={() => setSaved((v) => !v)}
            className="flex items-center gap-1 bg-transparent border-0 p-0 transition-all duration-200 hover:scale-110"
          >
            <Bookmark
              className="w-5 h-5 transition-colors duration-200"
              style={{
                color: saved ? "#8A2BE2" : undefined,
                fill: saved ? "#8A2BE2" : "none",
              }}
              color={saved ? "#8A2BE2" : "#9ca3af"}
            />
            <span className="text-xs text-gray-400 font-inter ml-0.5">
              {formatCount(post.saveCount + (saved ? 1 : 0))}
            </span>
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <p className="text-sm font-inter text-gray-300 leading-relaxed">
          <span className="font-semibold text-white font-outfit">
            akhilesh{" "}
          </span>
          {post.caption}
        </p>
        <p className="mt-1">
          {post.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-inter mr-1.5"
              style={{ color: "#8A2BE2" }}
            >
              {tag}
            </span>
          ))}
        </p>
        <p className="text-[10px] text-gray-600 font-inter mt-1">
          {post.timestamp}
        </p>
      </div>
    </article>
  );
}

/* ───────── Main VibeTab ───────── */
export function VibeTab() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Stories */}
      <div className="border-b border-gray-800/50">
        <div className="flex flex-row gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <StoryItem key={story.id} story={story} />
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="py-2">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
