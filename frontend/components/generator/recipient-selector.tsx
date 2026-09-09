import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertCircle } from "lucide-react";

interface RecipientSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const RecipientSelector = forwardRef<HTMLSelectElement, RecipientSelectorProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor="recipient" className="block text-xs font-bold uppercase tracking-wider text-foreground">
          Who are you writing to? <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <div className="relative group">
          <select
            id="recipient"
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? "recipient-error" : undefined}
            className={cn(
              "appearance-none flex h-12 w-full items-center justify-between rounded-xl border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-subtle transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 hover:border-foreground/30 cursor-pointer",
              error && "border-destructive focus:ring-destructive",
              className
            )}
            {...props}
          >
            <option value="" disabled>Select a recipient...</option>
            <option value="manager">Manager</option>
            <option value="client">Client</option>
            <option value="colleague">Colleague</option>
            <option value="friend">Friend</option>
            <option value="family">Family</option>
            <option value="other">Other</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground group-hover:text-foreground transition-colors">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="text-xs text-destructive font-medium flex items-center gap-1.5 pt-0.5" id="recipient-error" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
RecipientSelector.displayName = "RecipientSelector";
