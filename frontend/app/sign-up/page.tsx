"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConveyraLogo } from "@/components/layout/conveyra-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Loader2, ArrowRight, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        // Fallback to API route if needed
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const resData = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(signUpError.message || resData.error || "Failed to create account.");
        }
      }

      router.push("/app");
      router.refresh();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to create account.");
      setIsLoading(false);
    }
  };

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
        <div className="w-full max-w-md mx-auto">
          <div className="relative bg-card/95 backdrop-blur-xl border border-border/80 rounded-3xl shadow-elevated dark:shadow-elevated-dark p-6 sm:p-10 overflow-hidden card-glass-glow">
            {/* Brand Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-electric to-brand" />

            <div className="mb-8 text-center space-y-2">
              <div className="inline-block mb-2">
                <span className="font-mono text-[10px] font-bold tracking-widest text-electric uppercase px-3 py-1 rounded-full bg-electric-subtle border border-electric-border">
                  Start Calibrating
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Create your account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Turn your unfiltered thoughts into clear, high-impact messages.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl border border-destructive/20 bg-destructive/[0.05] text-xs text-destructive flex items-center gap-2" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google OAuth Signup Button */}
            <div className="mb-6">
              <GoogleSignInButton label="Sign up with Google" redirectTo="/app" />
            </div>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/80" />
              </div>
              <span className="relative bg-card px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                or sign up with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-bold tracking-tight text-foreground">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Alex Mercer"
                  className="w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground shadow-subtle placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>

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
                  placeholder="alex@company.com"
                  className={cn(
                    "w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground shadow-subtle placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
                    error && "border-destructive focus:ring-destructive"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold tracking-tight text-foreground">
                  Password (min. 6 characters)
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
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

              <div className="space-y-2 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Bounded, context-aware AI calibration</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>Private history & personal communication playbook</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-tactile btn-tactile-brand animate-shine py-3.5 px-6 text-sm font-bold tracking-tight shadow-elevated dark:shadow-elevated-dark disabled:pointer-events-none disabled:opacity-60 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-lavender" />
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/70 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-bold text-foreground hover:text-brand underline underline-offset-4 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
