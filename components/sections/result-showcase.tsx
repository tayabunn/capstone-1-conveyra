import { Copy, Sparkles, Compass, Shuffle } from "lucide-react";

export function ResultShowcase() {
  return (
    <section className="py-24 sm:py-32 border-t border-border/50 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border/60 mb-4">
            Output Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            More than just a message. Complete communication intelligence.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Conveyra pairs every output with tactical communication rationale and a secondary perspective so you stay fully in control.
          </p>
        </div>

        {/* Product result mockup */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-elevated dark:shadow-elevated-dark space-y-8">
          {/* Header bar of card */}
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Generated Preview
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Manager · Direct · Short
            </span>
          </div>

          {/* Primary message */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Your Suggested Message
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Primary recommendation
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 sm:p-7">
              <p className="text-foreground font-medium text-base sm:text-lg leading-relaxed">
                &ldquo;Hi Alex, I wanted to let you know ahead of time that the client report will be delivered by Thursday at 2 PM instead of Tuesday morning due to delayed API data. All core sections are on track, and I will share an early preview tomorrow.&rdquo;
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-2.5 text-xs font-bold shadow-subtle select-none">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Message</span>
            </div>
          </div>

          {/* Breakdown dual grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Why This Works
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/40 p-5 h-full">
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                  Flags the delay proactively with a concrete timeline, eliminates defensive apologies, and assures the recipient that work is actively moving forward.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Shuffle className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Alternative Approach
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/40 p-5 h-full">
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                  &ldquo;Quick update on the report: API downtime shifted our timeline. I can send the draft now without raw numbers, or provide the complete version on Thursday. Which works better for your review?&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
