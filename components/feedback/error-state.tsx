import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-8 sm:p-10 flex flex-col items-center text-center animate-in fade-in duration-300" role="alert">
      <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4 text-destructive">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">Generation Failed</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
        {error}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-6 py-2.5 text-xs sm:text-sm font-bold shadow-subtle transition-all hover:bg-foreground/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
