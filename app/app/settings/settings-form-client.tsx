"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Check, Loader2, Save, User, Sliders, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import type { AppUser } from "@/lib/auth/session";

interface SettingsFormClientProps {
  initialUser?: AppUser | null;
}

export function SettingsFormClient({ initialUser }: SettingsFormClientProps) {
  const router = useRouter();

  const [name, setName] = useState(initialUser?.name || "");
  const [defaultTone, setDefaultTone] = useState(initialUser?.defaultTone || "professional");
  const [defaultLength, setDefaultLength] = useState(initialUser?.defaultLength || "medium");
  const [defaultChannel, setDefaultChannel] = useState(initialUser?.defaultChannel || "email");
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/auth/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          defaultTone,
          defaultLength,
          defaultChannel,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Account Profile Card */}
        <div className="rounded-2xl border border-border bg-card/95 p-6 sm:p-8 space-y-5 shadow-subtle">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm border-b border-border/80 pb-3">
            <User className="w-4 h-4 text-brand" />
            <span>Profile Information</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-bold tracking-tight text-foreground">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold tracking-tight text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={initialUser?.email || ""}
                disabled
                className="w-full rounded-xl border border-border bg-secondary/60 px-4 py-2.5 text-xs sm:text-sm text-muted-foreground cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground">
                Email address is managed by your authentication provider.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Communication Defaults Card */}
        <div className="rounded-2xl border border-border bg-card/95 p-6 sm:p-8 space-y-5 shadow-subtle">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm border-b border-border/80 pb-3">
            <Sliders className="w-4 h-4 text-electric" />
            <span>Communication Defaults</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Default Tone */}
            <div className="space-y-1.5">
              <label htmlFor="tone" className="block text-xs font-bold tracking-tight text-foreground">
                Default Tone
              </label>
              <select
                id="tone"
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring capitalize"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="direct">Direct</option>
                <option value="empathetic">Empathetic</option>
              </select>
            </div>

            {/* Default Length */}
            <div className="space-y-1.5">
              <label htmlFor="length" className="block text-xs font-bold tracking-tight text-foreground">
                Default Length
              </label>
              <select
                id="length"
                value={defaultLength}
                onChange={(e) => setDefaultLength(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring capitalize"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            {/* Default Channel */}
            <div className="space-y-1.5">
              <label htmlFor="channel" className="block text-xs font-bold tracking-tight text-foreground">
                Default Channel
              </label>
              <select
                id="channel"
                value={defaultChannel}
                onChange={(e) => setDefaultChannel(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground shadow-subtle focus:outline-none focus:ring-2 focus:ring-ring capitalize"
              >
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="teams">MS Teams</option>
                <option value="sms">SMS / WhatsApp</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Appearance */}
        <div className="rounded-2xl border border-border bg-card/95 p-6 sm:p-8 space-y-4 shadow-subtle flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground">Theme Preference</h3>
            <p className="text-[11px] text-muted-foreground">
              Toggle between high-contrast dark and light modes.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Save CTA */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-xs sm:text-sm font-bold shadow-card transition-all hover:bg-foreground/90 active:scale-[0.98] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
                <span>Saving...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                <span>Preferences Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 4. Danger Zone / Logout */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.02] p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-destructive">Account Session</h3>
          <p className="text-[11px] text-muted-foreground">
            Sign out of your active Conveyra workspace on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 bg-destructive/10 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Conveyra</span>
        </button>
      </div>
    </div>
  );
}
