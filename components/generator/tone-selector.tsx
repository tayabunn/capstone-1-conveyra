import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const tones = [
  { value: "professional", label: "Professional", description: "Clear and respectful" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "direct", label: "Direct", description: "Clear and straightforward" },
  { value: "empathetic", label: "Empathetic", description: "Understanding and considerate" },
];

interface ToneSelectorProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const ToneSelector = forwardRef<HTMLFieldSetElement, ToneSelectorProps>(
  ({ value, onChange, error, className, ...props }, ref) => {
    return (
      <fieldset className={cn("space-y-3", className)} ref={ref} aria-describedby={error ? "tone-error" : undefined}>
        <legend className="text-sm font-semibold text-foreground tracking-tight mb-3">
          Select Tone <span className="text-destructive" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tones.map((tone) => (
            <label
              key={tone.value}
              className={cn(
                "relative flex cursor-pointer flex-col rounded-2xl border p-5 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                value === tone.value 
                  ? "border-foreground bg-foreground shadow-md scale-[0.98]" 
                  : "border-border/60 bg-card hover:border-foreground/30 hover:bg-secondary/40",
                error && "border-destructive focus-within:ring-destructive"
              )}
            >
              <input
                type="radio"
                name="tone"
                value={tone.value}
                checked={value === tone.value}
                onChange={() => onChange?.(tone.value)}
                className="sr-only"
                aria-invalid={!!error}
                {...props}
              />
              <span className={cn("block text-base font-bold tracking-tight", value === tone.value ? "text-background" : "text-foreground")}>{tone.label}</span>
              <span className={cn("mt-1.5 block text-xs font-medium leading-relaxed", value === tone.value ? "text-background/80" : "text-muted-foreground")}>
                {tone.description}
              </span>
            </label>
          ))}
        </div>
        {error && (
          <p id="tone-error" className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 mt-2 flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);
ToneSelector.displayName = "ToneSelector";
