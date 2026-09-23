import { ConveyraLogo } from "./conveyra-logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-background/90 backdrop-blur-md">
      <div className="w-[90%] max-w-[90%] mx-auto py-12 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <ConveyraLogo />
          <p className="text-xs text-muted-foreground mt-1">
            Communication copilot for calibrated, high-stakes conversations.
          </p>
        </div>

        <div className="flex items-center gap-5 text-xs text-muted-foreground font-mono">
          <a href="#generator" className="hover:text-foreground transition-colors">
            Workspace
          </a>
          <span>·</span>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            Method
          </a>
          <span>·</span>
          <a href="#use-cases" className="hover:text-foreground transition-colors">
            Use Cases
          </a>
          <span>·</span>
          <span>&copy; {new Date().getFullYear()} Conveyra</span>
        </div>
      </div>
    </footer>
  );
}
