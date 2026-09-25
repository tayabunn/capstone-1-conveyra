"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConveyraLogo } from "@/components/layout/conveyra-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Loader2, ArrowRight, AlertCircle, Check, Mail, KeyRound, ArrowLeft, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If user is already active/confirmed without email confirmation
      if (data?.session) {
        router.push("/app");
        router.refresh();
        return;
      }

      // Otherwise, email confirmation code is sent -> show OTP verification screen
      setStep("verify");
      setSuccessMessage(`We sent a 6-digit verification code to ${email.trim()}.`);
      startCooldown();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError("Please enter the complete 6-digit code sent to your email.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Try verifying signup OTP
      let { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: "signup",
      });

      // Fallback to type 'email' if signup type is not accepted
      if (verifyError) {
        const emailVerify = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: otpCode.trim(),
          type: "email",
        });
        data = emailVerify.data;
        verifyError = emailVerify.error;
      }

      if (verifyError) {
        throw new Error(verifyError.message || "Invalid or expired verification code.");
      }

      if (data?.session) {
        router.push("/app");
        router.refresh();
      } else {
        router.push("/app");
        router.refresh();
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Invalid verification code. Please check your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      });

      if (resendError) {
        throw resendError;
      }

      setSuccessMessage(`A new verification code was sent to ${email.trim()}.`);
      startCooldown();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Could not resend code. Please try again in a few moments.");
    } finally {
      setIsLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background bg-grid-subtle text-foreground selection:bg-brand selection:text-brand-foreground overflow-x-hidden relative">
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),rgba(139,92,246,0.06)_40%,transparent_75%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),rgba(139,92,246,0.12)_40%,transparent_75%)] -z-10" 
      />

      <header className="w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="w-[90%] max-w-[90%] mx-auto h-16 flex items-center justify-between">
          <ConveyraLogo />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <div className="relative bg-card/95 backdrop-blur-xl border border-border/80 rounded-lg p-6 sm:p-10 overflow-hidden card-glass-glow">
            {step === "verify" ? (
              /* OTP Verification Step */
              <div>
                <div className="mb-6 text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 text-brand mb-2">
                    <Mail className="w-6 h-6 animate-pulse" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Check your email
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We sent a 6-digit confirmation code to{" "}
                    <span className="font-semibold text-foreground break-all">{email}</span>
                  </p>
                </div>

                {successMessage && !error && (
                  <div className="mb-6 p-3.5 rounded-2xl border border-brand/20 bg-brand/[0.06] text-xs text-brand flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 rounded-2xl border border-destructive/20 bg-destructive/[0.05] text-xs text-destructive flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                  <div className="space-y-2">
                    <label htmlFor="otpCode" className="block text-xs font-bold tracking-tight text-foreground text-center">
                      Enter 6-Digit Code
                    </label>
                    <div className="relative">
                      <input
                        id="otpCode"
                        name="otpCode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        autoFocus
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                        disabled={isLoading}
                        placeholder="••••••"
                        className="w-full rounded-2xl border border-input bg-background/80 px-4 py-3.5 text-center text-2xl font-mono tracking-[0.4em] font-bold text-foreground shadow-subtle placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Please check your inbox or spam folder for the code.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full btn-tactile btn-tactile-brand animate-shine py-3.5 px-6 text-sm font-bold tracking-tight shadow-elevated dark:shadow-elevated-dark disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-lavender" />
                        <span>Verifying code...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        <span>Verify & Enter Dashboard</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-border/70 flex flex-col items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isLoading}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline disabled:opacity-50 disabled:hover:no-underline cursor-pointer"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
                    <span>
                      {resendCooldown > 0
                        ? `Resend code in ${resendCooldown}s`
                        : "Didn't get a code? Resend"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Use a different email</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Signup Form */
              <div>
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
                      <span className="flex items-center justify-center gap-2">
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
