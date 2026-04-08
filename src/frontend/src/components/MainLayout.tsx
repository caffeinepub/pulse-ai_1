import { Bell, Compass, Zap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { ExploreTab } from "./ExploreTab";
import { IgniteTab } from "./IgniteTab";
import { NexusTab } from "./NexusTab";
import { PulseWaveLogo } from "./PulseWaveLogo";
import { TwinTab } from "./TwinTab";
import { VibeTab } from "./VibeTab";

type TabId = "Vibe" | "Explore" | "Ignite" | "Nexus" | "Twin";

/* ─── Custom SVG Icon: Vibe (concentric ripple rings emanating from center) ─── */
function VibeIcon({ active }: { active: boolean }) {
  const color = active ? "#8A2BE2" : "#6B7280";
  const filter = active ? "drop-shadow(0 0 8px rgba(138,43,226,0.9))" : "none";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter }}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="12" cy="12" r="10" strokeOpacity="0.5" />
      {/* Middle ring */}
      <circle cx="12" cy="12" r="6.5" strokeOpacity="0.75" />
      {/* Inner ring */}
      <circle cx="12" cy="12" r="3" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1" fill={color} stroke="none" />
    </svg>
  );
}

/* ─── Custom SVG Icon: Nexus (chain-link interlocking rings) ─── */
function NexusIcon({ active }: { active: boolean }) {
  const color = active ? "#8A2BE2" : "#6B7280";
  const filter = active ? "drop-shadow(0 0 8px rgba(138,43,226,0.9))" : "none";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter }}
      aria-hidden="true"
    >
      {/* Top-left ring */}
      <circle cx="8.5" cy="9" r="4.5" />
      {/* Bottom-right ring — interlocked */}
      <circle cx="15.5" cy="15" r="4.5" />
      {/* Center intersection highlight */}
      <circle cx="12" cy="12" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}

/* ─── Custom SVG Icon: Twin (two mirrored abstract silhouettes) ─── */
function TwinIcon({ active }: { active: boolean }) {
  const color = active ? "#8A2BE2" : "#6B7280";
  const filter = active ? "drop-shadow(0 0 8px rgba(138,43,226,0.9))" : "none";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter }}
      aria-hidden="true"
    >
      {/* Left silhouette — head */}
      <circle cx="8" cy="6.5" r="2.2" />
      {/* Left silhouette — body arc */}
      <path d="M3.5 20c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5" />
      {/* Mirror line — subtle vertical divider */}
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="21"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {/* Right silhouette — head (mirrored) */}
      <circle cx="16" cy="6.5" r="2.2" />
      {/* Right silhouette — body arc (mirrored) */}
      <path d="M11.5 20c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5" />
    </svg>
  );
}

/* ─── Generic NavButton for standard tabs ─── */
interface NavButtonProps {
  id: TabId;
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
  iconNode: React.ReactNode;
}

const NavButton = ({
  id,
  activeTab,
  setActiveTab,
  iconNode,
}: NavButtonProps) => {
  const isActive = activeTab === id;
  return (
    <button
      type="button"
      data-ocid={`nav.${id.toLowerCase()}.tab`}
      onClick={() => setActiveTab(id)}
      className="flex flex-col items-center justify-center cursor-pointer p-2 transition-all w-16 bg-transparent border-0"
    >
      {iconNode}
      <span
        className={`text-[10px] font-medium mt-1 transition-all ${
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

/* ─── Compass NavButton (Explore uses lucide Compass) ─── */
function CompassNavButton({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}) {
  const isActive = activeTab === "Explore";
  return (
    <NavButton
      id="Explore"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      iconNode={
        <Compass
          className={`w-6 h-6 mb-1 transition-all duration-300 ${
            isActive
              ? "text-[#8A2BE2] drop-shadow-[0_0_10px_rgba(138,43,226,0.8)]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        />
      }
    />
  );
}

/* ─── Main Layout ─── */
export function MainLayout() {
  const [activeTab, setActiveTab] = useState<TabId>("Vibe");

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
      {/* ── TOP HEADER ── */}
      <header className="absolute top-0 w-full h-16 bg-[#0a0a0a] flex items-center justify-between px-4 z-50">
        {/* Left: Horizontal PULSE AI logo */}
        <PulseWaveLogo size="sm" />

        {/* Right: Bell icon — visual only, no popup */}
        <div
          data-ocid="header.bell.icon"
          className="p-1.5"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-300" />
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main
        className="flex-1 pt-16 pb-20 bg-[#050505] relative"
        style={{ overflow: activeTab === "Ignite" ? "hidden" : "auto" }}
      >
        {renderTabContent()}
      </main>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <nav className="absolute bottom-0 w-full h-20 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-gray-800 flex items-center justify-around px-2 z-50 rounded-t-xl">
        {/* Vibe — custom pulse wave icon */}
        <NavButton
          id="Vibe"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          iconNode={<VibeIcon active={activeTab === "Vibe"} />}
        />

        {/* Explore — Lucide Compass */}
        <CompassNavButton activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* IGNITE — prominent protruding button */}
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

        {/* Nexus — custom interlocking rings icon */}
        <NavButton
          id="Nexus"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          iconNode={<NexusIcon active={activeTab === "Nexus"} />}
        />

        {/* Twin — custom dual silhouettes icon */}
        <NavButton
          id="Twin"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          iconNode={<TwinIcon active={activeTab === "Twin"} />}
        />
      </nav>
    </div>
  );
}
