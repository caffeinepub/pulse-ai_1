import { Bell, Compass, Home, Network, User, Zap } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ExploreTab } from "./ExploreTab";
import { IgniteTab } from "./IgniteTab";
import { NexusTab } from "./NexusTab";
import { TwinTab } from "./TwinTab";
import { VibeTab } from "./VibeTab";

type TabId = "Vibe" | "Explore" | "Ignite" | "Nexus" | "Twin";

interface NavButtonProps {
  id: TabId;
  icon: React.ComponentType<{ className?: string }>;
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

const NavButton = ({
  id,
  icon: Icon,
  activeTab,
  setActiveTab,
}: NavButtonProps) => {
  const isActive = activeTab === id;
  return (
    <button
      type="button"
      data-ocid={`nav.${id.toLowerCase()}.tab`}
      onClick={() => setActiveTab(id)}
      className="flex flex-col items-center justify-center cursor-pointer p-2 transition-all w-16 bg-transparent border-0"
    >
      <Icon
        className={`w-6 h-6 mb-1 transition-all duration-300 ${
          isActive
            ? "text-[#8A2BE2] drop-shadow-[0_0_10px_rgba(138,43,226,0.8)]"
            : "text-gray-500 hover:text-gray-300"
        }`}
      />
      <span
        className={`text-[10px] font-medium transition-all ${
          isActive
            ? "text-[#8A2BE2] drop-shadow-[0_0_5px_#8A2BE2]"
            : "text-gray-500"
        }`}
      >
        {id}
      </span>
    </button>
  );
};

const notifications = [
  {
    id: 1,
    icon: "🪄",
    text: "Ramesh remixed your Spark",
    time: "2m ago",
  },
  {
    id: 2,
    icon: "💬",
    text: "Mala left an Echo on your Moment",
    time: "14m ago",
  },
  {
    id: 3,
    icon: "🤖",
    text: "Your AI Twin replied to 5 messages",
    time: "1h ago",
  },
];

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    // Delay listener to avoid closing on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[62px] right-3 w-[300px] z-[100] animate-in"
      style={{
        animation: "dropdownSlideIn 0.2s ease-out",
      }}
    >
      {/* Glass panel */}
      <div
        className="rounded-2xl border border-[#8A2BE2]/30 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,10,30,0.97) 0%, rgba(10,5,20,0.98) 100%)",
          boxShadow:
            "0 8px 32px rgba(138,43,226,0.25), 0 2px 8px rgba(0,0,0,0.8), inset 0 1px 0 rgba(138,43,226,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#8A2BE2]/20">
          <span
            className="text-xs font-semibold tracking-widest text-[#8A2BE2]"
            style={{ fontFamily: "Syncopate, sans-serif" }}
          >
            NOTIFICATIONS
          </span>
          <span className="text-[10px] text-[#8A2BE2]/60 bg-[#8A2BE2]/10 px-2 py-0.5 rounded-full">
            {notifications.length} new
          </span>
        </div>

        {/* Notification list */}
        <ul className="divide-y divide-[#8A2BE2]/10">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-200 group"
              style={
                {
                  // neon violet hover via inline style to ensure it works without JIT purging
                }
              }
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLIElement).style.background =
                  "rgba(138,43,226,0.12)";
                (e.currentTarget as HTMLLIElement).style.boxShadow =
                  "inset 3px 0 0 #8A2BE2";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLIElement).style.background = "";
                (e.currentTarget as HTMLLIElement).style.boxShadow = "";
              }}
            >
              {/* Icon bubble */}
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base mt-0.5"
                style={{
                  background: "rgba(138,43,226,0.15)",
                  border: "1px solid rgba(138,43,226,0.3)",
                }}
              >
                {n.icon}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm text-gray-100 leading-snug"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {n.text}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">{n.time}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#8A2BE2]/10 flex justify-center">
          <button
            type="button"
            className="text-[11px] text-[#8A2BE2] hover:text-violet-300 transition-colors tracking-wide"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}

export function MainLayout() {
  const [activeTab, setActiveTab] = useState<TabId>("Vibe");
  const [notifOpen, setNotifOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Vibe":
        return <VibeTab />;
      case "Explore":
        return <ExploreTab />;
      case "Ignite":
        return <IgniteTab />;
      case "Nexus":
        return <NexusTab />;
      case "Twin":
        return <TwinTab />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h1
              className="text-2xl text-gray-600"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {activeTab} Screen
            </h1>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto w-full max-w-[390px] h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden">
      {/* --- TOP HEADER --- */}
      <header className="absolute top-0 w-full h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-50">
        {/* Left: Logo & Text */}
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A2BE2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(138,43,226,0.5)]"
            aria-label="Pulse Wave logo"
          >
            <title>Pulse Wave</title>
            <path d="M3 12h4l3-9 5 18 3-9h5" />
          </svg>
          <span
            className="font-bold tracking-widest text-lg"
            style={{ fontFamily: "Syncopate, sans-serif" }}
          >
            PULSE AI
          </span>
        </div>

        {/* Right: Bell with Spark */}
        <button
          type="button"
          data-ocid="header.bell.button"
          onClick={() => setNotifOpen((prev) => !prev)}
          className={`relative cursor-pointer transition-all duration-200 bg-transparent border-0 p-1.5 rounded-full ${
            notifOpen
              ? "text-[#8A2BE2] drop-shadow-[0_0_10px_rgba(138,43,226,0.7)]"
              : "hover:opacity-80"
          }`}
        >
          <Bell
            className={`w-6 h-6 transition-colors duration-200 ${
              notifOpen ? "text-[#8A2BE2]" : "text-gray-300"
            }`}
          />
          <span className="absolute -top-0.5 -right-0.5 text-[10px]">✨</span>
        </button>

        {/* Notification Dropdown */}
        {notifOpen && (
          <NotificationDropdown onClose={() => setNotifOpen(false)} />
        )}
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main
        className="flex-1 pt-16 pb-20 bg-[#050505] relative"
        style={{
          overflow: activeTab === "Ignite" ? "hidden" : "auto",
        }}
      >
        {renderTabContent()}
      </main>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <nav className="absolute bottom-0 w-full h-20 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-gray-800 flex items-center justify-around px-2 z-50 rounded-t-xl">
        <NavButton
          id="Vibe"
          icon={Home}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <NavButton
          id="Explore"
          icon={Compass}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* IGNITE Button */}
        <button
          type="button"
          data-ocid="nav.ignite.tab"
          onClick={() => setActiveTab("Ignite")}
          className="relative -top-6 flex flex-col items-center justify-center cursor-pointer group bg-transparent border-0 p-0"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
              activeTab === "Ignite"
                ? "bg-black border-[#8A2BE2] shadow-[0_0_20px_rgba(138,43,226,0.8)]"
                : "bg-gray-900 border-gray-700 hover:border-[#8A2BE2]"
            }`}
          >
            <Zap
              className={`w-6 h-6 ${
                activeTab === "Ignite"
                  ? "text-[#8A2BE2] drop-shadow-[0_0_8px_#8A2BE2]"
                  : "text-gray-400"
              }`}
            />
          </div>
          <span
            className={`text-[10px] mt-1 font-medium transition-all ${
              activeTab === "Ignite"
                ? "text-[#8A2BE2] drop-shadow-[0_0_5px_#8A2BE2]"
                : "text-gray-500"
            }`}
          >
            Ignite
          </span>
        </button>

        <NavButton
          id="Nexus"
          icon={Network}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <NavButton
          id="Twin"
          icon={User}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </nav>
    </div>
  );
}
