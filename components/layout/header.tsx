import { ConveyraLogo } from "@/components/layout/conveyra-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ArrowRight } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between max-w-6xl">
        {/* Brand Left */}
        <div className="flex items-center gap-3.5">
          <ConveyraLogo />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-secondary text-muted-foreground border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
            AI Communication Assistant
          </span>
        </div>

        {/* Navigation Center / Right */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <a
            href="#how-it-works"
            className="hidden md:inline-flex text-xs font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary/70"
          >
            How it works
          </a>
          <a
            href="#use-cases"
            className="hidden md:inline-flex text-xs font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary/70"
          >
            Use cases
          </a>
          
          <div className="h-4 w-[1px] bg-border hidden md:block mx-1" />

          <ThemeToggle />

          <a
            href="#generator"
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-xs font-bold tracking-tight shadow-subtle transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>Generate</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </a>
        </nav>
      </div>
    </header>
  );
}
