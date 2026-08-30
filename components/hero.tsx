import { ArrowRight, ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center pt-12 sm:pt-16 pb-8 md:pb-10">
      {/* Subtle atmospheric backdrop framing the hero */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-radial from-brand/10 via-transparent to-transparent blur-2xl dark:from-brand/15 opacity-75 -z-10" 
      />

      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-widest uppercase bg-secondary text-muted-foreground border border-border mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
        AI Communication Assistant
      </div>
      
      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] text-foreground leading-[1.05] mb-6 text-balance max-w-4xl mx-auto">
        Say what you mean.<br />
        <span className="text-muted-foreground font-medium">Just the right way.</span>
      </h1>
      
      {/* Supporting Copy */}
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed font-normal mb-8">
        Turn difficult thoughts into clear, context-aware messages that sound like you.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <a
          href="#generator"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-bold tracking-tight shadow-card dark:shadow-card-dark transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span>Generate a Message</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-5 py-3 text-sm font-semibold tracking-tight text-foreground transition-all duration-150 hover:bg-secondary hover:border-foreground/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span>See how it works</span>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        </a>
      </div>
    </section>
  );
}
