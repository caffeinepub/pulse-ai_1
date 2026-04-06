import { Bot } from "lucide-react";
import { useState } from "react";

/* ───────── Types ───────── */
interface ActiveTwin {
  id: number;
  username: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
}

interface Conversation {
  id: number;
  username: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
  lastMessage: string;
  timestamp: string;
  isAiTwin: boolean;
  isUnread: boolean;
}

/* ───────── Data ───────── */
const activeTwins: ActiveTwin[] = [
  {
    id: 1,
    username: "nova_x",
    initials: "NX",
    gradientFrom: "#8A2BE2",
    gradientTo: "#6F00FF",
  },
  {
    id: 2,
    username: "kira.ai",
    initials: "KA",
    gradientFrom: "#00C6FF",
    gradientTo: "#0072FF",
  },
  {
    id: 3,
    username: "zephyr",
    initials: "ZP",
    gradientFrom: "#f953c6",
    gradientTo: "#b91d73",
  },
  {
    id: 4,
    username: "lyra_v",
    initials: "LV",
    gradientFrom: "#43e97b",
    gradientTo: "#38f9d7",
  },
  {
    id: 5,
    username: "vex.ai",
    initials: "VA",
    gradientFrom: "#fa709a",
    gradientTo: "#fee140",
  },
  {
    id: 6,
    username: "axiom_7",
    initials: "A7",
    gradientFrom: "#4facfe",
    gradientTo: "#00f2fe",
  },
];

const conversations: Conversation[] = [
  {
    id: 1,
    username: "nova_x",
    initials: "NX",
    gradientFrom: "#8A2BE2",
    gradientTo: "#6F00FF",
    lastMessage:
      "Your aesthetic just evolved 🌐 want me to remix your latest post?",
    timestamp: "just now",
    isAiTwin: true,
    isUnread: true,
  },
  {
    id: 2,
    username: "kira.ai",
    initials: "KA",
    gradientFrom: "#00C6FF",
    gradientTo: "#0072FF",
    lastMessage: "I analyzed your vibe pattern. Peak hours are 9pm–11pm 💜",
    timestamp: "2m ago",
    isAiTwin: true,
    isUnread: true,
  },
  {
    id: 3,
    username: "akhilesh",
    initials: "AK",
    gradientFrom: "#f7971e",
    gradientTo: "#ffd200",
    lastMessage: "bro that cyberpunk edit was 🔥",
    timestamp: "14m ago",
    isAiTwin: false,
    isUnread: false,
  },
  {
    id: 4,
    username: "zephyr",
    initials: "ZP",
    gradientFrom: "#f953c6",
    gradientTo: "#b91d73",
    lastMessage: "sending you the collab track now, check it",
    timestamp: "31m ago",
    isAiTwin: false,
    isUnread: true,
  },
  {
    id: 5,
    username: "lyra_v",
    initials: "LV",
    gradientFrom: "#43e97b",
    gradientTo: "#38f9d7",
    lastMessage: "Remix request accepted. Generating now...",
    timestamp: "1h ago",
    isAiTwin: true,
    isUnread: false,
  },
  {
    id: 6,
    username: "axiom_7",
    initials: "A7",
    gradientFrom: "#4facfe",
    gradientTo: "#00f2fe",
    lastMessage: "yo did you see the new pulse update?",
    timestamp: "2h ago",
    isAiTwin: false,
    isUnread: false,
  },
  {
    id: 7,
    username: "vex.ai",
    initials: "VA",
    gradientFrom: "#fa709a",
    gradientTo: "#fee140",
    lastMessage: "3 new followers from your last story. Engaging now 🤖",
    timestamp: "3h ago",
    isAiTwin: true,
    isUnread: true,
  },
  {
    id: 8,
    username: "orion.dev",
    initials: "OD",
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
    lastMessage: "let's collab on the next drop",
    timestamp: "5h ago",
    isAiTwin: false,
    isUnread: false,
  },
];

/* ───────── ActiveTwinAvatar ───────── */
function ActiveTwinAvatar({ twin }: { twin: ActiveTwin }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div
        className="w-[54px] h-[54px] rounded-full p-[2.5px] nexus-twin-ring"
        style={{
          background: `linear-gradient(135deg, ${twin.gradientFrom}, ${twin.gradientTo})`,
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, ${twin.gradientFrom}cc, ${twin.gradientTo}cc)`,
            fontFamily: "Outfit, sans-serif",
          }}
        >
          {twin.initials}
        </div>
      </div>
      {/* Active indicator dot */}
      <div className="relative flex items-center justify-center">
        <span
          className="text-[10px] text-gray-300 truncate max-w-[54px] text-center"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {twin.username}
        </span>
      </div>
    </div>
  );
}

/* ───────── ConversationRow ───────── */
function ConversationRow({
  conv,
  index,
}: {
  conv: Conversation;
  index: number;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      data-ocid={`nexus.item.${index + 1}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="w-full flex items-center gap-3 mx-3 my-1.5 px-3 py-3 rounded-xl text-left transition-all duration-150 bg-transparent border-0"
      style={{
        background: pressed ? "rgba(138,43,226,0.12)" : "rgba(15,10,25,0.7)",
        border: "1px solid rgba(138,43,226,0.15)",
        width: "calc(100% - 24px)",
      }}
    >
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
        style={{
          background: `linear-gradient(135deg, ${conv.gradientFrom}, ${conv.gradientTo})`,
          fontFamily: "Outfit, sans-serif",
          boxShadow: `0 0 10px ${conv.gradientFrom}55`,
        }}
      >
        {conv.initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top line: username + AI Twin badge */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={`text-[13px] truncate ${
              conv.isUnread
                ? "font-bold text-white"
                : "font-semibold text-gray-200"
            }`}
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {conv.username}
          </span>
          {conv.isAiTwin && (
            <div
              className="flex items-center gap-0.5 px-1.5 py-[2px] rounded-full flex-shrink-0"
              style={{
                background: "rgba(138,43,226,0.12)",
                border: "1px solid rgba(138,43,226,0.5)",
                boxShadow: "0 0 8px rgba(138,43,226,0.25)",
              }}
            >
              <Bot className="w-2.5 h-2.5" style={{ color: "#8A2BE2" }} />
              <span
                className="text-[9px] font-semibold"
                style={{
                  color: "#8A2BE2",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                AI Twin
              </span>
            </div>
          )}
        </div>
        {/* Bottom line: message preview */}
        <p
          className={`text-[12px] truncate leading-snug ${
            conv.isUnread ? "font-semibold text-gray-100" : "text-gray-500"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {conv.lastMessage}
        </p>
      </div>

      {/* Right: timestamp + unread dot */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span
          className="text-[10px] text-gray-600 whitespace-nowrap"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {conv.timestamp}
        </span>
        {conv.isUnread && (
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#8A2BE2",
              boxShadow: "0 0 6px #8A2BE2",
              flexShrink: 0,
            }}
          />
        )}
      </div>
    </button>
  );
}

/* ───────── NexusTab ───────── */
export function NexusTab() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Nexus header */}
      <div className="px-4 pt-4 pb-2">
        <h1
          className="text-lg font-bold tracking-[0.2em] uppercase"
          style={{
            fontFamily: "Syncopate, sans-serif",
            color: "#8A2BE2",
            textShadow:
              "0 0 12px rgba(138,43,226,0.6), 0 0 24px rgba(138,43,226,0.25)",
          }}
        >
          Nexus
        </h1>
      </div>

      {/* Active Twins section */}
      <div className="pb-3 border-b border-gray-800/50">
        {/* Section label */}
        <div className="flex items-center gap-2 px-4 mb-3">
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-500"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Active Twins
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(138,43,226,0.5), transparent)",
            }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#8A2BE2",
              boxShadow: "0 0 6px #8A2BE2",
            }}
          />
        </div>

        {/* Scrollable avatar row */}
        <div
          className="flex flex-row gap-4 px-4 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {activeTwins.map((twin) => (
            <ActiveTwinAvatar key={twin.id} twin={twin} />
          ))}
        </div>
      </div>

      {/* Conversations section */}
      <div className="flex-1">
        {/* Section label */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-500"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Messages
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, rgba(138,43,226,0.3), transparent)",
            }}
          />
        </div>

        {/* Conversation list */}
        <div data-ocid="nexus.list" className="flex flex-col pb-4">
          {conversations.map((conv, i) => (
            <ConversationRow key={conv.id} conv={conv} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
