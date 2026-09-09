import { ArrowRight, ArrowDown, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center pt-12 sm:pt-20 pb-10 md:pb-14 bg-radial-ambient">
      {/* Eyebrow badge with glowing pulse dot */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-secondary/80 text-foreground border border-border/80 shadow-subtle mb-6 backdrop-blur-md">
        <span className="badge-dot" />
        <span className="font-mono text-[11px] tracking-wider uppercase text-muted-foreground">
          AI Communication Copilot v2.0
        </span>
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
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed font-normal mb-10">
        Conveyra turns rough thoughts into clear, context-aware messages — shaped around who you&apos;re talking to, your channel, what you mean, and how you want to sound.
      </p>

      {/* Action CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
        <Link
          href="/app"
          className="btn-tactile btn-tactile-brand animate-shine px-8 py-4 text-sm sm:text-base font-bold shadow-elevated dark:shadow-elevated-dark"
        >
          <Sparkles className="w-4 h-4 text-lavender" />
          <span>Start Calibrating Free</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
        <a
          href="#demo"
          className="btn-tactile btn-tactile-secondary px-6 py-4 text-sm font-semibold tracking-tight text-foreground shadow-subtle"
        >
          <span>Try Interactive Demo</span>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        </a>
      </div>

      {/* Floating Product Transformation Visual Cue */}
      <div className="relative max-w-3xl mx-auto rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-5 sm:p-6 shadow-elevated dark:shadow-elevated-dark text-left transition-all card-glass-glow">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="badge-dot" />
            <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-foreground">
              Direct Calibration Preview
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="px-2.5 py-1 rounded-full bg-electric-subtle text-electric border border-electric-border font-semibold">
              Recipient: Client
            </span>
            <span className="px-2.5 py-1 rounded-full bg-brand-subtle text-brand border border-brand-border font-semibold">
              Tone: Professional
            </span>
            <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border font-semibold">
              Channel: Email
            </span>
          </div>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="text-muted-foreground italic flex-1 truncate">
            &ldquo;Can&apos;t do another free revision round, milestone finished.&rdquo;
          </div>
          <div className="shrink-0 flex items-center gap-2 font-semibold text-brand text-xs font-mono">
            <ArrowRight className="w-3.5 h-3.5 text-electric" />
            <span>Polished & relationship-safe output</span>
          </div>
        </div>
      </div>
    </section>
  );
}
