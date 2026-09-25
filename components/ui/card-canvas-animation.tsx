"use client";

import { useEffect, useRef } from "react";

interface CardCanvasAnimationProps {
  className?: string;
  opacityClassName?: string;
}

export function CardCanvasAnimation({
  className,
  opacityClassName = "opacity-20 dark:opacity-25",
}: CardCanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120 * (window.devicePixelRatio || 1),
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (window.devicePixelRatio || 1);
      mouse.y = (e.clientY - rect.top) * (window.devicePixelRatio || 1);
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
      mouse.radius = 120 * dpr;
      initParticles();
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
      color: string;
      pulseSpeed: number;
      pulseOffset: number;
    }

    interface LightBeam {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      color: string;
    }

    let particles: Particle[] = [];
    let lightBeams: LightBeam[] = [];

    const colors = [
      "rgba(139, 92, 246, ",  // Brand violet
      "rgba(196, 181, 253, ", // Lavender
      "rgba(6, 182, 212, ",   // Electric cyan
      "rgba(168, 85, 247, ",  // Purple
    ];

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((width * height) / 12000);
      const dpr = window.devicePixelRatio || 1;

      for (let i = 0; i < particleCount; i++) {
        const colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35 * dpr,
          vy: (Math.random() - 0.5) * 0.35 * dpr,
          size: (Math.random() * 1.5 + 0.6) * dpr,
          baseAlpha: Math.random() * 0.25 + 0.1,
          color: colorPrefix,
          pulseSpeed: Math.random() * 0.015 + 0.008,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }

      lightBeams = [];
      for (let i = 0; i < 3; i++) {
        lightBeams.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: (Math.random() * 100 + 60) * dpr,
          speed: (Math.random() * 0.9 + 0.4) * dpr,
          angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.2 + 0.05,
          color: colors[i % colors.length],
        });
      }
    };

    initParticles();

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update light beams
      lightBeams.forEach((beam) => {
        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;

        if (beam.x > width + beam.length || beam.y > height + beam.length) {
          beam.x = Math.random() * width * 0.5 - 100;
          beam.y = -50;
        }

        const gradient = ctx.createLinearGradient(
          beam.x,
          beam.y,
          beam.x - Math.cos(beam.angle) * beam.length,
          beam.y - Math.sin(beam.angle) * beam.length
        );
        gradient.addColorStop(0, `${beam.color}${beam.alpha})`);
        gradient.addColorStop(1, `${beam.color}0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2 * (window.devicePixelRatio || 1);
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(
          beam.x - Math.cos(beam.angle) * beam.length,
          beam.y - Math.sin(beam.angle) * beam.length
        );
        ctx.stroke();
      });

      // 2. Update and draw particles & connections
      const maxDistance = 95 * (window.devicePixelRatio || 1);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce from boundaries
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse interaction
        const dxMouse = p1.x - mouse.x;
        const dyMouse = p1.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        let mouseInfluence = 0;

        if (distMouse < mouse.radius) {
          mouseInfluence = 1 - distMouse / mouse.radius;
          p1.x += (dxMouse / distMouse) * mouseInfluence * 1.2;
          p1.y += (dyMouse / distMouse) * mouseInfluence * 1.2;
        }

        // Draw particle node
        const currentAlpha = Math.min(
          0.6,
          p1.baseAlpha + Math.sin(tick * p1.pulseSpeed + p1.pulseOffset) * 0.1 + mouseInfluence * 0.35
        );

        ctx.fillStyle = `${p1.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size * (1 + mouseInfluence * 0.6), 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.1 * (1 + mouseInfluence * 0.8);
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
            ctx.lineWidth = 0.6 * (window.devicePixelRatio || 1);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${opacityClassName} z-0 ${className || ""}`}
      aria-hidden="true"
    />
  );
}
