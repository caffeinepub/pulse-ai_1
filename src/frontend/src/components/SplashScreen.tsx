import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { PulseWaveLogo } from "./PulseWaveLogo";

interface PendingUser {
  uid: string;
  email: string;
  fullName: string;
}

interface SplashScreenProps {
  onLoggedIn: () => void;
  onNeedAuth: () => void;
  onNeedsOnboarding: (user: PendingUser) => void;
}

type Destination =
  | { type: "main" }
  | { type: "auth" }
  | { type: "onboarding"; user: PendingUser };

export function SplashScreen({
  onLoggedIn,
  onNeedAuth,
  onNeedsOnboarding,
}: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);
  const [destination, setDestination] = useState<Destination | null>(null);

  // Check Firebase auth state once, with onboarding check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setDestination({ type: "auth" });
        unsubscribe();
        return;
      }

      // Logged in — check if onboarding was completed
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists() || snap.data()?.needsOnboarding) {
          setDestination({
            type: "onboarding",
            user: {
              uid: user.uid,
              email: user.email ?? "",
              fullName: snap.data()?.fullName ?? "",
            },
          });
        } else {
          setDestination({ type: "main" });
        }
      } catch {
        // On Firestore error, proceed to main app (auth succeeded)
        setDestination({ type: "main" });
      }

      unsubscribe();
    });
    return unsubscribe;
  }, []);

  // Transition after delay + destination resolved
  useEffect(() => {
    if (!destination) return;

    const fadeTimer = setTimeout(() => setFadeOut(true), 2800);
    const completeTimer = setTimeout(() => {
      setVisible(false);
      if (destination.type === "main") {
        onLoggedIn();
      } else if (destination.type === "onboarding") {
        onNeedsOnboarding(destination.user);
      } else {
        onNeedAuth();
      }
    }, 3350);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [destination, onLoggedIn, onNeedAuth, onNeedsOnboarding]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundColor: "#000000",
        transition: "opacity 0.55s ease-out",
        opacity: fadeOut ? 0 : 1,
        zIndex: 50,
      }}
    >
      {/* Subtle background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(138,43,226,0.13) 0%, transparent 70%)",
        }}
      />

      {/* Vertical logo: icon stacked above "PULSE AI" text */}
      <div className="relative flex items-center justify-center">
        <PulseWaveLogo size="lg" layout="vertical" />
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #000000, transparent)",
        }}
      />
    </div>
  );
}
