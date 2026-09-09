"use client";

import { useState } from "react";
import {
  Sparkles,
  Heart,
  Shield,
  Zap,
  Scissors,
  Feather,
  Loader2,
  Undo2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RefinementOption, RefineMessageResponse } from "@/lib/schemas";

interface ResultRefinementProps {
  currentMessage: string;
  onMessageRefined: (newMessage: string, rationale?: string) => void;
  onRestoreOriginal?: () => void;
  hasOriginalToRestore?: boolean;
}

const refinementChips: Array<{
  key: RefinementOption;
  label: string;
  icon: React.ElementType;
}> = [
  { key: "make_warmer", label: "Make Warmer", icon: Heart },
  { key: "make_firmer", label: "Make Firmer", icon: Shield },
  { key: "make_confident", label: "More Confident", icon: Zap },
  { key: "make_shorter", label: "Shorten (50%)", icon: Scissors },
  { key: "remove_fluff", label: "Remove Fluff", icon: Feather },
];

export function ResultRefinement({
  currentMessage,
  onMessageRefined,
  onRestoreOriginal,
  hasOriginalToRestore = false,
}: ResultRefinementProps) {
  const [activeRefinement, setActiveRefinement] = useState<RefinementOption | null>(null);
  const [lastRationale, setLastRationale] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefine = async (key: RefinementOption) => {
    setIsLoading(true);
    setActiveRefinement(key);

    try {
      const res = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentMessage,
          instruction: key,
        }),
      });

      if (!res.ok) {
        throw new Error("Refinement request failed.");
      }

      const data = (await res.json()) as RefineMessageResponse;
      setLastRationale(data.refinementRationale);
      onMessageRefined(data.refinedMessage, data.refinementRationale);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
      setActiveRefinement(null);
    }
  };

  return (
    <div className="space-y-3 pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>Quick Micro-Refinements</span>
        </div>

        {hasOriginalToRestore && onRestoreOriginal && (
          <button
            type="button"
            onClick={() => {
              onRestoreOriginal();
              setLastRationale(null);
            }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Undo2 className="w-3 h-3" />
            <span>Restore Original Draft</span>
          </button>
        )}
      </div>

      {/* Refinement Chips Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {refinementChips.map((chip) => {
          const Icon = chip.icon;
          const isCurrentLoading = isLoading && activeRefinement === chip.key;

          return (
            <button
              key={chip.key}
              type="button"
              disabled={isLoading}
              onClick={() => handleRefine(chip.key)}
              className={cn(
                "btn-tactile btn-tactile-secondary px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-subtle",
                isCurrentLoading && "border-brand text-brand bg-brand-subtle font-bold"
              )}
            >
              {isCurrentLoading ? (
                <Loader2 className="w-3 h-3 animate-spin text-brand" />
              ) : (
                <Icon className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
              )}
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Refinement Rationale Banner */}
      {lastRationale && (
        <div className="p-3.5 rounded-2xl border border-brand-border/40 bg-brand-subtle/30 dark:bg-brand-subtle/15 text-xs text-foreground flex items-center gap-2.5 animate-in fade-in duration-200 card-glass-glow">
          <Check className="w-3.5 h-3.5 text-brand shrink-0" />
          <span className="leading-snug">
            <strong className="text-brand font-mono uppercase text-[10px] tracking-wider mr-1.5">Refined:</strong>
            {lastRationale}
          </span>
        </div>
      )}
    </div>
  );
}
