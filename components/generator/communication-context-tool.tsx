"use client";

import React from "react";
import {
  Sparkles,
  ShieldAlert,
  Target,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunicationContextOutput, GenerateMessageInput } from "@/lib/schemas";

export type ToolLifecycleState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

export interface CommunicationContextToolProps {
  /** The current lifecycle state of the tool */
  state: ToolLifecycleState;
  /** Input parameters provided to the tool */
  input?: Partial<GenerateMessageInput>;
  /** Structured output result from analyzeCommunicationContext */
  output?: CommunicationContextOutput | null;
  /** Optional error message for output-error state */
  errorMessage?: string;
  /** Optional callback to retry tool analysis */
  onRetry?: () => void;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * CommunicationContextTool
 * 
 * Generative UI component representing the server-side `analyzeCommunicationContext` AI tool.
 * Implements 4 distinct, meaningful lifecycle states:
 * 1. `input-streaming`: Real-time status answering "What is Conveyra doing right now?"
 * 2. `input-available`: Structured parameter overview answering "What did Conveyra understand?"
 * 3. `output-available`: Structured communication signals answering "What did Conveyra learn?"
 * 4. `output-error`: Graceful failure recovery answering "What went wrong and what can I do?"
 */
export function CommunicationContextTool({
  state,
  input,
  output,
  errorMessage,
  onRetry,
  className = "",
}: CommunicationContextToolProps) {
  // Sensitivity badge colors
  const getSensitivityStyle = (level?: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "medium":
        return "bg-electric-subtle text-electric border-electric-border";
      case "low":
      default:
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    }
  };

  // Formality badge colors
  const getFormalityStyle = (level?: "casual" | "professional" | "formal") => {
    switch (level) {
      case "formal":
        return "bg-brand-subtle text-brand border-brand-border";
      case "professional":
        return "bg-secondary text-foreground border-border";
      case "casual":
      default:
        return "bg-lavender text-lavender-foreground border-brand-border/40";
    }
  };

  // Urgency badge colors
  const getUrgencyStyle = (level?: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium":
        return "bg-secondary text-foreground border-border";
      case "low":
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/90 bg-card p-5 sm:p-6 shadow-subtle transition-all duration-200 ease-in-out relative overflow-hidden",
        state === "output-available" && "border-brand/30 dark:border-brand/40 bg-card/95",
        state === "output-error" && "border-destructive/30 bg-destructive/[0.02]",
        className
      )}
      data-testid="communication-context-tool"
      data-state={state}
    >
      {/* ------------------------------------------------------------- */}
      {/* STATE 1: INPUT STREAMING                                      */}
      {/* Answers: "What is Conveyra doing right now?"                  */}
      {/* ------------------------------------------------------------- */}
      {state === "input-streaming" && (
        <div className="flex items-center gap-3 py-2 animate-in fade-in duration-200" data-testid="state-input-streaming">
          <div className="w-8 h-8 rounded-lg bg-electric-subtle text-electric flex items-center justify-center border border-electric-border shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse text-electric" aria-hidden="true" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Tool Calling: analyzeCommunicationContext
            </h4>
            <p className="text-xs text-muted-foreground">
              Analyzing your communication context and extracting risk signals...
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STATE 2: INPUT AVAILABLE                                      */}
      {/* Answers: "What did Conveyra understand from my request?"      */}
      {/* ------------------------------------------------------------- */}
      {state === "input-available" && (
        <div className="space-y-3 animate-in fade-in duration-200" data-testid="state-input-available">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                Context Parameters Received
              </h4>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
              Ready for Analysis
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {input?.recipient && (
              <span className="px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border">
                Recipient: <strong className="text-foreground capitalize">{input.recipient}</strong>
              </span>
            )}
            {input?.tone && (
              <span className="px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border">
                Tone: <strong className="text-foreground capitalize">{input.tone}</strong>
              </span>
            )}
            {input?.length && (
              <span className="px-2.5 py-1 rounded-md bg-secondary text-foreground border border-border">
                Length: <strong className="text-foreground capitalize">{input.length}</strong>
              </span>
            )}
          </div>

          {input?.context && (
            <p className="text-xs text-muted-foreground italic truncate max-w-full">
              &quot;{input.context}&quot;
            </p>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STATE 3: OUTPUT AVAILABLE                                     */}
      {/* Answers: "What did Conveyra learn?"                           */}
      {/* ------------------------------------------------------------- */}
      {state === "output-available" && output && (
        <div className="space-y-4 animate-in fade-in duration-200" data-testid="state-output-available">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand-subtle text-brand flex items-center justify-center border border-brand-border shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                Communication Context Signals
              </h4>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-subtle text-brand border border-brand-border">
              <span>Type:</span>
              <span>{output.communicationType}</span>
            </div>
          </div>

          {/* Core Metrics Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className={cn("p-2 rounded-xl border flex flex-col items-center justify-center", getSensitivityStyle(output.sensitivity))}>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Sensitivity</span>
              <span className="font-extrabold capitalize text-xs mt-0.5">{output.sensitivity}</span>
            </div>

            <div className={cn("p-2 rounded-xl border flex flex-col items-center justify-center", getFormalityStyle(output.formality))}>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Formality</span>
              <span className="font-extrabold capitalize text-xs mt-0.5">{output.formality}</span>
            </div>

            <div className={cn("p-2 rounded-xl border flex flex-col items-center justify-center", getUrgencyStyle(output.urgency))}>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Urgency</span>
              <span className="font-extrabold capitalize text-xs mt-0.5">{output.urgency}</span>
            </div>
          </div>

          {/* Risks and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Risks to Avoid */}
            {output.risks && output.risks.length > 0 && (
              <div className="space-y-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-3.5">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Potential Risks Avoided</span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground pl-4 list-disc">
                  {output.risks.map((risk, index) => (
                    <li key={index} className="leading-snug">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strategic Focus */}
            {output.recommendedFocus && output.recommendedFocus.length > 0 && (
              <div className="space-y-2 rounded-xl border border-brand/20 bg-brand/[0.03] p-3.5">
                <div className="flex items-center gap-1.5 text-brand font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Recommended Focus</span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground pl-4 list-disc">
                  {output.recommendedFocus.map((focus, index) => (
                    <li key={index} className="leading-snug">
                      {focus}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STATE 4: OUTPUT ERROR                                         */}
      {/* Answers: "What went wrong and what can I do?"                 */}
      {/* ------------------------------------------------------------- */}
      {state === "output-error" && (
        <div className="space-y-3 animate-in fade-in duration-200" data-testid="state-output-error">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
              Context Analysis Unavailable
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {errorMessage || "We couldn't analyze the communication context, but you can still generate your message."}
          </p>
          {onRetry && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Retry Context Analysis</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
