import { getCurrentUser } from "@/lib/auth/session";
import { SettingsFormClient } from "./settings-form-client";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-border/80">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded-md bg-secondary border border-border">
            Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your account profile, default tone calibration, and preferred communication channels.
        </p>
      </div>

      {/* Settings Form Client Component */}
      <SettingsFormClient initialUser={user} />
    </div>
  );
}
