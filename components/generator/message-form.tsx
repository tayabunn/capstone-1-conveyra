"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";
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
  "Finding the right tone...",
  "Preparing your message...",
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingIndex(0);
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
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
      <div className="space-y-3">
        <label htmlFor="context" className="block text-sm font-semibold text-foreground tracking-tight">
          Describe what you want to say <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <p className="text-sm text-muted-foreground leading-relaxed" id="context-description">
          Include the important details and the outcome you want from the conversation.
        </p>
        <textarea
          id="context"
          name="context"
          aria-describedby={`context-description ${errors.context ? 'context-error' : ''}`}
          aria-invalid={!!errors.context}
          aria-required="true"
          value={formData.context}
          onChange={(e) => {
            setFormData({ ...formData, context: e.target.value });
            if (errors.context) setErrors({ ...errors, context: "" });
          }}
          disabled={isLoading}
          placeholder="I need to tell my client that the new changes they requested are outside our original agreement and will require additional time."
          className={cn(
            "min-h-[160px] w-full rounded-2xl border border-input bg-card/50 px-5 py-4 text-base text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all",
            errors.context && "border-destructive focus:ring-destructive"
          )}
        />
        <div className="flex justify-between items-start pt-1">
          {errors.context ? (
            <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 flex items-center gap-1.5" id="context-error" role="alert">
              <AlertCircle className="w-4 h-4" />
              {errors.context}
            </p>
          ) : (
            <div />
          )}
          <span className={cn("text-xs font-medium ml-auto tabular-nums", (formData.context?.length || 0) > 2000 ? "text-destructive" : "text-muted-foreground")}>
            {(formData.context?.length || 0).toLocaleString()} / 2,000
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-border/50">
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

      <div className="pt-8 border-t border-border/50">
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

      <div className="space-y-3 pt-8 border-t border-border/50">
        <label htmlFor="draft" className="block text-sm font-semibold text-foreground tracking-tight">
          Already wrote something? <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
        </label>
        <p className="text-sm text-muted-foreground leading-relaxed" id="draft-description">
          Paste your rough draft and Conveyra will help improve it while preserving your meaning.
        </p>
        <textarea
          id="draft"
          name="draft"
          aria-describedby={`draft-description ${errors.draft ? 'draft-error' : ''}`}
          aria-invalid={!!errors.draft}
          value={formData.draft}
          onChange={(e) => {
            setFormData({ ...formData, draft: e.target.value });
            if (errors.draft) setErrors({ ...errors, draft: "" });
          }}
          disabled={isLoading}
          className={cn(
            "min-h-[120px] w-full rounded-2xl border border-input bg-card/50 px-5 py-4 text-base text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all",
            errors.draft && "border-destructive focus:ring-destructive"
          )}
        />
        <div className="flex justify-between items-start pt-1">
          {errors.draft ? (
            <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 flex items-center gap-1.5" id="draft-error" role="alert">
              <AlertCircle className="w-4 h-4" />
              {errors.draft}
            </p>
          ) : (
            <div />
          )}
          <span className={cn("text-xs font-medium ml-auto tabular-nums", (formData.draft?.length || 0) > 2000 ? "text-destructive" : "text-muted-foreground")}>
            {(formData.draft?.length || 0).toLocaleString()} / 2,000
          </span>
        </div>
      </div>

      <div className="pt-8 pb-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-10 py-4 text-base font-bold tracking-tight shadow-[var(--shadow-premium)] transition-all hover:opacity-90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {loadingMessages[loadingIndex]}
            </span>
          ) : (
            "Generate Message"
          )}
        </button>
      </div>
    </form>
  );
}
