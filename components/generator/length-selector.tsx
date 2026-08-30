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
  ({ value, onChange, error, className, disabled, ...props }, ref) => {
    return (
      <fieldset className={cn("space-y-2.5", className)} ref={ref} aria-describedby={error ? "length-error" : undefined}>
        <legend className="text-sm font-semibold text-foreground tracking-tight mb-2.5">
          Message Length <span className="text-destructive" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-secondary/80 rounded-xl border border-border/60">
          {lengths.map((length) => {
            const isSelected = value === length.value;
            const inputId = `length-${length.value}`;
            return (
              <label
                key={length.value}
                htmlFor={inputId}
                className={cn(
                  "relative flex flex-col items-center justify-center text-center cursor-pointer rounded-lg py-2.5 px-3 transition-all duration-150 select-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1",
                  isSelected
                    ? "bg-card text-foreground shadow-subtle border border-border/60 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50",
                  disabled && "opacity-50 pointer-events-none cursor-not-allowed",
                  error && "ring-1 ring-destructive focus-within:ring-destructive"
                )}
              >
                <input
                  id={inputId}
                  type="radio"
                  name="length"
                  value={length.value}
                  checked={isSelected}
                  onChange={() => onChange?.(length.value)}
                  disabled={disabled}
                  className="sr-only"
                  aria-invalid={!!error}
                  {...props}
                />
                <span className="text-sm font-medium">{length.label}</span>
              </label>
            );
          })}
        </div>
        {error && (
          <p id="length-error" className="text-xs text-destructive font-medium flex items-center gap-1.5 pt-0.5" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);
LengthSelector.displayName = "LengthSelector";
