"use client";

import React from "react";
import { Lock, Wifi, Battery, Sparkles } from "lucide-react";
import { CardCanvasAnimation } from "./card-canvas-animation";

interface AppleDeviceMockupProps {
  children: React.ReactNode;
}

export function AppleDeviceMockup({ children }: AppleDeviceMockupProps) {
  return (
    <div className="relative w-full max-w-full mx-auto my-4 group">
      {/* 1. Luminous Radial Glow under the device */}
      <div 
        className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-brand/20 via-electric/15 to-purple-600/20 rounded-[2.5rem] blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* 2. Apple iPad / Mac Chassis Outer Shell */}
      <div className="relative rounded-[1.75rem] sm:rounded-[2.25rem] p-2.5 sm:p-4 bg-zinc-900/90 dark:bg-zinc-950/95 border border-zinc-700/60 dark:border-zinc-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(139,92,246,0.12)] transition-all">
        
        {/* 3. Screen Glass Display Container */}
        <div className="relative rounded-2xl sm:rounded-[1.5rem] bg-background/90 dark:bg-zinc-950/85 backdrop-blur-2xl border border-border/80 overflow-hidden shadow-inner flex flex-col">
          
          {/* 4. macOS / iPadOS Unified Titlebar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-secondary/40 dark:bg-zinc-900/50 border-b border-border/60 backdrop-blur-md relative z-20 select-none">
            
            {/* Window Traffic Lights */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-sm inline-block cursor-pointer hover:opacity-80 transition-opacity" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-sm inline-block cursor-pointer hover:opacity-80 transition-opacity" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-sm inline-block cursor-pointer hover:opacity-80 transition-opacity" />
            </div>

            {/* Centered Secure URL / Session Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-background/80 dark:bg-zinc-950/70 border border-border/80 shadow-xs text-xs font-mono text-muted-foreground">
              <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="text-foreground font-semibold">conveyra.app</span>
              <span className="text-border">/</span>
              <span className="text-brand font-medium">calibration-studio</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>

            {/* Right Status Indicators */}
            <div className="flex items-center gap-3 text-muted-foreground text-xs font-mono">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-brand">
                <Sparkles className="w-3 h-3" />
                <span>Live Studio</span>
              </div>
              <Wifi className="w-3.5 h-3.5 text-foreground/70" />
              <Battery className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* 5. Inner Screen with Animated Background & Content */}
          <div className="relative z-10 w-full overflow-hidden">
            
            {/* Interactive Canvas Constellation & Light Beams inside the device */}
            <CardCanvasAnimation />

            {/* Subtle Screen Ambient Lighting */}
            <div 
              className="absolute top-0 right-1/4 w-80 h-80 bg-brand/10 dark:bg-brand/15 rounded-full blur-[90px] pointer-events-none" 
              aria-hidden="true" 
            />
            <div 
              className="absolute bottom-0 left-1/4 w-80 h-80 bg-electric/10 dark:bg-electric/15 rounded-full blur-[90px] pointer-events-none" 
              aria-hidden="true" 
            />

            {/* Subtle diagonal glass gloss shine overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-10" 
              aria-hidden="true" 
            />

            {/* Mockup Screen Children (Generator Form) */}
            <div className="relative z-20">
              {children}
            </div>
          </div>
        </div>

        {/* 6. Realistic Tablet / Mac Bottom Notch Chin */}
        <div className="mt-2.5 sm:mt-3 flex items-center justify-center">
          <div className="w-24 sm:w-32 h-1 rounded-full bg-zinc-700/60 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
