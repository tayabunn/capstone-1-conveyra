import { ArrowDown, Check, CornerDownRight } from "lucide-react";

export function TransformationSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border/60 mb-4">
            Transformation
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            From raw hesitation to calibrated clarity.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Conveyra bridges the gap between what you really think and what actually gets results.
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-10 shadow-card dark:shadow-card-dark space-y-8">
          {/* 1. Raw Thought */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                01. Raw Thought
              </span>
              <span className="text-xs font-mono text-muted-foreground/80">Unfiltered input</span>
            </div>
            <div className="rounded-xl border border-dashed border-border/90 bg-secondary/30 p-5 sm:p-6">
              <p className="text-foreground/90 font-mono text-sm sm:text-base leading-relaxed italic">
                &ldquo;I don&apos;t want to do these extra revisions for free but I don&apos;t want to sound difficult.&rdquo;
              </p>
            </div>
          </div>

          {/* 2. Context Applied */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-4 rounded-xl bg-secondary/60 border border-border/40 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CornerDownRight className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider font-mono text-[11px]">Context Parameters</span>
            </div>
            <div className="flex items-center gap-2 font-mono font-medium">
              <span className="px-2.5 py-1 rounded-md bg-background border border-border/60 text-foreground">Recipient: Client</span>
              <span className="px-2.5 py-1 rounded-md bg-background border border-border/60 text-foreground">Tone: Professional</span>
              <span className="px-2.5 py-1 rounded-md bg-background border border-border/60 text-foreground">Length: Medium</span>
            </div>
          </div>

          {/* 3. Calibrated Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest text-foreground uppercase flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                02. Conveyra Result
              </span>
              <span className="text-xs font-mono text-muted-foreground">Calibrated & actionable</span>
            </div>
            <div className="rounded-2xl border border-foreground/20 bg-background p-6 sm:p-8 shadow-subtle relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-foreground" />
              <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium">
                &ldquo;Thanks for sending over these adjustments. Because they expand on the original scope of our milestone, I want to make sure we allocate the right time. I can prepare a brief estimate for the added scope, or we can queue these for the next phase. Let me know which direction works best for you.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
