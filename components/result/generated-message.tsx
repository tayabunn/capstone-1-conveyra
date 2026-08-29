import { type GenerateMessageResponse } from "@/lib/schemas";
import { ResultActions } from "./result-actions";

interface GeneratedMessageProps {
  data: GenerateMessageResponse;
  onRegenerate: () => void;
  onEdit: () => void;
  onStartNew: () => void;
  isLoading?: boolean;
}

export function GeneratedMessage({ data, onRegenerate, onEdit, onStartNew, isLoading }: GeneratedMessageProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tighter text-foreground">
          Your Suggested Message
        </h2>
        <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-foreground rounded-l-3xl"></div>
          <p className="whitespace-pre-wrap text-foreground font-medium text-lg sm:text-2xl leading-snug tracking-tight">
            {data.message}
          </p>
        </div>
        
        <div className="pt-2">
          <ResultActions 
            messageText={data.message}
            onRegenerate={onRegenerate}
            onEdit={onEdit}
            onStartNew={onStartNew}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-border/50">
        <div className="space-y-4">
          <div className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Why This Works
          </div>
          <div className="rounded-2xl border border-border/50 bg-secondary/30 p-6 sm:p-8 h-full">
            <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium">
              {data.approach}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Alternative Approach
          </div>
          <div className="rounded-2xl border border-border/50 bg-secondary/30 p-6 sm:p-8 h-full">
            <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">
              {data.alternative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
