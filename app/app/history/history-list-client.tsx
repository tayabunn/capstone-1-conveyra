"use client";

import { useState } from "react";
import type { DBMessage } from "@/lib/db/types";
import {
  Bookmark,
  Copy,
  Check,
  Trash2,
  RotateCw,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HistoryListClientProps {
  initialMessages: DBMessage[];
  onlyFavoritesMode?: boolean;
}

export function HistoryListClient({
  initialMessages,
  onlyFavoritesMode = false,
}: HistoryListClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<DBMessage[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeRecipientFilter, setActiveRecipientFilter] = useState<string>("all");

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}/favorite`, { method: "POST" });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
        );
        router.refresh();
      }
    } catch {
      // Fallback
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        router.refresh();
      }
    } catch {
      // Fallback
    }
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.generatedMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.originalThought.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.recipient.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRecipient =
      activeRecipientFilter === "all" ||
      m.recipient.toLowerCase() === activeRecipientFilter.toLowerCase();

    return matchesSearch && matchesRecipient;
  });

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/60 p-12 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
          {onlyFavoritesMode ? <Bookmark className="w-6 h-6 text-brand" /> : <Sparkles className="w-6 h-6 text-electric" />}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">
            {onlyFavoritesMode ? "No saved messages yet" : "No calibration history yet"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {onlyFavoritesMode
              ? "Save the words that worked. Star messages from your workspace to build your personal communication playbook."
              : "Start by calibrating your first message in the workspace."}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-6 py-2.5 text-xs font-bold shadow-subtle hover:bg-foreground/90 transition-all cursor-pointer"
          >
            <span>Go to Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages by keyword, recipient or situation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "manager", "client", "colleague"].map((recipient) => (
            <button
              key={recipient}
              type="button"
              onClick={() => setActiveRecipientFilter(recipient)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer",
                activeRecipientFilter === recipient
                  ? "bg-foreground text-background font-bold shadow-subtle"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {recipient === "all" ? "All Recipients" : recipient}
            </button>
          ))}
        </div>
      </div>

      {/* Message Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative bg-card/95 border border-border/90 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            {/* Top Meta Chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-subtle text-brand border border-brand-border">
                  {item.recipient}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                  {item.tone}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                  {item.channel || "Email"}
                </span>
              </div>

              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Content Body */}
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground line-clamp-1">
                <strong className="text-foreground">Original thought:</strong> &quot;{item.originalThought}&quot;
              </p>
              <div className="rounded-xl border border-border/80 bg-background/60 p-4">
                <p className="text-sm text-foreground font-normal leading-relaxed whitespace-pre-wrap line-clamp-4">
                  {item.generatedMessage}
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.generatedMessage)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleFavorite(item.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer",
                    item.isFavorite
                      ? "border-brand-border bg-brand-subtle text-brand font-bold"
                      : "border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  title={item.isFavorite ? "Remove from favorites" : "Save to favorites"}
                >
                  <Bookmark
                    className={cn("w-3.5 h-3.5", item.isFavorite && "fill-brand text-brand")}
                  />
                  <span>{item.isFavorite ? "Saved" : "Save"}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/app?reuse=${encodeURIComponent(item.id)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary text-xs font-semibold text-foreground transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3 h-3 text-muted-foreground" />
                  <span>Use Again</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg border border-transparent hover:border-destructive/20 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
