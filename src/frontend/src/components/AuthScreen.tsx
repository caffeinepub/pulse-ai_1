import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";
import { auth, db } from "../firebase";
import { PulseWaveLogo } from "./PulseWaveLogo";

interface PendingUser {
  uid: string;
  email: string;
  fullName: string;
}

interface AuthScreenProps {
  onAuthenticated: () => void;
  onNeedsOnboarding: (user: PendingUser) => void;
}

type AuthMode = "login" | "signup";

const Spinner = () => (
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
);

const inputStyle = {
  backgroundColor: "#0f0f1a",
  border: "1px solid #2a2a4a",
  color: "#f0f0ff",
};

function NeonInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  "data-ocid": dataOcid,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete?: string;
  "data-ocid"?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      data-ocid={dataOcid}
      className="w-full px-4 py-3 rounded-xl font-inter text-sm outline-none transition-all duration-200"
      style={inputStyle}
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
  );
}

export function AuthScreen({
  onAuthenticated,
  onNeedsOnboarding,
}: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function switchMode(newMode: AuthMode) {
    setMode(newMode);
    setFullName("");
    setEmail("");
    setPassword("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const snap = await getDoc(doc(db, "users", cred.user.uid));

      if (!snap.exists() || snap.data()?.needsOnboarding) {
        // Account exists but hasn't completed onboarding — send to profile setup
        onNeedsOnboarding({
          uid: cred.user.uid,
          email: cred.user.email ?? email.trim(),
          fullName: snap.data()?.fullName ?? "",
        });
      } else {
        toast.success("Welcome back to the Nexus! 🚀");
        onAuthenticated();
      }
    } catch (err: unknown) {
      toast.error(getFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      // Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const createdUid = cred.user.uid;
      const createdEmail = cred.user.email ?? email.trim();
      const createdName = fullName.trim();

      // Save initial Firestore stub (non-blocking — onboarding will overwrite)
      setDoc(doc(db, "users", createdUid), {
        uid: createdUid,
        fullName: createdName,
        email: createdEmail,
        needsOnboarding: true,
        createdAt: new Date().toISOString(),
      }).catch(() => {
        // Ignored — onboarding saves the full doc
      });

      // Immediately clear loading and navigate to onboarding
      toast.success("Account created! Complete your profile 🎉");
      onNeedsOnboarding({
        uid: createdUid,
        email: createdEmail,
        fullName: createdName,
      });
    } catch (err: unknown) {
      toast.error(getFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 overflow-y-auto"
      style={{ backgroundColor: "#000000" }}
    >
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
        {/* Logo header — horizontal layout (icon + PULSE AI text) */}
        <div className="flex items-center justify-center">
          <PulseWaveLogo size="md" />
        </div>

        {/* Mode toggle */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: "#12122a" }}
          data-ocid="auth.tab"
        >
          {(["login", "signup"] as AuthMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              data-ocid={`auth.${m}.tab`}
              className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{
                fontFamily: "Outfit, sans-serif",
                background:
                  mode === m
                    ? "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)"
                    : "transparent",
                color: mode === m ? "#ffffff" : "#7070a0",
                border: mode === m ? "none" : "1px solid rgba(138,43,226,0.3)",
              }}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={mode === "login" ? handleLogin : handleSignUp}
          className="flex flex-col gap-4"
        >
          {/* Full Name (sign up only) */}
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="fullName"
                className="text-sm font-medium"
                style={{ fontFamily: "Outfit, sans-serif", color: "#a0a0c0" }}
              >
                Full Name
              </label>
              <NeonInput
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                data-ocid="auth.fullname.input"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ fontFamily: "Outfit, sans-serif", color: "#a0a0c0" }}
            >
              Email
            </label>
            <NeonInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              data-ocid="auth.email.input"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ fontFamily: "Outfit, sans-serif", color: "#a0a0c0" }}
            >
              Password
            </label>
            <NeonInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "login" ? "Your password" : "Min. 6 characters"
              }
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              data-ocid="auth.password.input"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            data-ocid="auth.submit_button"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 mt-1"
            style={{
              fontFamily: "Outfit, sans-serif",
              background: isLoading
                ? "linear-gradient(135deg, rgba(138,43,226,0.5) 0%, rgba(111,0,255,0.5) 100%)"
                : "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)",
              boxShadow: isLoading ? "none" : "0 4px 20px rgba(138,43,226,0.4)",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.filter = "brightness(1.15)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(138,43,226,0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "";
              e.currentTarget.style.boxShadow = isLoading
                ? "none"
                : "0 4px 20px rgba(138,43,226,0.4)";
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
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

function getFirebaseError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password. Please try again.";
      case "auth/email-already-in-use":
        return "This email is already registered. Try logging in.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
