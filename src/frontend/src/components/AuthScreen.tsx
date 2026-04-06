import { useState } from "react";
import { toast } from "sonner";
import { authenticateUser } from "../services/apiService";
import { PulseWaveLogo } from "./PulseWaveLogo";

interface AuthScreenProps {
  onSuccess: () => void;
}

type AuthMode = "login" | "signup";

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      const msg = "Please enter both username and password.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Both login and signup use the same mock auth endpoint
      await authenticateUser(username.trim(), password);
      // Navigation happens in App.tsx after toast is shown
      onSuccess();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-app-dark px-4 overflow-y-auto scrollbar-hide">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(138,43,226,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Auth Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6 animate-fade-in-up"
        style={{
          backgroundColor: "#0f0f1a",
          boxShadow:
            "0 0 40px rgba(138,43,226,0.15), 0 0 80px rgba(138,43,226,0.05), inset 0 0 0 1px rgba(138,43,226,0.1)",
        }}
      >
        {/* Logo header */}
        <div className="flex flex-col items-center gap-3">
          <PulseWaveLogo size="small" />
          <h2
            className="font-syncopate font-bold neon-text-shadow"
            style={{
              fontSize: "1.1rem",
              color: "#8A2BE2",
              letterSpacing: "0.25em",
            }}
          >
            PULSE AI
          </h2>
        </div>

        {/* Mode toggle */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: "#12122a" }}
          data-ocid="auth.tab"
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            data-ocid="auth.login.tab"
            className="flex-1 py-2 rounded-lg font-outfit font-semibold text-sm transition-all duration-200"
            style={{
              background:
                mode === "login"
                  ? "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)"
                  : "transparent",
              color: mode === "login" ? "#ffffff" : "#7070a0",
              border:
                mode === "login" ? "none" : "1px solid rgba(138,43,226,0.3)",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            data-ocid="auth.signup.tab"
            className="flex-1 py-2 rounded-lg font-outfit font-semibold text-sm transition-all duration-200"
            style={{
              background:
                mode === "signup"
                  ? "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)"
                  : "transparent",
              color: mode === "signup" ? "#ffffff" : "#7070a0",
              border:
                mode === "signup" ? "none" : "1px solid rgba(138,43,226,0.3)",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="font-outfit text-sm font-medium"
              style={{ color: "#a0a0c0" }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              data-ocid="auth.input"
              className="w-full px-4 py-3 rounded-xl font-inter text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: "#12122a",
                border: "1px solid #2a2a4a",
                color: "#f0f0ff",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8A2BE2";
                e.target.style.boxShadow =
                  "0 0 0 1px rgba(138,43,226,0.3), 0 0 12px rgba(138,43,226,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#2a2a4a";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="font-outfit text-sm font-medium"
              style={{ color: "#a0a0c0" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              data-ocid="auth.input"
              className="w-full px-4 py-3 rounded-xl font-inter text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: "#12122a",
                border: "1px solid #2a2a4a",
                color: "#f0f0ff",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8A2BE2";
                e.target.style.boxShadow =
                  "0 0 0 1px rgba(138,43,226,0.3), 0 0 12px rgba(138,43,226,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#2a2a4a";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              data-ocid="auth.error_state"
              className="font-inter text-xs"
              style={{ color: "#f87171" }}
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            data-ocid="auth.submit_button"
            className="w-full py-3.5 rounded-xl font-outfit font-bold text-sm text-white transition-all duration-200 mt-1"
            style={{
              background: isLoading
                ? "linear-gradient(135deg, rgba(138,43,226,0.5) 0%, rgba(111,0,255,0.5) 100%)"
                : "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)",
              boxShadow: isLoading ? "none" : "0 4px 20px rgba(138,43,226,0.4)",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.filter =
                  "brightness(1.15)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 6px 28px rgba(138,43,226,0.6)";
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.filter = "";
              (e.target as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(138,43,226,0.4)";
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                  aria-label="Loading"
                >
                  <title>Loading</title>
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                {mode === "login"
                  ? "Entering the Nexus..."
                  : "Joining the Pulse..."}
              </span>
            ) : mode === "login" ? (
              "Enter the Nexus"
            ) : (
              "Join the Pulse"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
