"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2, AlertCircle, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { generateMessageSchema, type GenerateMessageInput } from "@/lib/schemas";
import { RecipientSelector } from "./recipient-selector";
import { ToneSelector } from "./tone-selector";
import { LengthSelector } from "./length-selector";
import { cn } from "@/lib/utils";

interface MessageFormProps {
  initialData?: Partial<GenerateMessageInput>;
  onSubmit: (data: GenerateMessageInput) => void;
  isLoading?: boolean;
}

const loadingMessages = [
  "Understanding your context...",
  "Calibrating the tone...",
  "Synthesizing the core message...",
  "Crafting alternative perspectives...",
  "Polishing final output...",
];

export function MessageForm({ initialData, onSubmit, isLoading }: MessageFormProps) {
  const [formData, setFormData] = useState<Partial<GenerateMessageInput>>(initialData || {
    context: "",
    recipient: undefined,
    tone: undefined,
    length: undefined,
    draft: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [showDraft, setShowDraft] = useState(!!initialData?.draft);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingIndex(0);
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const validate = (): boolean => {
    try {
      generateMessageSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        const newErrors: Record<string, string> = {};
        zodError.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        
        const firstErrorPath = zodError.issues[0]?.path[0]?.toString();
        if (firstErrorPath) {
          const el = document.getElementById(firstErrorPath) || document.querySelector(`[name="${firstErrorPath}"]`);
          if (el) {
            (el as HTMLElement).focus();
          }
        }
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as GenerateMessageInput);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      {/* STEP 01 */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border/50">
              Step 01
            </span>
            <label htmlFor="context" className="text-sm sm:text-base font-bold tracking-tight text-foreground">
              Describe what you want to say <span className="text-destructive" aria-hidden="true">*</span>
            </label>
          </div>
          <span className={cn("text-xs font-mono tabular-nums", (formData.context?.length || 0) > 2000 ? "text-destructive font-semibold" : "text-muted-foreground")}>
            {(formData.context?.length || 0).toLocaleString()} / 2,000
          </span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed" id="context-description">
          Be honest and raw. Mention what happened, what you need to achieve, and any boundaries to keep.
        </p>

        <div className="relative">
          <textarea
            id="context"
            name="context"
            aria-describedby={`context-description ${errors.context ? 'context-error' : ''}`}
            aria-invalid={!!errors.context}
            aria-required="true"
            value={formData.context || ""}
            onChange={(e) => {
              setFormData({ ...formData, context: e.target.value });
              if (errors.context) setErrors({ ...errors, context: "" });
            }}
            disabled={isLoading}
            placeholder="e.g. A client asked for 3 additional rounds of design revisions outside our milestone agreement. I want to decline politely and offer a paid add-on without sounding hostile."
            rows={5}
            className={cn(
              "w-full rounded-2xl border border-input bg-background/50 px-5 py-4 text-sm sm:text-base text-foreground shadow-subtle ring-offset-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all leading-relaxed",
              errors.context && "border-destructive focus:ring-destructive"
            )}
          />
        </div>

        {errors.context && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1.5 pt-0.5" id="context-error" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.context}
          </p>
        )}
      </div>

      {/* STEP 02 & STEP 03 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-border/50">
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border/50">
              Step 02
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Recipient
            </span>
          </div>
          <RecipientSelector
            value={formData.recipient || ""}
            onChange={(e) => {
              setFormData({ ...formData, recipient: e.target.value as any });
              if (errors.recipient) setErrors({ ...errors, recipient: "" });
            }}
            error={errors.recipient}
            disabled={isLoading}
            aria-required="true"
          />
        </div>

        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border/50">
              Step 03
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Tone
            </span>
          </div>
          <ToneSelector
            value={formData.tone}
            onChange={(val) => {
              setFormData({ ...formData, tone: val as any });
              if (errors.tone) setErrors({ ...errors, tone: "" });
            }}
            error={errors.tone}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* STEP 04 */}
      <div className="pt-8 border-t border-border/50 space-y-3.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border/50">
            Step 04
          </span>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Length
          </span>
        </div>
        <LengthSelector
          value={formData.length}
          onChange={(val) => {
            setFormData({ ...formData, length: val as any });
            if (errors.length) setErrors({ ...errors, length: "" });
          }}
          error={errors.length}
          disabled={isLoading}
        />
      </div>

      {/* OPTIONAL ROUGH DRAFT */}
      <div className="pt-6 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label htmlFor="draft" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground tracking-tight cursor-pointer">
            <span>Already wrote something?</span>
            <span className="text-xs font-normal text-muted-foreground">(Optional draft)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowDraft(!showDraft)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            {showDraft ? "Hide draft" : "Add rough draft"}
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showDraft && "rotate-180")} />
          </button>
        </div>

        {showDraft && (
          <div className="mt-3.5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs text-muted-foreground leading-relaxed" id="draft-description">
              Paste your rough thoughts or messy draft. Conveyra will refine the language while preserving your core points.
            </p>
            <textarea
              id="draft"
              name="draft"
              aria-describedby={`draft-description ${errors.draft ? 'draft-error' : ''}`}
              aria-invalid={!!errors.draft}
              value={formData.draft || ""}
              onChange={(e) => {
                setFormData({ ...formData, draft: e.target.value });
                if (errors.draft) setErrors({ ...errors, draft: "" });
              }}
              disabled={isLoading}
              rows={3}
              placeholder="Paste any rough email or chat you began writing..."
              className={cn(
                "w-full rounded-xl border border-input bg-card/60 px-4 py-3 text-sm text-foreground shadow-subtle placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all",
                errors.draft && "border-destructive focus:ring-destructive"
              )}
            />
            {errors.draft && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1.5 pt-0.5" id="draft-error" role="alert">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.draft}
              </p>
            )}
          </div>
        )}
      </div>

      {/* PRIMARY CTA */}
      <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Structured output powered by Gemini 3.6</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-8 py-4 text-sm sm:text-base font-bold tracking-tight shadow-card dark:shadow-card-dark transition-all duration-150 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2.5">
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>{loadingMessages[loadingIndex]}</span>
            </span>
          ) : (
            <>
              <span>Generate Message</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
