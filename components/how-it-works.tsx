export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-t border-border/80 bg-secondary/15 relative">
      <div className="w-[90%] max-w-[90%] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="badge-shiny mb-4">
            <span className="badge-dot" />
            Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Three deliberate stages to turn unfiltered thoughts into calibrated, context-aware communication
          </p>
        </div>
        
        {/* Editorial 3-Stage Composition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Stage 01 */}
          <div className="rounded-lg p-6 sm:p-8 flex flex-col justify-between card-luminous-tactile group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-brand drop-shadow-sm">
                  01
                </span>
                <span className="chip-tactile font-mono text-[10px] text-brand font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
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
            <div className="mt-8 pt-4 border-t border-border/70 text-[11px] font-mono text-brand font-semibold">
              Unfiltered intent preserved
            </div>
          </div>

          {/* Stage 02 */}
          <div className="rounded-lg p-6 sm:p-8 flex flex-col justify-between card-luminous-tactile group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-brand drop-shadow-sm">
                  02
                </span>
                <span className="chip-tactile font-mono text-[10px] text-brand font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
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
            <div className="mt-8 pt-4 border-t border-border/70 text-[11px] font-mono text-brand font-semibold">
              Nuance & boundaries shaped
            </div>
          </div>

          {/* Stage 03 */}
          <div className="rounded-lg p-6 sm:p-8 flex flex-col justify-between card-luminous-tactile relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-brand drop-shadow-sm">
                  03
                </span>
                <span className="chip-tactile font-mono text-[10px] text-brand uppercase tracking-widest px-3 py-1 rounded-full font-bold">
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
            <div className="mt-8 pt-4 border-t border-border/70 text-[11px] font-mono text-brand font-semibold">
              Actionable message + rationale
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
