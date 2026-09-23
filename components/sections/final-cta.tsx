import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 border-t border-border/80 bg-background relative overflow-hidden">
      <div className="w-[90%] max-w-[90%] mx-auto text-center">
        <div className="relative rounded-3xl p-10 sm:p-14 overflow-hidden card-luminous-tactile bg-radial-ambient">
          <div className="badge-shiny mb-6">
            <span className="badge-dot" />
            Instant Calibration
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Find the right words.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            When the message matters, start with the context. Turn difficult thoughts into calibrated communication.
          </p>
          <Link
            href="/app"
            className="btn-tactile btn-tactile-brand animate-shine px-8 py-4 text-sm sm:text-base font-bold shadow-elevated dark:shadow-elevated-dark inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-lavender" />
            <span>Start Calibrating with Conveyra</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
