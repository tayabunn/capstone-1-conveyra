import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertCircle } from "lucide-react";

interface RecipientSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const RecipientSelector = forwardRef<HTMLSelectElement, RecipientSelectorProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-2.5">
        <label htmlFor="recipient" className="block text-sm font-semibold text-foreground tracking-tight">
          Who are you writing to? <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <select
            id="recipient"
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? "recipient-error" : undefined}
            className={cn(
              "appearance-none flex h-14 w-full items-center justify-between rounded-2xl border border-input bg-card/50 px-5 py-2 text-base font-medium text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive font-medium animate-in slide-in-from-top-1 flex items-center gap-1.5" id="recipient-error" role="alert">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
RecipientSelector.displayName = "RecipientSelector";
