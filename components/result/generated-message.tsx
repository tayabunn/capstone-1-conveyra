import { type GenerateMessageResponse } from "@/lib/schemas";
import { ResultActions } from "./result-actions";
import { Sparkles, Compass, Shuffle } from "lucide-react";

interface GeneratedMessageProps {
  data: GenerateMessageResponse;
  onRegenerate: () => void;
  onEdit: () => void;
  onStartNew: () => void;
  isLoading?: boolean;
}

export function GeneratedMessage({ data, onRegenerate, onEdit, onStartNew, isLoading }: GeneratedMessageProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Primary Result Box */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border/50">
              Output
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Your Suggested Message
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5" />
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

      {/* Rationale & Alternative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border/50">
        {/* Why this works */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Why This Works
            </h3>
          </div>
          <div className="rounded-xl border border-border/60 bg-secondary/50 p-5 sm:p-6 h-full">
            <p className="text-foreground text-xs sm:text-sm leading-relaxed font-normal">
              {data.approach}
            </p>
          </div>
        </div>

        {/* Alternative approach */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shuffle className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Alternative Approach
            </h3>
          </div>
          <div className="rounded-xl border border-border/60 bg-secondary/50 p-5 sm:p-6 h-full">
            <p className="text-foreground text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-wrap">
              {data.alternative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
