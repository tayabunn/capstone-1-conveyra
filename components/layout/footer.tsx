import { ConveyraLogo } from "./conveyra-logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1.5">
          <ConveyraLogo />
          <p className="text-xs text-muted-foreground">
            Precision AI communication assistant for delicate conversations.
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono">
          <span>&copy; {new Date().getFullYear()} Conveyra</span>
          <span>·</span>
          <span>copyright reserved by Conveyra</span>
        </div>
      </div>
    </footer>
  );
}
