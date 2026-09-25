import { ArrowRight, Sparkles, ShieldCheck, Zap, HeartHandshake, Check } from "lucide-react";
import Link from "next/link";
import { CardCanvasAnimation } from "@/components/ui/card-canvas-animation";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 border-t border-border/80 bg-background relative overflow-hidden">
      <div className="w-[90%] max-w-[90%] mx-auto text-center relative">
        <div className="relative rounded-lg p-10 sm:p-16 lg:p-20 overflow-hidden card-luminous-tactile border border-border/80 shadow-2xl">
          
          {/* 1. Interactive 60fps Canvas Constellation & Light Beam Animation */}
          <CardCanvasAnimation opacityClassName="opacity-75 dark:opacity-85" />

          {/* 2. Ambient Gradient Light Cones & Glowing Aura */}
          <div 
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-brand/50 dark:bg-brand/65 rounded-full blur-[100px] pointer-events-none"
            aria-hidden="true" 
          />
          <div 
            className="absolute -bottom-28 left-1/4 w-[380px] h-[280px] bg-electric/40 dark:bg-electric/50 rounded-full blur-[90px] pointer-events-none" 
            aria-hidden="true" 
          />
          <div 
            className="absolute -bottom-28 right-1/4 w-[380px] h-[280px] bg-lavender/40 dark:bg-purple-600/40 rounded-full blur-[90px] pointer-events-none" 
            aria-hidden="true" 
          />

          {/* 3. Subtle Perspective Grid Overlay */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.15)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
            aria-hidden="true"
          />

          {/* 4. Floating Context Chips (Desktop Visual Anchors) */}
          <div 
            className="hidden lg:flex items-center gap-2 absolute top-12 left-10 p-2.5 px-3.5 rounded-lg bg-card/80 backdrop-blur-md border border-brand/30 shadow-lg text-xs font-mono text-foreground animate-bounce-subtle pointer-events-none z-10"
            style={{ animationDuration: "5s" }}
          >
            <ShieldCheck className="w-4 h-4 text-brand" />
            <span className="font-semibold text-brand">Risk:</span>
            <span className="text-muted-foreground">Defensiveness Neutralized</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div 
            className="hidden lg:flex items-center gap-2 absolute bottom-12 left-12 p-2.5 px-3.5 rounded-lg bg-card/80 backdrop-blur-md border border-electric/30 shadow-lg text-xs font-mono text-foreground animate-bounce-subtle pointer-events-none z-10"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          >
            <Zap className="w-4 h-4 text-electric" />
            <span className="font-semibold text-electric">Tone:</span>
            <span className="text-muted-foreground">Calibrated Diplomacy</span>
          </div>

          <div 
            className="hidden lg:flex items-center gap-2 absolute top-14 right-10 p-2.5 px-3.5 rounded-lg bg-card/80 backdrop-blur-md border border-brand/30 shadow-lg text-xs font-mono text-foreground animate-bounce-subtle pointer-events-none z-10"
            style={{ animationDuration: "5.5s", animationDelay: "0.5s" }}
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-foreground">Clarity:</span>
            <span className="text-emerald-400 font-bold">100% Preserved</span>
          </div>

          <div 
            className="hidden lg:flex items-center gap-2 absolute bottom-12 right-12 p-2.5 px-3.5 rounded-lg bg-card/80 backdrop-blur-md border border-lavender/30 shadow-lg text-xs font-mono text-foreground animate-bounce-subtle pointer-events-none z-10"
            style={{ animationDuration: "6.5s", animationDelay: "1.5s" }}
          >
            <HeartHandshake className="w-4 h-4 text-lavender-foreground" />
            <span className="font-semibold text-lavender-foreground">Outcome:</span>
            <span className="text-muted-foreground">Relationship Protected</span>
          </div>

          {/* 5. Center Card Content */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="badge-shiny mb-6 backdrop-blur-md bg-card/60">
              <span className="badge-dot animate-pulse" />
              Instant Calibration
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Find the right words
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-full mx-auto mb-9 leading-relaxed">
              When the message matters, start with the context. Turn raw, difficult thoughts into calibrated, executive-ready communication in seconds
            </p>

            <Link
              href="/app"
              className="btn-tactile btn-tactile-brand animate-shine px-8 py-4 sm:px-10 sm:py-4.5 text-sm sm:text-base font-bold shadow-elevated dark:shadow-elevated-dark inline-flex items-center gap-2.5 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-lavender animate-pulse" />
              <span>Start Calibrating with Conveyra</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand" /> No credit card required
              </span>
              <span className="hidden sm:inline text-border">·</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-electric" /> Instant free calibration
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
