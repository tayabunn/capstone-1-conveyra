"use client";

import { useState } from "react";
import { Check, Copy, Edit2, RefreshCw, PlusCircle } from "lucide-react";

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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleCopy}
        className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold transition-all hover:opacity-90 shadow-[var(--shadow-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            Copied to clipboard
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
            Copy Message
          </>
        )}
      </button>

      <button
        onClick={onRegenerate}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-full border border-border/50 bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 shadow-sm"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
        Generate Another
      </button>

      <button
        onClick={onEdit}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-full border border-border/50 bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 shadow-sm"
      >
        <Edit2 className="mr-2 h-4 w-4" aria-hidden="true" />
        Edit Details
      </button>

      <button
        onClick={onStartNew}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-full border border-border/50 bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 shadow-sm"
      >
        <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
        Start New
      </button>
    </div>
  );
}
