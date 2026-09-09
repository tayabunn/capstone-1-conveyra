"use client";

import { useState } from "react";
import { type GenerateMessageResponse } from "@/lib/schemas";
import { ResultActions } from "./result-actions";
import { ResultRefinement } from "./result-refinement";
import { CommunicationContextTool } from "@/components/generator/communication-context-tool";
import { Compass, Shuffle } from "lucide-react";
import React from "react";

interface GeneratedMessageProps {
  data: GenerateMessageResponse;
  headingRef?: React.RefObject<HTMLHeadingElement | null>;
  onRegenerate: () => void;
  onEdit: () => void;
  onStartNew: () => void;
  isLoading?: boolean;
}

export function GeneratedMessage({
  data,
  headingRef,
  onRegenerate,
  onEdit,
  onStartNew,
  isLoading,
}: GeneratedMessageProps) {
  const [currentMessageText, setCurrentMessageText] = useState(data.message);
  const [isRefined, setIsRefined] = useState(false);
  const [prevDataMessage, setPrevDataMessage] = useState(data.message);

  // Sync if new generation result arrives
  if (data.message !== prevDataMessage) {
    setPrevDataMessage(data.message);
    setCurrentMessageText(data.message);
    setIsRefined(false);
  }

  const handleMessageRefined = (newText: string) => {
    setCurrentMessageText(newText);
    setIsRefined(true);
  };

  const handleRestoreOriginal = () => {
    setCurrentMessageText(data.message);
    setIsRefined(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Context Analysis Tool Output (if available) */}
      {data.contextAnalysis && (
        <CommunicationContextTool
          state="output-available"
          output={data.contextAnalysis}
        />
      )}

      {/* 2. Primary Suggested Message Result Box */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-3 py-1 rounded-full bg-secondary border border-border">
              Output
            </span>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-sm sm:text-base font-bold tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
            >
              Your Suggested Message
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="badge-dot" />
            <span>{isRefined ? "Refined & ready" : "Ready to send"}</span>
          </div>
        </div>

        <div className="relative rounded-3xl border border-border/80 bg-background/90 dark:bg-zinc-900/70 p-6 sm:p-8 shadow-card dark:shadow-card-dark transition-all card-glass-glow">
          <p className="whitespace-pre-wrap text-foreground font-normal text-base sm:text-xl leading-relaxed tracking-[-0.01em]">
            {currentMessageText}
          </p>
        </div>

        {/* In-Place Micro-Refinements Bar */}
        <ResultRefinement
          currentMessage={currentMessageText}
          onMessageRefined={handleMessageRefined}
          onRestoreOriginal={handleRestoreOriginal}
          hasOriginalToRestore={isRefined}
        />
        
        {/* Actions Bar */}
        <ResultActions 
          messageText={currentMessageText}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
          onStartNew={onStartNew}
          isLoading={isLoading}
        />
      </div>

      {/* 3. Strategic Rationale & Alternative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-border/70">
        {/* Why this works */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-brand" />
            <h3 className="font-mono text-[11px] font-bold tracking-wider text-brand uppercase">
              Why This Works
            </h3>
          </div>
          <div className="rounded-2xl border border-brand-border/40 bg-brand-subtle/30 dark:bg-brand-subtle/15 p-5 sm:p-6 h-full shadow-subtle card-glass-glow">
            <p className="text-foreground text-xs sm:text-sm leading-relaxed font-normal">
              {data.approach}
            </p>
          </div>
        </div>

        {/* Alternative approach */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Shuffle className="w-3.5 h-3.5 text-electric" />
            <h3 className="font-mono text-[11px] font-bold tracking-wider text-electric uppercase">
              Alternative Approach
            </h3>
          </div>
          <div className="rounded-2xl border border-electric-border/40 bg-electric-subtle/30 dark:bg-electric-subtle/15 p-5 sm:p-6 h-full shadow-subtle card-glass-glow">
            <p className="text-foreground text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-wrap">
              {data.alternative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
