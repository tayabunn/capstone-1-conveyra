export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border/60 mb-4">
              Method
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              How it works
            </h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Three straightforward steps to turn hesitation into polished, ready-to-send messages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="rounded-2xl border border-border/70 bg-card p-8 flex flex-col justify-between shadow-subtle hover:border-foreground/30 transition-colors">
            <div>
              <div className="font-mono text-2xl font-black tracking-tight text-foreground/40 mb-6">
                01
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight text-foreground">
                Describe the situation
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Provide your raw thoughts, what happened, and what outcome you want. You can even paste a messy initial draft.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border/50 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              Input Stage
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-border/70 bg-card p-8 flex flex-col justify-between shadow-subtle hover:border-foreground/30 transition-colors">
            <div>
              <div className="font-mono text-2xl font-black tracking-tight text-foreground/40 mb-6">
                02
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight text-foreground">
                Set the context
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Choose who you are writing to, calibrate the tone, and select your preferred message length for precision.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border/50 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              Calibration Stage
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-border/70 bg-card p-8 flex flex-col justify-between shadow-subtle hover:border-foreground/30 transition-colors">
            <div>
              <div className="font-mono text-2xl font-black tracking-tight text-foreground/40 mb-6">
                03
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight text-foreground">
                Get the right words
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get an actionable message, an explanation of why the phrasing works, and an alternative perspective to consider.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border/50 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              Synthesis Stage
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
