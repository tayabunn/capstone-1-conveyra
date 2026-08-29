import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const lengths = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "detailed", label: "Detailed" },
];

interface LengthSelectorProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const LengthSelector = forwardRef<HTMLFieldSetElement, LengthSelectorProps>(
  ({ value, onChange, error, className, ...props }, ref) => {
    return (
      <fieldset className={cn("space-y-3", className)} ref={ref} aria-describedby={error ? "length-error" : undefined}>
        <legend className="text-sm font-semibold text-foreground tracking-tight mb-3">
          Message Length <span className="text-destructive" aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-1 bg-secondary/60 p-1.5 rounded-2xl border border-border/50 inline-flex shadow-inner">
          {lengths.map((length) => (
            <label
              key={length.value}
              className={cn(
                "relative flex cursor-pointer rounded-xl px-6 py-2.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1",
                value === length.value 
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/50 font-bold" 
                  : "text-muted-foreground font-medium hover:text-foreground hover:bg-card/40",
                error && "ring-destructive focus-within:ring-destructive"
              )}
            >
              <input
                type="radio"
                name="length"
                value={length.value}
                checked={value === length.value}
                onChange={() => onChange?.(length.value)}
                className="sr-only"
                aria-invalid={!!error}
                {...props}
              />
              <span className="block text-sm font-medium">{length.label}</span>
            </label>
          ))}
        </div>
        {error && (
          <p id="length-error" className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 mt-2 flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);
LengthSelector.displayName = "LengthSelector";
