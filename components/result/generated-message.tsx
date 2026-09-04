import { type GenerateMessageResponse } from "@/lib/schemas";
import { ResultActions } from "./result-actions";
import { CommunicationContextTool } from "@/components/generator/communication-context-tool";
import { Sparkles, Compass, Shuffle } from "lucide-react";
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
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border">
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
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>Ready to send</span>
          </div>
        </div>

        <div className="relative rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-subtle">
          <p className="whitespace-pre-wrap text-foreground font-normal text-base sm:text-xl leading-relaxed tracking-[-0.01em]">
            {data.message}
          </p>
        </div>
        
        <ResultActions 
          messageText={data.message}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
          onStartNew={onStartNew}
          isLoading={isLoading}
        />
      </div>

      {/* 3. Strategic Rationale & Alternative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-border">
        {/* Why this works */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-brand" />
            <h3 className="font-mono text-[11px] font-bold tracking-wider text-brand uppercase">
              Why This Works
            </h3>
          </div>
          <div className="rounded-xl border border-brand-border/40 bg-brand-subtle/40 dark:bg-brand-subtle/20 p-5 sm:p-6 h-full shadow-subtle">
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
          <div className="rounded-xl border border-electric-border/40 bg-electric-subtle/40 dark:bg-electric-subtle/20 p-5 sm:p-6 h-full shadow-subtle">
            <p className="text-foreground text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-wrap">
              {data.alternative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
