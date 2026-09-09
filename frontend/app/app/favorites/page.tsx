import { getCurrentUser } from "@/lib/auth/session";
import { getMessagesByUserId } from "@/lib/db";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HistoryListClient } from "../history/history-list-client";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  const favoriteMessages = user
    ? await getMessagesByUserId(user.id, { onlyFavorites: true })
    : [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-brand uppercase px-2 py-0.5 rounded-md bg-brand-subtle border border-brand-border">
              Saved Words
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Personal Playbook
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Save the words that worked. Reference and reuse calibrated phrasing anytime.
          </p>
        </div>

        <Link
          href="/app"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-2.5 text-xs font-bold tracking-tight shadow-card dark:shadow-card-dark transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>New Calibration</span>
        </Link>
      </div>

      {/* Interactive Favorites List */}
      <HistoryListClient initialMessages={favoriteMessages} onlyFavoritesMode={true} />
    </div>
  );
}
