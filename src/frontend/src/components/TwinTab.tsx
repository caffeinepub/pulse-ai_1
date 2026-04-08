import { auth, db } from "@/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Camera,
  Check,
  Image,
  MessageSquare,
  Settings,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/* ────────────────────────────── Types ────────────────────────────── */
interface UserProfile {
  uid: string;
  username: string;
  fullName: string;
  photoBase64: string;
  bio: string;
  synapses: number;
  pulsing: number;
  sparks: number;
  moments: number;
  twinPersona?: {
    traits: string[];
    autoReply: boolean;
  };
}

type ContentTab = "All" | "Moments" | "Sparks" | "Echoes";

const CONTENT_TABS: { id: ContentTab; label: string; icon: string }[] = [
  { id: "All", label: "All", icon: "" },
  { id: "Moments", label: "Moments", icon: "📸" },
  { id: "Sparks", label: "Sparks", icon: "✨" },
  { id: "Echoes", label: "Echoes", icon: "💬" },
];

const EMPTY_STATES: Record<
  ContentTab,
  { icon: React.ReactNode; message: string; sub: string }
> = {
  All: {
    icon: (
      <Zap className="w-6 h-6" style={{ color: "rgba(138,43,226,0.45)" }} />
    ),
    message: "No posts yet",
    sub: "Your Sparks and Moments will appear here",
  },
  Moments: {
    icon: (
      <Image className="w-6 h-6" style={{ color: "rgba(138,43,226,0.45)" }} />
    ),
    message: "No Moments yet",
    sub: "Photos and real posts you share",
  },
  Sparks: {
    icon: (
      <Sparkles
        className="w-6 h-6"
        style={{ color: "rgba(138,43,226,0.45)" }}
      />
    ),
    message: "No Sparks yet",
    sub: "AI-generated posts will show here",
  },
  Echoes: {
    icon: (
      <MessageSquare
        className="w-6 h-6"
        style={{ color: "rgba(138,43,226,0.45)" }}
      />
    ),
    message: "No Echoes yet",
    sub: "AI replies and reposts will appear here",
  },
};

/* ────────────────────────────── Avatar ────────────────────────────── */
function Avatar({
  photo,
  name,
  size = 96,
}: { photo: string; name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 35% 30%, rgba(220,180,255,0.6) 0%, rgba(138,43,226,0.8) 28%, rgba(80,0,160,0.9) 55%, rgba(20,5,40,1) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "18%",
          width: size * 0.22,
          height: size * 0.14,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, transparent 100%)",
          transform: "rotate(-20deg)",
          filter: "blur(1.5px)",
        }}
      />
      <span
        style={{
          fontFamily: "Syncopate, sans-serif",
          fontWeight: 700,
          fontSize: size * 0.2,
          color: "rgba(255,255,255,0.95)",
          letterSpacing: "0.04em",
          userSelect: "none",
        }}
      >
        {initials || "?"}
      </span>
    </div>
  );
}

/* ────────────────────────────── Settings Sheet ────────────────────── */
function SettingsSheet({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const SETTINGS_ITEMS = [
    { label: "Archive", icon: "🗂️" },
    { label: "Saved Collections", icon: "🔖" },
    { label: "Close Friends", icon: "💜" },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          role="button"
          tabIndex={0}
          className="absolute inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-label="Close settings"
        />
      )}
      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 rounded-t-2xl"
        style={{
          background: "linear-gradient(180deg, #0f0f1a 0%, #080810 100%)",
          border: "1px solid rgba(138,43,226,0.25)",
          borderBottom: "none",
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
        }}
        data-ocid="settings.sheet"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: "rgba(138,43,226,0.3)",
            }}
          />
        </div>
        <p
          className="text-center pb-4 pt-1"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            color: "rgba(160,155,185,0.7)",
            letterSpacing: "0.08em",
          }}
        >
          SETTINGS
        </p>

        <div className="px-4 space-y-1 pb-4">
          {SETTINGS_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              data-ocid={`settings.${item.label.toLowerCase().replace(/ /g, "-")}.btn`}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "rgba(220,215,240,0.9)",
                background: "rgba(138,43,226,0.04)",
                border: "1px solid rgba(138,43,226,0.1)",
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(138,43,226,0.12)",
              margin: "8px 0",
            }}
          />

          {/* Logout */}
          <button
            type="button"
            data-ocid="settings.logout.btn"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#ff4d4d",
              background: "rgba(255,77,77,0.06)",
              border: "1px solid rgba(255,77,77,0.2)",
            }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────── Edit Profile Sheet ──────────────────── */
function EditProfileSheet({
  open,
  onClose,
  profile,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaved: (updated: Partial<UserProfile>) => void;
}) {
  const [name, setName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [photo, setPhoto] = useState(profile.photoBase64);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setName(profile.fullName);
      setUsername(profile.username);
      setBio(profile.bio);
      setPhoto(profile.photoBase64);
    }
  }, [open, profile]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPhoto(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    const clean = username.trim().replace(/^@/, "").toLowerCase();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      // Uniqueness check (skip self)
      if (clean !== profile.username.toLowerCase()) {
        const snap = await getDocs(
          query(collection(db, "users"), where("username", "==", clean)),
        );
        const taken = snap.docs.some((d) => d.id !== user.uid);
        if (taken) {
          toast.error(`@${clean} is already taken`);
          setSaving(false);
          return;
        }
      }

      const updates: Partial<UserProfile> = {
        fullName: name.trim(),
        username: clean,
        bio: bio.trim(),
        photoBase64: photo,
      };
      await updateDoc(doc(db, "users", user.uid), updates);
      onSaved(updates);
      toast.success("Profile updated");
      onClose();
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {open && (
        <div
          role="button"
          tabIndex={0}
          className="absolute inset-0 z-40"
          style={{
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(3px)",
          }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-label="Close edit profile"
        />
      )}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 rounded-t-2xl"
        style={{
          background: "linear-gradient(180deg, #0f0f1a 0%, #070710 100%)",
          border: "1px solid rgba(138,43,226,0.3)",
          borderBottom: "none",
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          maxHeight: "88%",
          overflowY: "auto",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)",
        }}
        data-ocid="editprofile.sheet"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 pt-4 pb-3 border-b"
          style={{ borderColor: "rgba(138,43,226,0.15)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full"
            style={{ background: "rgba(138,43,226,0.08)" }}
            aria-label="Close"
          >
            <X className="w-4 h-4" style={{ color: "rgba(200,195,225,0.7)" }} />
          </button>
          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#f0f0ff",
              letterSpacing: "0.06em",
            }}
          >
            EDIT PROFILE
          </h2>
          <button
            type="button"
            data-ocid="editprofile.save.btn"
            onClick={handleSave}
            disabled={saving}
            className="p-1.5 rounded-full"
            style={{
              background: saving
                ? "rgba(138,43,226,0.2)"
                : "rgba(138,43,226,0.15)",
              border: "1px solid rgba(138,43,226,0.4)",
            }}
            aria-label="Save"
          >
            <Check
              className="w-4 h-4"
              style={{ color: saving ? "rgba(138,43,226,0.5)" : "#8A2BE2" }}
            />
          </button>
        </div>

        <div className="px-4 pt-5 space-y-5">
          {/* Photo */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              className="relative cursor-pointer bg-transparent border-0 p-0"
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              data-ocid="editprofile.photo.btn"
              aria-label="Change profile photo"
            >
              <div
                style={{
                  borderRadius: "50%",
                  padding: 2,
                  background: "linear-gradient(135deg, #8A2BE2, #6F00FF)",
                }}
              >
                <Avatar photo={photo} name={name} size={72} />
              </div>
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #8A2BE2, #6F00FF)",
                  border: "2px solid #050508",
                }}
              >
                <Camera className="w-3 h-3 text-white" />
              </div>
            </button>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(140,135,165,0.7)",
              }}
            >
              Tap to change photo
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              aria-label="Upload photo"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="ep-name"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(138,43,226,0.8)",
                letterSpacing: "0.08em",
              }}
            >
              FULL NAME
            </label>
            <input
              id="ep-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="editprofile.name.input"
              placeholder="Your full name"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#f0f0ff",
                background: "rgba(138,43,226,0.06)",
                border: "1px solid rgba(138,43,226,0.25)",
              }}
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="ep-username"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(138,43,226,0.8)",
                letterSpacing: "0.08em",
              }}
            >
              USERNAME
            </label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "rgba(138,43,226,0.6)",
                }}
              >
                @
              </span>
              <input
                id="ep-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/^@/, ""))}
                data-ocid="editprofile.username.input"
                placeholder="username"
                className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#f0f0ff",
                  background: "rgba(138,43,226,0.06)",
                  border: "1px solid rgba(138,43,226,0.25)",
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label
              htmlFor="ep-bio"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(138,43,226,0.8)",
                letterSpacing: "0.08em",
              }}
            >
              BIO
            </label>
            <textarea
              id="ep-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              data-ocid="editprofile.bio.input"
              placeholder="Tell the world about you..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#f0f0ff",
                background: "rgba(138,43,226,0.06)",
                border: "1px solid rgba(138,43,226,0.25)",
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* Save button */}
          <button
            type="button"
            data-ocid="editprofile.save-full.btn"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: 13,
              color: "#ffffff",
              background: saving
                ? "rgba(138,43,226,0.3)"
                : "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)",
              boxShadow: saving ? "none" : "0 0 18px rgba(138,43,226,0.5)",
              letterSpacing: "0.06em",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────── Twin Persona Card ────────────────────── */
function TwinPersonaCard({
  profile,
  onUpdate,
}: {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => Promise<void>;
}) {
  const traits = profile.twinPersona?.traits ?? ["Friendly", "Tech"];
  const autoReply = profile.twinPersona?.autoReply ?? false;
  const [newTrait, setNewTrait] = useState("");
  const [adding, setAdding] = useState(false);

  async function toggleAutoReply() {
    await onUpdate({
      twinPersona: { traits, autoReply: !autoReply },
    });
  }

  async function removeTrait(trait: string) {
    const updated = traits.filter((t) => t !== trait);
    await onUpdate({ twinPersona: { traits: updated, autoReply } });
  }

  async function addTrait() {
    const t = newTrait.trim();
    if (!t || traits.includes(t)) {
      setNewTrait("");
      setAdding(false);
      return;
    }
    const updated = [...traits, t];
    await onUpdate({ twinPersona: { traits: updated, autoReply } });
    setNewTrait("");
    setAdding(false);
  }

  return (
    <div
      className="mx-4 mt-3 px-4 py-4"
      style={{
        background: "rgba(15,10,25,0.8)",
        border: "1px solid rgba(138,43,226,0.35)",
        borderRadius: 14,
        boxShadow:
          "0 0 22px rgba(138,43,226,0.14), inset 0 0 18px rgba(138,43,226,0.04)",
      }}
      data-ocid="twin.persona.card"
    >
      {/* Title row */}
      <div className="flex items-center justify-between mb-3">
        <h3
          style={{
            fontFamily: "Syncopate, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "#8A2BE2",
            textShadow:
              "0 0 10px rgba(138,43,226,0.7), 0 0 20px rgba(138,43,226,0.3)",
            letterSpacing: "0.14em",
          }}
        >
          TWIN PERSONA
        </h3>
        {/* Auto-reply toggle */}
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              color: "rgba(160,155,185,0.7)",
            }}
          >
            Auto-reply
          </span>
          <button
            type="button"
            data-ocid="twin.autoreply.toggle"
            onClick={toggleAutoReply}
            aria-label={autoReply ? "Disable auto-reply" : "Enable auto-reply"}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: autoReply
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "rgba(80,80,100,0.5)",
              border: autoReply
                ? "1px solid rgba(34,197,94,0.5)"
                : "1px solid rgba(138,43,226,0.2)",
              position: "relative",
              transition: "all 0.25s ease",
              cursor: "pointer",
              boxShadow: autoReply ? "0 0 8px rgba(34,197,94,0.4)" : "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: autoReply ? 18 : 3,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.25s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </button>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              color: autoReply ? "#22c55e" : "rgba(130,125,155,0.6)",
              fontWeight: 600,
            }}
          >
            {autoReply ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      {/* AI Twin name */}
      <p
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: 13,
          color: "rgba(200,195,225,0.8)",
          marginBottom: 10,
        }}
      >
        <span style={{ color: "rgba(138,43,226,0.7)", marginRight: 4 }}>✦</span>
        Pulse-Aura
      </p>

      {/* Traits chips */}
      <div className="flex flex-wrap gap-1.5">
        {traits.map((trait) => (
          <div
            key={trait}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(138,43,226,0.1)",
              border: "1px solid rgba(138,43,226,0.3)",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(200,195,230,0.9)",
              }}
            >
              {trait}
            </span>
            <button
              type="button"
              data-ocid={`twin.trait.remove.${trait}`}
              onClick={() => removeTrait(trait)}
              aria-label={`Remove trait ${trait}`}
              style={{
                display: "flex",
                cursor: "pointer",
                padding: 0,
                background: "none",
                border: "none",
              }}
            >
              <X
                className="w-3 h-3"
                style={{ color: "rgba(138,43,226,0.5)" }}
              />
            </button>
          </div>
        ))}

        {/* Add trait */}
        {adding ? (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{
              background: "rgba(138,43,226,0.08)",
              border: "1px solid rgba(138,43,226,0.4)",
            }}
          >
            <input
              type="text"
              value={newTrait}
              onChange={(e) => setNewTrait(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTrait()}
              data-ocid="twin.trait.input"
              placeholder="Add trait"
              className="bg-transparent outline-none"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "#f0f0ff",
                width: 70,
              }}
            />
            <button
              type="button"
              onClick={addTrait}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Check className="w-3 h-3" style={{ color: "#8A2BE2" }} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="twin.trait.add.btn"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{
              background: "transparent",
              border: "1px dashed rgba(138,43,226,0.35)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(138,43,226,0.6)",
              }}
            >
              + Add
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────── Content Grid Empty State ────────────── */
function EmptyState({ tab }: { tab: ContentTab }) {
  const state = EMPTY_STATES[tab];
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-14 text-center"
      data-ocid={`twin.empty.${tab.toLowerCase()}`}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(138,43,226,0.06)",
          border: "1px solid rgba(138,43,226,0.15)",
        }}
      >
        {state.icon}
      </div>
      <div className="space-y-1">
        <p
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(220,215,240,0.85)",
          }}
        >
          {state.message}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            color: "rgba(130,125,155,0.6)",
            maxWidth: 200,
            lineHeight: 1.5,
          }}
        >
          {state.sub}
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────── Main TwinTab ─────────────────────────── */
export function TwinTab({
  onSettingsOpen,
}: {
  onSettingsOpen?: (handler: () => void) => void;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentTab>("All");
  const [showEdit, setShowEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Register settings opener with parent (MainLayout header)
  useEffect(() => {
    onSettingsOpen?.(() => setShowSettings(true));
  }, [onSettingsOpen]);

  // Real-time Firestore listener for user profile
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            uid: user.uid,
            username: data.username ?? "",
            fullName: data.fullName ?? "",
            photoBase64: data.photoBase64 ?? "",
            bio: data.bio ?? "",
            synapses: data.synapses ?? 0,
            pulsing: data.pulsing ?? 0,
            sparks: data.sparks ?? 0,
            moments: data.moments ?? 0,
            twinPersona: data.twinPersona ?? {
              traits: ["Friendly", "Tech"],
              autoReply: false,
            },
          });
        }
        setLoading(false);
      },
      () => {
        toast.error("Failed to load profile");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  async function handlePersonaUpdate(updates: Partial<UserProfile>) {
    const user = auth.currentUser;
    if (!user || !profile) return;
    try {
      await updateDoc(doc(db, "users", user.uid), updates);
      setProfile((p) => (p ? { ...p, ...updates } : p));
    } catch {
      toast.error("Failed to update persona");
    }
  }

  function handleEditSaved(updated: Partial<UserProfile>) {
    setProfile((p) => (p ? { ...p, ...updated } : p));
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      // App.tsx onAuthStateChanged / parent will handle redirect
      window.location.reload();
    } catch {
      toast.error("Failed to sign out");
    }
  }

  const STATS = profile
    ? [
        { value: profile.synapses, label: "Synapses" },
        { value: profile.pulsing, label: "Pulsing" },
        { value: profile.sparks, label: "Sparks" },
        { value: profile.moments, label: "Moments" },
      ]
    : [
        { value: 0, label: "Synapses" },
        { value: 0, label: "Pulsing" },
        { value: 0, label: "Sparks" },
        { value: 0, label: "Moments" },
      ];

  function formatStat(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  }

  return (
    <div
      className="flex flex-col min-h-full relative"
      style={{
        background:
          "linear-gradient(180deg, #050508 0%, #0a0514 60%, #050508 100%)",
      }}
      data-ocid="twin.page"
    >
      {/* Settings gear — top-right in tab */}
      <div className="flex items-center justify-end px-4 pt-3 pb-1">
        <button
          type="button"
          data-ocid="twin.settings.btn"
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full"
          style={{
            background: "rgba(138,43,226,0.06)",
            border: "1px solid rgba(138,43,226,0.18)",
          }}
          aria-label="Settings"
        >
          <Settings
            className="w-4 h-4"
            style={{ color: "rgba(138,43,226,0.7)" }}
          />
        </button>
      </div>

      {/* ── Profile section ── */}
      <div className="flex flex-col items-center pb-4 px-4">
        {/* Avatar with glowing ring */}
        <div
          style={{
            borderRadius: "50%",
            padding: 2.5,
            background:
              "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 50%, #8A2BE2 100%)",
            boxShadow:
              "0 0 18px rgba(138,43,226,0.5), 0 0 36px rgba(138,43,226,0.2)",
          }}
        >
          {loading ? (
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                background: "rgba(138,43,226,0.1)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ) : (
            <Avatar
              photo={profile?.photoBase64 ?? ""}
              name={profile?.fullName ?? "?"}
              size={92}
            />
          )}
        </div>

        {/* Full name + username */}
        <p
          className="mt-3"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#f0f0ff",
          }}
        >
          {loading ? "Loading..." : profile?.fullName || "—"}
        </p>
        <p
          className="mt-0.5"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            color: "rgba(138,43,226,0.85)",
          }}
        >
          {loading ? "" : `@${profile?.username || "—"}`}
        </p>

        {/* Bio */}
        {profile?.bio ? (
          <p
            className="mt-2 text-center px-6"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "rgba(180,175,205,0.75)",
              lineHeight: 1.5,
              maxWidth: 280,
            }}
          >
            {profile.bio}
          </p>
        ) : null}
      </div>

      {/* ── Stats row ── */}
      <div
        className="flex items-stretch mx-4 rounded-xl"
        style={{
          background: "rgba(15,10,25,0.7)",
          border: "1px solid rgba(138,43,226,0.15)",
        }}
        data-ocid="twin.stats.row"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col items-center py-3 relative"
          >
            {i < STATS.length - 1 && (
              <div
                className="absolute right-0 top-3 bottom-3"
                style={{ width: 1, background: "rgba(138,43,226,0.22)" }}
              />
            )}
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#8A2BE2",
                textShadow: "0 0 8px rgba(138,43,226,0.6)",
              }}
            >
              {loading ? "–" : formatStat(stat.value)}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                color: "rgba(155,150,180,0.8)",
                marginTop: 2,
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Edit Profile button ── */}
      <div className="flex justify-center mt-3 px-4">
        <button
          type="button"
          data-ocid="twin.editprofile.btn"
          onClick={() => setShowEdit(true)}
          className="px-6 py-2.5 rounded-full text-sm font-semibold"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 12,
            color: "rgba(200,195,230,0.9)",
            background: "rgba(138,43,226,0.08)",
            border: "1px solid rgba(138,43,226,0.3)",
            letterSpacing: "0.05em",
          }}
        >
          Edit Profile
        </button>
      </div>

      {/* ── Twin Persona Card ── */}
      {profile && (
        <TwinPersonaCard profile={profile} onUpdate={handlePersonaUpdate} />
      )}

      {/* ── Sticky content tab bar ── */}
      <div
        className="flex gap-1.5 mt-4 scrollbar-hide"
        style={{
          overflowX: "auto",
          padding: "0 16px 12px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background:
            "linear-gradient(180deg, rgba(5,5,8,0.98) 80%, transparent 100%)",
        }}
        data-ocid="twin.tabs.bar"
      >
        {CONTENT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-ocid={`twin.${tab.id.toLowerCase()}.tab`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontFamily: "Outfit, sans-serif",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.22s ease",
                border: isActive
                  ? "1px solid #8A2BE2"
                  : "1px solid rgba(138,43,226,0.22)",
                background: isActive
                  ? "linear-gradient(135deg, #8A2BE2 0%, #6F00FF 100%)"
                  : "transparent",
                color: isActive ? "#ffffff" : "rgba(155,150,180,0.8)",
                boxShadow: isActive
                  ? "0 0 14px rgba(138,43,226,0.5), 0 0 28px rgba(138,43,226,0.2)"
                  : "none",
              }}
            >
              {tab.label} {tab.icon}
            </button>
          );
        })}
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 px-4 pb-4">
        <EmptyState tab={activeTab} />
      </div>

      {/* ── Settings bottom sheet ── */}
      <SettingsSheet
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={handleLogout}
      />

      {/* ── Edit Profile bottom sheet ── */}
      {profile && (
        <EditProfileSheet
          open={showEdit}
          onClose={() => setShowEdit(false)}
          profile={profile}
          onSaved={handleEditSaved}
        />
      )}
    </div>
  );
}
