import { Check } from "lucide-react";

export function TransformationSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-border bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border mb-4">
            Transformation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            From raw hesitation to calibrated clarity.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Say what needs to be said without creating unnecessary friction or losing your voice.
          </p>
        </div>

        {/* Asymmetric Editorial Transformation Demonstration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Raw Thought Input */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-subtle hover:border-electric/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] font-bold tracking-widest text-electric uppercase px-2.5 py-1 rounded-md bg-electric-subtle border border-electric-border">
                  01 — Raw Thought
                </span>
                <span className="text-xs text-muted-foreground font-mono">Unfiltered</span>
              </div>
              <div className="rounded-xl border border-border/80 bg-secondary/50 p-5">
                <p className="text-foreground/90 font-normal text-sm sm:text-base leading-relaxed italic">
                  &ldquo;I don&apos;t want to do another round of revisions for free, but I don&apos;t want to sound difficult.&rdquo;
                </p>
              </div>
            </div>

            {/* Applied Context Badges */}
            <div className="pt-6 mt-6 border-t border-border">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                Applied Context
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-electric-subtle text-electric border border-electric-border font-semibold">
                  Recipient: Client
                </span>
                <span className="px-2.5 py-1 rounded-md bg-brand-subtle text-brand border border-brand-border font-semibold">
                  Tone: Professional
                </span>
                <span className="px-2.5 py-1 rounded-md bg-lavender text-lavender-foreground border border-brand-border/40 font-semibold">
                  Length: Medium
                </span>
              </div>
            </div>
          </div>

          {/* Right: Conveyra Calibrated Result */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-brand/30 dark:border-brand/40 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-elevated dark:shadow-elevated-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric via-brand to-electric" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] font-bold tracking-widest text-brand uppercase px-2.5 py-1 rounded-md bg-brand-subtle border border-brand/30 flex items-center gap-1.5 font-semibold">
                  <Check className="w-3 h-3 stroke-[3]" />
                  02 — Conveyra Message
                </span>
                <span className="text-xs text-muted-foreground font-mono">Ready to send</span>
              </div>
              <div className="rounded-xl border border-border bg-background p-6 shadow-subtle">
                <p className="text-foreground text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                  &ldquo;Thanks for sending over these adjustments. Because they expand on the original scope of our milestone, I want to make sure we allocate the right time. I can prepare a brief estimate for the added scope, or we can queue these for the next phase. Let me know which direction works best for you.&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span className="text-electric font-medium">Boundary enforced</span>
              <span>·</span>
              <span className="text-brand font-medium">Relationship preserved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
