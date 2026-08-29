export function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border/40">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-extrabold tracking-tighter text-foreground text-lg">Conveyra.</span>
          <p className="text-sm text-muted-foreground">
            Precision communication for modern professionals.
          </p>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} Conveyra. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
