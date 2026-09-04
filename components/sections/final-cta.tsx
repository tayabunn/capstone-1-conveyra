import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Find the right words.
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          When the message matters, start with the context.
        </p>
        <a
          href="#generator"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-8 py-3.5 text-sm sm:text-base font-bold shadow-card dark:shadow-card-dark transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span>Generate a Message</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </a>
      </div>
    </section>
  );
}
