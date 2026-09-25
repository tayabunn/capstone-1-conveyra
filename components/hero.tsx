"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  ArrowDown, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp, 
  SlidersHorizontal,
  Bot,
  AlertOctagon,
  Sparkle
} from "lucide-react";
import Link from "next/link";

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);

  // Target mouse coordinates (-0.5 to 0.5)
  const targetMouseRef = useRef({ x: 0, y: 0 });
  // Interpolated smooth physics state
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  // Target and interpolated glare positions
  const targetLeftGlareRef = useRef({ x: 50, y: 50, opacity: 0.3 });
  const smoothLeftGlareRef = useRef({ x: 50, y: 50, opacity: 0.3 });

  const targetRightGlareRef = useRef({ x: 50, y: 50, opacity: 0.3 });
  const smoothRightGlareRef = useRef({ x: 50, y: 50, opacity: 0.3 });

  // Reactive state for render frame
  const [frame, setFrame] = useState({
    tiltX: 0,
    tiltY: 0,
    float1X: 0,
    float1Y: 0,
    float1Rot: 0,
    float2X: 0,
    float2Y: 0,
    float2Rot: 0,
    leftGlare: { x: 50, y: 50, opacity: 0.3 },
    rightGlare: { x: 50, y: 50, opacity: 0.3 },
  });

  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseRef.current = { x, y };

      // Left card relative glare
      if (leftCardRef.current) {
        const cRect = leftCardRef.current.getBoundingClientRect();
        const gx = ((e.clientX - cRect.left) / cRect.width) * 100;
        const gy = ((e.clientY - cRect.top) / cRect.height) * 100;
        const isHover = e.clientX >= cRect.left && e.clientX <= cRect.right &&
                        e.clientY >= cRect.top && e.clientY <= cRect.bottom;
        targetLeftGlareRef.current = {
          x: Math.max(0, Math.min(100, gx)),
          y: Math.max(0, Math.min(100, gy)),
          opacity: isHover ? 0.9 : 0.4,
        };
      }

      // Right card relative glare
      if (rightCardRef.current) {
        const cRect = rightCardRef.current.getBoundingClientRect();
        const gx = ((e.clientX - cRect.left) / cRect.width) * 100;
        const gy = ((e.clientY - cRect.top) / cRect.height) * 100;
        const isHover = e.clientX >= cRect.left && e.clientX <= cRect.right &&
                        e.clientY >= cRect.top && e.clientY <= cRect.bottom;
        targetRightGlareRef.current = {
          x: Math.max(0, Math.min(100, gx)),
          y: Math.max(0, Math.min(100, gy)),
          opacity: isHover ? 0.9 : 0.4,
        };
      }
    };

    const handleMouseLeave = () => {
      targetMouseRef.current = { x: 0, y: 0 };
      targetLeftGlareRef.current = { x: 50, y: 50, opacity: 0.25 };
      targetRightGlareRef.current = { x: 50, y: 50, opacity: 0.25 };
    };

    const target = containerRef.current;
    if (target) {
      target.addEventListener("mousemove", handleMouseMove);
      target.addEventListener("mouseleave", handleMouseLeave);
    }

    // 60-120fps Smooth Physics & Harmonic Floating Loop
    const renderLoop = (now: number) => {
      const elapsed = now - startTime;

      // Smooth LERP (Linear Interpolation) with damping factor
      const lerpFactor = 0.07;
      smoothMouseRef.current.x += (targetMouseRef.current.x - smoothMouseRef.current.x) * lerpFactor;
      smoothMouseRef.current.y += (targetMouseRef.current.y - smoothMouseRef.current.y) * lerpFactor;

      // Glare LERP
      const glareLerp = 0.08;
      smoothLeftGlareRef.current.x += (targetLeftGlareRef.current.x - smoothLeftGlareRef.current.x) * glareLerp;
      smoothLeftGlareRef.current.y += (targetLeftGlareRef.current.y - smoothLeftGlareRef.current.y) * glareLerp;
      smoothLeftGlareRef.current.opacity += (targetLeftGlareRef.current.opacity - smoothLeftGlareRef.current.opacity) * glareLerp;

      smoothRightGlareRef.current.x += (targetRightGlareRef.current.x - smoothRightGlareRef.current.x) * glareLerp;
      smoothRightGlareRef.current.y += (targetRightGlareRef.current.y - smoothRightGlareRef.current.y) * glareLerp;
      smoothRightGlareRef.current.opacity += (targetRightGlareRef.current.opacity - smoothRightGlareRef.current.opacity) * glareLerp;

      // Organic weightless floating oscillations
      const timeS = elapsed * 0.001;
      const wave1Y = Math.sin(timeS * 1.4) * 9;
      const wave1X = Math.cos(timeS * 1.1) * 4;
      const wave1Rot = Math.sin(timeS * 1.2) * 1.8;

      const wave2Y = Math.cos(timeS * 1.3) * 10;
      const wave2X = Math.sin(timeS * 0.9) * 4.5;
      const wave2Rot = Math.cos(timeS * 1.1) * -1.8;

      const smX = smoothMouseRef.current.x;
      const smY = smoothMouseRef.current.y;

      setFrame({
        tiltX: smY * -16,
        tiltY: smX * 16,
        float1X: smX * -22 + wave1X,
        float1Y: smY * -22 + wave1Y,
        float1Rot: -3 + wave1Rot,
        float2X: smX * 26 + wave2X,
        float2Y: smY * 26 + wave2Y,
        float2Rot: 3 + wave2Rot,
        leftGlare: {
          x: smoothLeftGlareRef.current.x + Math.sin(timeS * 0.8) * 5,
          y: smoothLeftGlareRef.current.y + Math.cos(timeS * 0.8) * 5,
          opacity: smoothLeftGlareRef.current.opacity,
        },
        rightGlare: {
          x: smoothRightGlareRef.current.x + Math.cos(timeS * 0.8) * 5,
          y: smoothRightGlareRef.current.y + Math.sin(timeS * 0.8) * 5,
          opacity: smoothRightGlareRef.current.opacity,
        },
      });

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      if (target) {
        target.removeEventListener("mousemove", handleMouseMove);
        target.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden pt-8 sm:pt-14 pb-16 md:pb-24 select-none"
      style={{ perspective: "1400px" }}
    >
      {/* 1. Atmospheric Ambient Backdrops & 3D Glowing Energy Orb */}
      <div 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] sm:h-[550px] bg-gradient-to-tr from-brand/15 via-electric/15 to-purple-600/10 dark:from-brand/25 dark:via-electric/20 dark:to-purple-500/15 rounded-full blur-[110px] -z-10 will-change-transform"
        style={{
          transform: `translate(-50%, -50%) translate3d(${smoothMouseRef.current.x * 35}px, ${smoothMouseRef.current.y * 35}px, 0)`,
        }}
        aria-hidden="true" 
      />

      {/* 2. Interactive Flowing SVG Connection Lines */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block -z-10" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hero-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="hero-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.75" />
            </linearGradient>
            
            <filter id="glow-hero" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Flowing animated stream paths */}
          <path 
            d="M 120 280 C 260 280, 320 220, 480 200" 
            fill="none" 
            stroke="url(#hero-grad-left)" 
            strokeWidth="1.5" 
            strokeDasharray="6 6"
            className="opacity-70 dark:opacity-85"
            style={{
              animation: "flow-dash 25s linear infinite"
            }}
          />
          <path 
            d="M 160 460 C 300 460, 360 340, 500 280" 
            fill="none" 
            stroke="url(#hero-grad-left)" 
            strokeWidth="1.5" 
            strokeDasharray="8 8"
            className="opacity-45 dark:opacity-65"
            style={{
              animation: "flow-dash-reverse 30s linear infinite"
            }}
          />

          <path 
            d="M 780 200 C 920 220, 1000 290, 1140 290" 
            fill="none" 
            stroke="url(#hero-grad-right)" 
            strokeWidth="1.5" 
            strokeDasharray="6 6"
            className="opacity-70 dark:opacity-85"
            style={{
              animation: "flow-dash 25s linear infinite"
            }}
          />
          <path 
            d="M 760 280 C 900 340, 960 470, 1100 470" 
            fill="none" 
            stroke="url(#hero-grad-right)" 
            strokeWidth="1.5" 
            strokeDasharray="8 8"
            className="opacity-45 dark:opacity-65"
            style={{
              animation: "flow-dash-reverse 30s linear infinite"
            }}
          />

          {/* Pulsing signal nodes */}
          <circle cx="280" cy="255" r="3.5" fill="#ef4444" filter="url(#glow-hero)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          <circle cx="980" cy="245" r="4" fill="#10b981" filter="url(#glow-hero)" className="animate-ping" style={{ animationDuration: '2.2s' }} />
        </svg>
      </div>

      <style jsx>{`
        @keyframes flow-dash {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes flow-dash-reverse {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 200; }
        }
      `}</style>

      <div className="w-[90%] max-w-[90%] mx-auto relative">
        
        {/* =========================================================================
            3D PREMIUM FLOATING CARDS WITH FLUID LERP GLARE & OSCILLATION
            ========================================================================= */}
        
        {/* LEFT FLOATING 3D CARD: Raw & Risky Draft Detection */}
        <div 
          ref={leftCardRef}
          className="hidden 2xl:block absolute -left-6 top-14 w-80 rounded-2xl p-5 text-left pointer-events-none z-20 group will-change-transform"
          style={{
            transform: `translate3d(${frame.float1X}px, ${frame.float1Y}px, 40px) rotateX(${frame.tiltX * 0.8 + 5}deg) rotateY(${frame.tiltY * 0.8 - 7}deg) rotate(${frame.float1Rot}deg)`,
            transformStyle: "preserve-3d",
            background: "linear-gradient(145deg, rgba(23, 15, 25, 0.88) 0%, rgba(13, 17, 26, 0.94) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(239, 68, 68, 0.32)",
            boxShadow: `
              0 24px 48px -15px rgba(0, 0, 0, 0.65),
              0 0 35px -5px rgba(239, 68, 68, 0.18),
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.25),
              inset 0 -1px 1px 0 rgba(0, 0, 0, 0.6)
            `
          }}
        >
          {/* Dynamic Specular Glare Overlay Layer */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none will-change-transform"
            style={{
              opacity: frame.leftGlare.opacity,
              background: `radial-gradient(420px circle at ${frame.leftGlare.x}% ${frame.leftGlare.y}%, rgba(255, 255, 255, 0.18) 0%, rgba(244, 63, 94, 0.08) 40%, transparent 70%)`,
            }}
          />

          {/* Metallic Top Bezel Highlight */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wide text-rose-400 uppercase">
                Raw Input Alert
              </span>
            </div>
            <div className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1 shadow-sm">
              <AlertOctagon className="w-2.5 h-2.5" /> 88% Risk
            </div>
          </div>

          {/* Raw Message Card / Recessed Well */}
          <div className="relative z-10 p-3 rounded-xl bg-black/45 border border-white/[0.06] mb-3.5 shadow-inner">
            <div className="text-[10px] font-mono text-muted-foreground/70 mb-1 flex items-center justify-between">
              <span>UNFILTERED THOUGHT:</span>
              <span className="text-rose-400/80">REACTIVE</span>
            </div>
            <p className="text-[11.5px] text-zinc-300 font-mono leading-relaxed">
              &ldquo;Why wasn&apos;t this communicated earlier? Someone needs to fix this mess immediately.&rdquo;
            </p>
          </div>

          {/* Risk Breakdown Progress Bar */}
          <div className="relative z-10 space-y-1.5 text-[10px] font-mono">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>Defensiveness Risk:</span>
              </span>
              <span className="text-rose-400 font-bold">Critical (88%)</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden p-[1px] border border-white/[0.06]">
              <div 
                className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" 
                style={{ width: "88%" }} 
              />
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="relative z-10 mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-brand" />
              <span>Slack #exec-channel</span>
            </span>
            <span className="text-rose-400/90 font-semibold">Needs Calibration</span>
          </div>
        </div>

        {/* LEFT FLOATING CHIP: Tone Engine Indicator */}
        <div 
          className="hidden xl:block absolute -left-2 bottom-6 p-2.5 px-3.5 rounded-xl backdrop-blur-xl border border-brand/35 text-xs font-mono text-foreground pointer-events-none z-20 will-change-transform"
          style={{
            transform: `translate3d(${frame.float1X * 0.7}px, ${frame.float1Y * 0.7}px, 25px) rotateX(${frame.tiltX * 0.5}deg) rotateY(${frame.tiltY * 0.5}deg) rotate(${frame.float1Rot * 0.6}deg)`,
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(13, 17, 26, 0.9) 100%)",
            boxShadow: "0 12px 28px -5px rgba(0,0,0,0.5), inset 0 1px 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
            <span className="font-semibold text-brand">Tone Engine:</span>
            <span className="text-muted-foreground">Calibrated Diplomacy</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
          </div>
        </div>

        {/* RIGHT FLOATING 3D CARD: Calibrated Executive Output */}
        <div 
          ref={rightCardRef}
          className="hidden 2xl:block absolute -right-6 top-10 w-84 rounded-2xl p-5 text-left pointer-events-none z-20 group will-change-transform"
          style={{
            transform: `translate3d(${frame.float2X}px, ${frame.float2Y}px, 50px) rotateX(${frame.tiltX * 0.8 - 4}deg) rotateY(${frame.tiltY * 0.8 + 7}deg) rotate(${frame.float2Rot}deg)`,
            transformStyle: "preserve-3d",
            background: "linear-gradient(145deg, rgba(10, 25, 24, 0.88) 0%, rgba(13, 17, 26, 0.94) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            boxShadow: `
              0 24px 50px -15px rgba(0, 0, 0, 0.65),
              0 0 38px -5px rgba(16, 185, 129, 0.2),
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.28),
              inset 0 -1px 1px 0 rgba(0, 0, 0, 0.6)
            `
          }}
        >
          {/* Dynamic Specular Glare Overlay Layer */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none will-change-transform"
            style={{
              opacity: frame.rightGlare.opacity,
              background: `radial-gradient(420px circle at ${frame.rightGlare.x}% ${frame.rightGlare.y}%, rgba(255, 255, 255, 0.2) 0%, rgba(16, 185, 129, 0.09) 40%, transparent 70%)`,
            }}
          />

          {/* Metallic Top Bezel Highlight */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wide text-emerald-400 uppercase flex items-center gap-1">
                Conveyra Calibrated
              </span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
              <Sparkle className="w-2.5 h-2.5 text-emerald-300" /> 100% Aligned
            </div>
          </div>

          {/* Calibrated Message Preview */}
          <div className="relative z-10 p-3 rounded-xl bg-black/45 border border-emerald-500/20 mb-3.5 shadow-inner">
            <div className="text-[10px] font-mono text-emerald-400/80 mb-1 flex items-center justify-between">
              <span>EXECUTIVE-READY:</span>
              <span className="text-emerald-300 font-semibold">DIPLOMATIC</span>
            </div>
            <p className="text-[12px] text-zinc-100 font-sans leading-relaxed">
              &ldquo;To ensure we stay aligned on the timeline, let&apos;s review the blockers together and prioritize the critical items for this sprint.&rdquo;
            </p>
          </div>

          {/* Stakeholder Approval Card */}
          <div className="relative z-10 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shadow-md ring-1 ring-white/20">
                SJ
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />
              </div>
              <div className="text-[10.5px] leading-tight">
                <p className="font-semibold text-zinc-200">Sarah Jenkins <span className="text-[9px] font-normal text-zinc-400">(VP Product)</span></p>
                <p className="text-emerald-400 font-mono text-[10px]">Approved &amp; Aligned 👍</p>
              </div>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">Just now</span>
          </div>

          {/* Outcome Gauge */}
          <div className="relative z-10 mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trust Impact: +42%</span>
            </span>
            <span className="text-emerald-300 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Stress: 0%
            </span>
          </div>
        </div>

        {/* RIGHT FLOATING CHIP: Live Clarity Score */}
        <div 
          className="hidden xl:block absolute -right-2 bottom-8 p-2.5 px-3.5 rounded-xl backdrop-blur-xl border border-emerald-500/35 text-xs font-mono text-foreground pointer-events-none z-20 will-change-transform"
          style={{
            transform: `translate3d(${frame.float2X * 0.7}px, ${frame.float2Y * 0.7}px, 30px) rotateX(${frame.tiltX * 0.5}deg) rotateY(${frame.tiltY * 0.5}deg) rotate(${frame.float2Rot * 0.6}deg)`,
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(13, 17, 26, 0.9) 100%)",
            boxShadow: "0 12px 28px -5px rgba(0,0,0,0.5), inset 0 1px 1px 0 rgba(255,255,255,0.22)",
          }}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-foreground">Executive Clarity:</span>
            <span className="text-emerald-400 font-bold">100% Preserved</span>
          </div>
        </div>

        {/* =========================================================================
            CENTER HERO CONTENT & EDITORIAL HEADLINE
            ========================================================================= */}
        <div 
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center will-change-transform"
          style={{
            transform: `rotateX(${frame.tiltX * 0.3}deg) rotateY(${frame.tiltY * 0.3}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Eyebrow badge with glowing pulse dot */}
          <div className="badge-shiny mb-6 backdrop-blur-md">
            <span className="badge-dot" />
            <span className="font-mono text-[11px] tracking-wider uppercase">
              AI Context Engine v2.0 • Persona &amp; Risk Radar
            </span>
          </div>
          
          {/* Editorial Headline with 3D Pop & selective shiny gradient */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.04em] text-foreground leading-[1.06] mb-6 text-balance max-w-4xl mx-auto">
            Write with clarity<br className="hidden sm:inline" />
            <span className="block sm:inline sm:ml-3 text-muted-foreground font-medium">
              Without the{" "}
              <span className="text-gradient-shiny font-extrabold drop-shadow-sm">overthinking</span>
            </span>
          </h1>
          
          {/* Supporting Copy */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed font-normal mb-9">
            Conveyra turns your rough thoughts into clear, calibrated messages — shaped around who you&apos;re talking to, your channel, what you mean, and how you want to sound
          </p>

          {/* Action CTAs (Unchanged Button Design) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
            <Link
              href="/app"
              className="btn-tactile btn-tactile-brand animate-shine px-8 py-4 text-sm sm:text-base font-bold shadow-elevated dark:shadow-elevated-dark"
            >
              <Sparkles className="w-4 h-4 text-lavender" />
              <span>Start Calibrating Free</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <a
              href="#demo"
              className="btn-tactile btn-tactile-secondary px-6 py-4 text-sm font-semibold tracking-tight text-foreground shadow-subtle"
            >
              <span>Try Interactive Demo</span>
              <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </div>

          {/* Micro Trust & Calibration Badges */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand" /> Zero tone anxiety
            </span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-electric" /> Tailored for Slack, Email &amp; Exec
            </span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Privacy Protected
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
