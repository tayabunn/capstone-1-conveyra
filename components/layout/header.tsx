import { ConveyraLogo } from "@/components/layout/conveyra-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="w-[90%] max-w-[90%] mx-auto flex h-16 items-center justify-between">
        {/* Brand Left */}
        <div className="flex items-center gap-3.5">
          <ConveyraLogo />
          <span className="hidden sm:inline-flex badge-shiny text-[11px] font-medium tracking-wide py-1 px-3">
            <span className="badge-dot" />
            AI Context Calibrator
          </span>
        </div>

        {/* Navigation Center / Right */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <a
            href="#how-it-works"
            className="hidden md:inline-flex text-xs font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-secondary/70"
          >
            How it works
          </a>
          <a
            href="#use-cases"
            className="hidden md:inline-flex text-xs font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-secondary/70"
          >
            Use cases
          </a>
          
          <div className="h-4 w-[1px] bg-border hidden md:block mx-1" />

          <ThemeToggle />

          {user ? (
            <Link
              href="/app"
              className="btn-tactile btn-tactile-brand animate-shine px-4 py-2 text-xs tracking-tight"
            >
              <Sparkles className="w-3.5 h-3.5 text-lavender" />
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-secondary/70"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="btn-tactile btn-tactile-brand animate-shine px-4 py-2 text-xs tracking-tight"
              >
                <Sparkles className="w-3.5 h-3.5 text-lavender" />
                <span>Start Writing</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
