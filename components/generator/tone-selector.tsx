import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

const tones = [
  { value: "professional", label: "Professional", description: "Clear, courteous, and objective" },
  { value: "friendly", label: "Friendly", description: "Warm, conversational, and approachable" },
  { value: "direct", label: "Direct", description: "Concise, unambiguous, and straightforward" },
  { value: "empathetic", label: "Empathetic", description: "Considerate, understanding, and supportive" },
];

interface ToneSelectorProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const ToneSelector = forwardRef<HTMLFieldSetElement, ToneSelectorProps>(
  ({ value, onChange, error, className, disabled, ...props }, ref) => {
    return (
      <fieldset className={cn("space-y-2.5", className)} ref={ref} aria-describedby={error ? "tone-error" : undefined}>
        <legend className="text-sm font-semibold text-foreground tracking-tight mb-2.5">
          Select Tone <span className="text-destructive" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {tones.map((tone) => {
            const isSelected = value === tone.value;
            const inputId = `tone-${tone.value}`;
            return (
              <label
                key={tone.value}
                htmlFor={inputId}
                className={cn(
                  "group relative flex flex-col p-4 rounded-xl border transition-all duration-150 select-none cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                  isSelected
                    ? "border-foreground bg-foreground text-background shadow-subtle"
                    : "border-border/70 bg-card text-foreground hover:border-foreground/40 hover:bg-secondary/40",
                  disabled && "opacity-50 pointer-events-none cursor-not-allowed",
                  error && "border-destructive focus-within:ring-destructive"
                )}
              >
                <input
                  id={inputId}
                  type="radio"
                  name="tone"
                  value={tone.value}
                  checked={isSelected}
                  onChange={() => onChange?.(tone.value)}
                  disabled={disabled}
                  className="sr-only"
                  aria-invalid={!!error}
                  {...props}
                />
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-bold tracking-tight", isSelected ? "text-background" : "text-foreground")}>
                    {tone.label}
                  </span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-background stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-border/80 group-hover:border-foreground/40" />
                  )}
                </div>
                <span className={cn("mt-1 block text-xs leading-normal", isSelected ? "text-background/80" : "text-muted-foreground")}>
                  {tone.description}
                </span>
              </label>
            );
          })}
        </div>
        {error && (
          <p id="tone-error" className="text-xs text-destructive font-medium flex items-center gap-1.5 pt-0.5" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);
ToneSelector.displayName = "ToneSelector";
