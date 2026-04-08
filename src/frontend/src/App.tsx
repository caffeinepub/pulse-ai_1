import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AuthScreen } from "./components/AuthScreen";
import { MainLayout } from "./components/MainLayout";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { SplashScreen } from "./components/SplashScreen";

type AppState = "splash" | "auth" | "onboarding" | "main";

interface PendingUser {
  uid: string;
  email: string;
  fullName: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);

  function handleNeedsOnboarding(user: PendingUser) {
    setPendingUser(user);
    setAppState("onboarding");
  }

  function handleOnboardingComplete() {
    setPendingUser(null);
    setAppState("main");
  }

  return (
    // Outer wrapper: full viewport, dark background, centers the mobile container
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: "#050508" }}
    >
      {/* Mobile container: fixed 390px width, phone aspect ratio */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "390px",
          height: "100vh",
          maxHeight: "844px",
          minHeight: "640px",
          backgroundColor: "#050508",
          boxShadow:
            "0 0 0 1px rgba(138,43,226,0.08), 0 0 80px rgba(138,43,226,0.05), 0 25px 80px rgba(0,0,0,0.8)",
        }}
      >
        {appState === "splash" && (
          <SplashScreen
            onLoggedIn={() => setAppState("main")}
            onNeedAuth={() => setAppState("auth")}
            onNeedsOnboarding={handleNeedsOnboarding}
          />
        )}
        {appState === "auth" && (
          <AuthScreen
            onAuthenticated={() => setAppState("main")}
            onNeedsOnboarding={handleNeedsOnboarding}
          />
        )}
        {appState === "onboarding" && pendingUser && (
          <OnboardingScreen
            user={pendingUser}
            onComplete={handleOnboardingComplete}
          />
        )}
        {appState === "main" && <MainLayout />}
      </div>

      {/* Global toast provider — bottom-center, dark theme */}
      <Toaster
        position="bottom-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "#0f0f1a",
            border: "1px solid rgba(138,43,226,0.35)",
            color: "#f0f0ff",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            boxShadow:
              "0 0 20px rgba(138,43,226,0.2), 0 8px 32px rgba(0,0,0,0.6)",
          },
          classNames: {
            title: "font-semibold",
            description: "opacity-70",
          },
        }}
      />
    </div>
  );
}
