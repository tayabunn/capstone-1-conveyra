import Link from "next/link";
import { ConveyraLogo } from "./conveyra-logo";
import { FooterWaveAnimation } from "@/components/ui/footer-wave-animation";
import { Sparkles, ShieldCheck, ArrowUpRight, Cpu, Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-background py-16 sm:py-20 relative overflow-hidden">
      {/* 1. Interactive 60fps Frequency Communication Wave Animation */}
      <FooterWaveAnimation />

      {/* 2. Ambient Gradient Glows */}
      <div 
        className="absolute -top-24 right-1/4 w-[450px] h-[250px] bg-brand/15 dark:bg-brand/25 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-20 left-10 w-[380px] h-[220px] bg-electric/15 dark:bg-electric/20 rounded-full blur-[90px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-[90%] max-w-[90%] mx-auto relative z-10">
        {/* 3. Main Multi-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-border/70">
            
            {/* Column 1: Brand & Copilot Mission (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <ConveyraLogo />
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                Next-generation communication copilot engineered to turn unfiltered, high-stakes thoughts into calibrated, executive-ready messages.
              </p>

              {/* Status Pill */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-[11px] font-mono text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-foreground font-semibold">Engine Status:</span>
                  <span className="text-emerald-500 font-bold">100% Operational</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-subtle border border-brand-border text-[11px] font-mono text-brand">
                  <Cpu className="w-3 h-3" />
                  <span>Multi-Model Failover</span>
                </div>
              </div>
            </div>

            {/* Column 2: Product & Capabilities (3 cols) */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>Capabilities</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
                <li>
                  <a href="#generator" className="hover:text-foreground transition-colors flex items-center justify-between group">
                    <span>Workspace</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground transition-colors flex items-center justify-between group">
                    <span>Method</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-foreground transition-colors flex items-center justify-between group">
                    <span>Use Cases</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                  </a>
                </li>
                <li>
                  <Link href="/app/personas" className="hover:text-foreground transition-colors flex items-center justify-between group">
                    <span>Persona Manager</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                      New
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Communication Dynamics (3 cols) */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-electric" />
                <span>Context Dynamics</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
                <li>
                  <a href="#use-cases" className="hover:text-foreground transition-colors">
                    Client Diplomacy & Scope
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-foreground transition-colors">
                    Executive Upward Updates
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-foreground transition-colors">
                    Constructive Peer Feedback
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-foreground transition-colors">
                    Delicate Boundary Setting
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Launch Callout (2 cols) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Security</span>
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero permanent draft storage. Enterprise TLS 1.3 encryption with client-side state calibration.
              </p>
              <Link
                href="/app"
                className="btn-tactile btn-tactile-brand w-full py-2.5 px-3 text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 rounded-lg"
              >
                <span>Launch App</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4. Bottom Row: Copyright, Socials, Legal */}
          <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>&copy; {new Date().getFullYear()} Conveyra Inc.</span>
              <span className="text-border">·</span>
              <span className="text-[11px]">Calibrated with precision</span>
            </div>

            {/* Social Icons & Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter Community"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.39 9.74v-8.37H5.07v8.37z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
