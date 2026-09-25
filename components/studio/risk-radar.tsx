"use client";

import { ShieldCheck, Zap, HeartHandshake, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskRadarProps {
  riskAvoided?: string | null;
  safetyScore?: number;
  directnessLevel?: "High" | "Balanced" | "Diplomatic";
  className?: string;
}

export function RiskRadar({
  riskAvoided,
  safetyScore = 94,
  directnessLevel = "Balanced",
  className,
}: RiskRadarProps) {
  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/60 backdrop-blur-md p-4 space-y-3.5", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Communication Risk Radar
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span>{safetyScore}%</span>
          <span className="text-[10px] text-muted-foreground font-normal">Safe</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-background/50 border border-border/50 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
            <Zap className="w-3.5 h-3.5 text-brand" />
            <span>Directness Index</span>
          </div>
          <p className="font-semibold text-foreground">{directnessLevel}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-background/50 border border-border/50 space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
            <HeartHandshake className="w-3.5 h-3.5 text-electric" />
            <span>Tone Guard</span>
          </div>
          <p className="font-semibold text-foreground">Relationship-Safe</p>
        </div>
      </div>

      {riskAvoided && (
        <div className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">Avoided Pitfall: </span>
            <span>{riskAvoided}</span>
          </div>
        </div>
      )}
    </div>
  );
}
