import { Copy, Sparkles, Compass, Shuffle } from "lucide-react";

export function ResultShowcase() {
  return (
    <section className="py-20 sm:py-28 border-t border-border bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border mb-4">
            Output Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Complete communication intelligence.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Conveyra delivers every output paired with strategic rationale and an alternative perspective.
          </p>
        </div>

        {/* Product Result Surface Mockup */}
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-card dark:shadow-card-dark space-y-8">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-foreground">
                Live Scenario Preview
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Manager · Direct · Short
            </span>
          </div>

          {/* Primary Message */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-2 py-0.5 rounded bg-secondary border border-border">
                Output
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand" /> Primary recommendation
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-subtle">
              <p className="text-foreground font-normal text-base sm:text-xl leading-relaxed tracking-[-0.01em]">
                &ldquo;Hi Alex, I wanted to let you know ahead of time that the client report will be delivered by Thursday at 2 PM instead of Tuesday morning due to delayed API data. All core sections are on track, and I will share an early preview tomorrow.&rdquo;
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-bold shadow-subtle select-none">
              <Copy className="w-4 h-4" />
              <span>Copy Message</span>
            </div>
          </div>

          {/* Strategic Rationale & Alternative Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-border">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-brand" />
                <span className="font-mono text-[11px] font-bold tracking-wider text-brand uppercase">
                  Why This Works
                </span>
              </div>
              <div className="rounded-xl border border-brand-border/40 bg-brand-subtle/40 dark:bg-brand-subtle/20 p-5 sm:p-6 h-full shadow-subtle">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed font-normal">
                  Flags the delay proactively with a concrete timeline, eliminates defensive apologies, and assures the recipient that work is actively moving forward.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Shuffle className="w-3.5 h-3.5 text-electric" />
                <span className="font-mono text-[11px] font-bold tracking-wider text-electric uppercase">
                  Alternative Approach
                </span>
              </div>
              <div className="rounded-xl border border-electric-border/40 bg-electric-subtle/40 dark:bg-electric-subtle/20 p-5 sm:p-6 h-full shadow-subtle">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed font-normal">
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
