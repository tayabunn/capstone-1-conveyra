export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-t border-border bg-secondary/20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="max-w-xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border mb-4">
            Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Three deliberate stages to turn unfiltered thoughts into calibrated, context-aware communication.
          </p>
        </div>
        
        {/* Editorial 3-Stage Composition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Stage 01 */}
          <div className="rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:shadow-card hover:border-electric/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-electric">
                  01
                </span>
                <span className="font-mono text-[10px] text-electric font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-electric-subtle border border-electric-border">
                  Input Stage
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2.5 tracking-tight text-foreground">
                Describe
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Tell Conveyra what you need to say, what outcome you want, or paste an unfiltered rough draft.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border/80 text-[11px] font-mono text-muted-foreground">
              Unfiltered intent preserved
            </div>
          </div>

          {/* Stage 02 */}
          <div className="rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:shadow-card hover:border-brand/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-brand">
                  02
                </span>
                <span className="font-mono text-[10px] text-brand font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-brand-subtle border border-brand-border">
                  Context Stage
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2.5 tracking-tight text-foreground">
                Calibrate
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Select who you are writing to, tune the tone, and set the message length to match the relationship dynamic.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border/80 text-[11px] font-mono text-muted-foreground">
              Nuance & boundaries shaped
            </div>
          </div>

          {/* Stage 03 */}
          <div className="rounded-2xl sm:rounded-3xl border border-brand/30 dark:border-brand/40 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-elevated dark:shadow-elevated-dark hover:border-brand/60 transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric via-brand to-electric" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-brand">
                  03
                </span>
                <span className="font-mono text-[10px] text-brand uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-brand-subtle border border-brand/30 font-bold">
                  Output Stage
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2.5 tracking-tight text-foreground">
                Communicate
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Receive a ready-to-send message, a strategic explanation of why it works, and an alternative perspective.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border/80 text-[11px] font-mono text-brand font-semibold">
              Actionable message + rationale
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
