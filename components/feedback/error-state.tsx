import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 sm:p-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">Generation Failed</h3>
      <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-xl bg-destructive text-destructive-foreground px-8 py-3 text-sm font-semibold shadow-sm transition-all hover:bg-destructive/90 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Try Again
      </button>
    </div>
  );
}
