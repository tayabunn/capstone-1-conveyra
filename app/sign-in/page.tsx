"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ConveyraLogo } from "@/components/layout/conveyra-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";

function SignInFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/app";

  const urlError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(urlError || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback to custom backend API if Supabase cloud has custom auth setup
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const resData = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(authError.message || resData.error || "Invalid email or password.");
        }
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to sign in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-card/95 backdrop-blur-xl border border-border/80 rounded-3xl shadow-elevated dark:shadow-elevated-dark p-6 sm:p-10 overflow-hidden card-glass-glow">
        {/* Brand Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric via-brand to-electric" />

        <div className="mb-8 text-center space-y-2">
          <div className="inline-block mb-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-brand uppercase px-3 py-1 rounded-full bg-brand-subtle border border-brand-border">
              Workspace Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to access your calibrated communication workspace.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl border border-destructive/20 bg-destructive/[0.05] text-xs text-destructive flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="mb-6">
          <GoogleSignInButton label="Continue with Google" redirectTo={redirectPath} />
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/80" />
          </div>
          <span className="relative bg-card px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            or continue with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold tracking-tight text-foreground">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="you@company.com"
              className={cn(
                "w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground shadow-subtle placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
                error && "border-destructive focus:ring-destructive"
              )}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-bold tracking-tight text-foreground">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
              className={cn(
                "w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground shadow-subtle placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
                error && "border-destructive focus:ring-destructive"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-tactile btn-tactile-brand animate-shine py-3.5 px-6 text-sm font-bold tracking-tight shadow-elevated dark:shadow-elevated-dark disabled:pointer-events-none disabled:opacity-60 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-lavender" />
                <span>Signing in...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Conveyra</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/70 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-bold text-foreground hover:text-brand underline underline-offset-4 transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background bg-grid-subtle text-foreground selection:bg-brand selection:text-brand-foreground overflow-x-hidden relative">
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),rgba(139,92,246,0.06)_40%,transparent_75%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),rgba(139,92,246,0.12)_40%,transparent_75%)] -z-10" 
      />

      <header className="w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl h-16 flex items-center justify-between">
          <ConveyraLogo />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<div className="text-xs font-mono text-muted-foreground">Loading...</div>}>
          <SignInFormContent />
        </Suspense>
      </main>
    </div>
  );
}
