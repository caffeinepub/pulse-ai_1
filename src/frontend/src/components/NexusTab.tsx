import { MessageSquare, Users } from "lucide-react";

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

      {/* Active Twins section — empty state */}
      <div className="pb-3 border-b border-gray-800/50">
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

        {/* Empty: no active twins */}
        <div
          className="flex items-center justify-center gap-2 py-3 mx-4 rounded-xl"
          style={{
            background: "rgba(15,10,25,0.5)",
            border: "1px solid rgba(138,43,226,0.08)",
          }}
          data-ocid="nexus.empty.twins"
        >
          <Users
            className="w-4 h-4"
            style={{ color: "rgba(138,43,226,0.3)" }}
          />
          <span
            className="text-[11px] text-gray-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            No active twins
          </span>
        </div>
      </div>

      {/* Conversations section — empty state */}
      <div className="flex-1 flex flex-col">
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

        <div
          className="flex-1 flex items-center justify-center py-16 px-6"
          data-ocid="nexus.empty.messages"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(138,43,226,0.06)",
                border: "1px solid rgba(138,43,226,0.15)",
              }}
            >
              <MessageSquare
                className="w-7 h-7"
                style={{ color: "rgba(138,43,226,0.35)" }}
              />
            </div>

            <div className="space-y-1.5">
              <p
                className="text-[15px] font-semibold text-gray-300"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                No messages yet
              </p>
              <p
                className="text-[12px] text-gray-600 leading-relaxed max-w-[220px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Your conversations will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
