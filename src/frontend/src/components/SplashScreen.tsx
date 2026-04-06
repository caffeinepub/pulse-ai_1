import { useEffect, useState } from "react";
import { PulseWaveLogo } from "./PulseWaveLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    const completeTimer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3550);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-app-dark"
      style={{
        transition: "opacity 0.5s ease-out",
        opacity: fadeOut ? 0 : 1,
        zIndex: 50,
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(138,43,226,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Logo and text container */}
      <div className="relative flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Pulse Wave Logo */}
        <PulseWaveLogo size="large" />

        {/* PULSE AI text */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="font-syncopate font-bold tracking-widest neon-text-shadow"
            style={{
              fontSize: "2rem",
              color: "#8A2BE2",
              letterSpacing: "0.3em",
            }}
          >
            PULSE AI
          </h1>

          <p
            className="font-inter text-sm"
            style={{
              color: "#7070a0",
              letterSpacing: "0.15em",
            }}
          >
            Formed with AI
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #050508, transparent)",
        }}
      />
    </div>
  );
}
