import Link from "next/link";

export function ConveyraLogo() {
  return (
    <Link 
      href="/" 
      className="inline-flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md transition-opacity hover:opacity-90"
      aria-label="Conveyra Homepage"
    >
      <div 
        className="w-5 h-5 rounded-[5px] bg-foreground text-background flex items-center justify-center font-mono text-[11px] font-black tracking-tight select-none shadow-subtle group-hover:bg-brand transition-colors"
        aria-hidden="true"
      >
        C
      </div>
      <span className="font-bold text-lg tracking-tight text-foreground">
        Conveyra<span className="text-brand font-black">.</span>
      </span>
    </Link>
  );
}
