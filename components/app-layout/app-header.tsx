"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Menu, X, LogOut } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/sign-in");
      router.refresh();
    } catch {
      router.push("/sign-in");
    }
  };

  return (
    <>
      <header className="h-16 border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="w-[90%] max-w-[90%] mx-auto flex items-center justify-between h-full">
          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-foreground">Conveyra</span>
          </div>

          {/* Desktop left status */}
          <div className="hidden md:flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground px-2.5 py-1 rounded-md bg-secondary border border-border">
              Workspace
            </span>
            <span className="text-xs text-muted-foreground">
              Calibrated Communication Engine
            </span>
          </div>

          {/* Right header actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex-1 max-w-xs w-full bg-card shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-xl border border-border bg-background text-foreground hover:bg-muted"
                aria-label="Close navigation menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <AppSidebar
              user={user}
              className="w-full border-r-0"
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
