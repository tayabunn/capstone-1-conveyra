import { ArrowRight, ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center pt-12 sm:pt-16 pb-8 md:pb-10">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold tracking-widest uppercase bg-secondary/80 text-foreground border border-border shadow-subtle mb-6">
        <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
        AI Communication Assistant
      </div>
      
      {/* Editorial Headline with selective gradient */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] text-foreground leading-[1.06] mb-6 text-balance max-w-5xl mx-auto">
        Say what you mean.<br className="hidden sm:inline" />
        <span className="block sm:inline sm:ml-3 text-muted-foreground font-medium">
          Without wondering{" "}
          <span className="text-gradient-brand font-bold">how to say it</span>
        </span>
      </h1>
      
      {/* Supporting Copy */}
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed font-normal mb-8">
        Conveyra turns rough thoughts into clear, context-aware messages — shaped around who you&apos;re talking to, what you mean, and how you want to sound.
      </p>

      {/* Action CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
        <a
          href="#generator"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-7 py-3.5 text-sm sm:text-base font-bold tracking-tight shadow-card dark:shadow-card-dark transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span>Generate a Message</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-5 py-3.5 text-sm font-semibold tracking-tight text-foreground transition-all duration-150 hover:bg-secondary hover:border-foreground/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-subtle"
        >
          <span>See how it works</span>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        </a>
      </div>

      {/* Floating Product Transformation Visual Cue */}
      <div className="relative max-w-3xl mx-auto rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-4 sm:p-5 shadow-elevated dark:shadow-elevated-dark text-left transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-foreground">
              Direct Calibration Preview
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded-md bg-electric-subtle text-electric border border-electric-border font-semibold">
              Recipient: Client
            </span>
            <span className="px-2 py-0.5 rounded-md bg-brand-subtle text-brand border border-brand-border font-semibold">
              Tone: Professional
            </span>
            <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border font-semibold">
              Length: Short
            </span>
          </div>
        </div>
        <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="text-muted-foreground italic flex-1 truncate">
            &ldquo;Can&apos;t do another free revision round, milestone finished.&rdquo;
          </div>
          <div className="shrink-0 flex items-center gap-1.5 font-semibold text-brand text-xs font-mono">
            <ArrowRight className="w-3.5 h-3.5 text-electric" />
            <span>Polished & relationship-safe output</span>
          </div>
        </div>
      </div>
    </section>
  );
}
