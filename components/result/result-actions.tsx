"use client";

import { useState } from "react";
import { Check, Copy, Edit2, RotateCw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultActionsProps {
  messageText: string;
  onRegenerate: () => void;
  onEdit: () => void;
  onStartNew: () => void;
  isLoading?: boolean;
}

export function ResultActions({ messageText, onRegenerate, onEdit, onStartNew, isLoading }: ResultActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-2">
      {/* Primary Copy Action */}
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-subtle transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
          copied
            ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black font-bold"
            : "bg-foreground text-background hover:bg-foreground/90"
        )}
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
            <span>Copied to clipboard</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" aria-hidden="true" />
            <span>Copy Message</span>
          </>
        )}
      </button>

      {/* Secondary Action: Generate Another */}
      <button
        type="button"
        onClick={onRegenerate}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all duration-150 hover:bg-secondary hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 shadow-subtle cursor-pointer"
      >
        <RotateCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} aria-hidden="true" />
        <span>Generate Another</span>
      </button>

      {/* Secondary Action: Edit Details */}
      <button
        type="button"
        onClick={onEdit}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all duration-150 hover:bg-secondary hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 shadow-subtle cursor-pointer"
      >
        <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Edit Details</span>
      </button>

      {/* Secondary Action: Start New */}
      <button
        type="button"
        onClick={onStartNew}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all duration-150 hover:bg-secondary hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 shadow-subtle cursor-pointer sm:ml-auto"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Start New</span>
      </button>
    </div>
  );
}
