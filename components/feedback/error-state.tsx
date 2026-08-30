import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.04] p-8 sm:p-12 flex flex-col items-center text-center animate-in fade-in duration-300">
      <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-5 text-destructive">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Generation Failed</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
        {error}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-bold shadow-sm transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
