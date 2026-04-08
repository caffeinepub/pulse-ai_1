import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { db } from "../firebase";
import { PulseWaveLogo } from "./PulseWaveLogo";

interface OnboardingScreenProps {
  user: { uid: string; email: string; fullName: string };
  onComplete: () => void;
}

/** Default avatar URL used when user skips photo upload */
const DEFAULT_AVATAR_URL =
  "https://ui-avatars.com/api/?name=Pulse+User&background=1a1a2e&color=8A2BE2&size=200&bold=true&format=png";

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

export function OnboardingScreen({ user, onComplete }: OnboardingScreenProps) {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large. Please choose a photo under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function getValidationError(value: string): string {
    const trimmed = value.trim().toLowerCase().replace(/\s+/g, "");
    if (!trimmed) return "Username is required";
    if (trimmed.length < 3) return "Must be at least 3 characters";
    if (!/^[a-z0-9_]+$/.test(trimmed))
      return "Letters, numbers, and underscores only";
    return "";
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = username.trim().toLowerCase().replace(/\s+/g, "");
    const validationErr = getValidationError(username);
    if (validationErr) {
      setUsernameError(validationErr);
      return;
    }
    setUsernameError("");
    setIsLoading(true);

    try {
      // Check username uniqueness in Firestore
      const q = query(
        collection(db, "users"),
        where("username", "==", trimmed),
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        setUsernameError(`@${trimmed} is already taken. Try another.`);
        return;
      }

      // Save profile — use default avatar if user didn't upload a photo
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: user.fullName,
        email: user.email,
        username: trimmed,
        photoBase64: photoBase64 ?? DEFAULT_AVATAR_URL,
        createdAt: new Date().toISOString(),
        needsOnboarding: false,
      });

      toast.success(`Welcome to Pulse AI, @${trimmed}! 🎉`);
      onComplete();
    } catch {
      toast.error("Failed to save profile. Please try again.");
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
            "radial-gradient(ellipse 70% 40% at 50% 30%, rgba(138,43,226,0.1) 0%, transparent 65%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6 animate-fade-in-up"
        style={{
          backgroundColor: "#0f0f1a",
          boxShadow:
            "0 0 40px rgba(138,43,226,0.15), inset 0 0 0 1px rgba(138,43,226,0.1)",
        }}
      >
        {/* Header — horizontal logo */}
        <div className="flex flex-col items-center gap-3">
          <PulseWaveLogo size="md" />
          <h2
            className="font-bold mt-1 text-center"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "1.15rem",
              color: "#ffffff",
            }}
          >
            Complete Your Profile
          </h2>
          <p
            className="text-center text-xs"
            style={{ fontFamily: "Inter, sans-serif", color: "#7070a0" }}
          >
            Welcome, {user.fullName || user.email}! Set up your Pulse identity.
          </p>
        </div>

        {/* DP Upload — optional */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handlePhotoClick}
            data-ocid="onboarding.photo.upload"
            className="relative transition-all duration-200"
            style={{ outline: "none", background: "none", border: "none" }}
            aria-label="Upload profile picture (optional)"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
              style={{
                border: "2px solid rgba(138,43,226,0.5)",
                boxShadow: "0 0 16px rgba(138,43,226,0.3)",
                backgroundColor: "#12122a",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 24px rgba(138,43,226,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 16px rgba(138,43,226,0.3)";
              }}
            >
              {photoBase64 ? (
                <img
                  src={photoBase64}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8A2BE2"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span
                    className="text-[10px]"
                    style={{
                      color: "#8A2BE2",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    Add Photo
                  </span>
                </div>
              )}
            </div>
            {/* Camera overlay icon when photo exists */}
            {photoBase64 && (
              <div
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)",
                  boxShadow: "0 0 10px rgba(138,43,226,0.6)",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
            aria-label="Choose profile photo"
          />

          <p
            className="text-[11px]"
            style={{ fontFamily: "Inter, sans-serif", color: "#5050a0" }}
          >
            Tap to add a photo{" "}
            <span style={{ color: "#3a3a6a" }}>(optional)</span>
          </p>
        </div>

        {/* Username form — REQUIRED */}
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium flex items-center gap-1"
              style={{ fontFamily: "Outfit, sans-serif", color: "#a0a0c0" }}
            >
              Username
              <span
                style={{ color: "#8A2BE2", fontSize: "0.7rem" }}
                title="Required"
              >
                *
              </span>
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm select-none"
                style={{ color: "#8A2BE2", fontFamily: "Inter, sans-serif" }}
              >
                @
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/\s/g, "");
                  setUsername(val);
                  // Clear error as user types
                  if (usernameError) setUsernameError("");
                }}
                onBlur={() => {
                  const err = getValidationError(username);
                  if (err) setUsernameError(err);
                }}
                placeholder="your_pulse_handle"
                autoComplete="username"
                data-ocid="onboarding.username.input"
                className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: "#0f0f1a",
                  border: `1px solid ${usernameError ? "#e05555" : "#2a2a4a"}`,
                  color: "#f0f0ff",
                  fontFamily: "Inter, sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = usernameError
                    ? "#e05555"
                    : "#8A2BE2";
                  e.target.style.boxShadow = usernameError
                    ? "0 0 0 1px rgba(224,85,85,0.3)"
                    : "0 0 0 1px rgba(138,43,226,0.3), 0 0 12px rgba(138,43,226,0.15)";
                }}
                onBlurCapture={(e) => {
                  e.target.style.borderColor = usernameError
                    ? "#e05555"
                    : "#2a2a4a";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            {/* Inline validation feedback */}
            {usernameError ? (
              <p
                className="text-[11px]"
                style={{ fontFamily: "Inter, sans-serif", color: "#e05555" }}
                data-ocid="onboarding.username.error"
                role="alert"
              >
                {usernameError}
              </p>
            ) : (
              <p
                className="text-[11px]"
                style={{ fontFamily: "Inter, sans-serif", color: "#5050a0" }}
              >
                Letters, numbers, and underscores only. Min 3 chars.
              </p>
            )}
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={isLoading}
            data-ocid="onboarding.save.button"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200"
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
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "";
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Activating your Twin...
              </span>
            ) : (
              "Activate My Twin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
