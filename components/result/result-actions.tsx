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
          "btn-tactile px-6 py-3 text-sm font-bold shadow-subtle",
          copied
            ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black font-bold"
            : "btn-tactile-brand animate-shine"
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
        className="btn-tactile btn-tactile-secondary px-4 py-3 text-xs sm:text-sm font-semibold text-foreground disabled:opacity-50"
      >
        <RotateCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} aria-hidden="true" />
        <span>Generate Another</span>
      </button>

      {/* Secondary Action: Edit Details */}
      <button
        type="button"
        onClick={onEdit}
        disabled={isLoading}
        className="btn-tactile btn-tactile-secondary px-4 py-3 text-xs sm:text-sm font-semibold text-foreground disabled:opacity-50"
      >
        <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Edit Details</span>
      </button>

      {/* Secondary Action: Start New */}
      <button
        type="button"
        onClick={onStartNew}
        disabled={isLoading}
        className="btn-tactile btn-tactile-secondary px-4 py-3 text-xs sm:text-sm font-semibold text-foreground disabled:opacity-50 sm:ml-auto"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Start New</span>
      </button>
    </div>
  );
}
