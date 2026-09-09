"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ConveyraLogo } from "@/components/layout/conveyra-logo";
import {
  Sparkles,
  History,
  Bookmark,
  Settings,
  Plus,
  Compass,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  className?: string;
  onNavigate?: () => void;
}

const navItems = [
  {
    label: "New Message",
    href: "/app",
    icon: Sparkles,
  },
  {
    label: "History",
    href: "/app/history",
    icon: History,
  },
  {
    label: "Favorites",
    href: "/app/favorites",
    icon: Bookmark,
  },
  {
    label: "Settings",
    href: "/app/settings",
    icon: Settings,
  },
];

export function AppSidebar({ user, className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch {
      router.push("/sign-in");
    }
  };

  return (
    <aside
      className={cn(
        "w-64 flex flex-col h-full bg-card/90 backdrop-blur-md border-r border-border/80 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-border/80">
        <ConveyraLogo />
      </div>

      {/* Primary Dominant Action CTA: + New Message */}
      <div className="p-4 border-b border-border/60">
        <Link
          href="/app"
          onClick={onNavigate}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 text-xs font-bold tracking-tight shadow-card dark:shadow-card-dark transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ New Message</span>
        </Link>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Workspace
          </span>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-secondary text-foreground font-bold shadow-subtle border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Subtle Bottom Context Insight Card */}
      <div className="p-3 m-3 rounded-xl border border-border/80 bg-background/50 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-brand font-mono text-[10px] font-bold uppercase">
          <Compass className="w-3 h-3" />
          <span>Calibrated Context</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          AI heuristics bound your tone and protect professional boundaries.
        </p>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-border/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-brand-subtle text-brand border border-brand-border flex items-center justify-center text-xs font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "C"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate">
              {user?.name || "Conveyra User"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate font-mono">
              {user?.email || "user@conveyra.com"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="p-1.5 rounded-lg border border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
