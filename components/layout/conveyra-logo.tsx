import Link from "next/link";

export function ConveyraLogo() {
  return (
    <Link 
      href="/" 
      className="flex items-center gap-[0.4rem] group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm transition-opacity hover:opacity-80"
    >
      <div className="w-3.5 h-3.5 rounded-sm bg-foreground shadow-sm" />
      <span className="font-extrabold text-xl tracking-tighter text-foreground">
        Conveyra.
      </span>
    </Link>
  );
}
