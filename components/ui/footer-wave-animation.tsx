"use client";

import { useEffect, useRef } from "react";

export function FooterWaveAnimation() {
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
      hover: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (window.devicePixelRatio || 1);
      mouse.y = (e.clientY - rect.top) * (window.devicePixelRatio || 1);
      mouse.hover = true;
    };

    const handleMouseLeave = () => {
      mouse.hover = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);

    let step = 0;

    const waves = [
      {
        frequency: 0.008,
        amplitude: 28,
        speed: 0.02,
        color: "rgba(139, 92, 246, ", // Brand Violet
        baseAlpha: 0.25,
        offset: 0,
        yRatio: 0.7,
      },
      {
        frequency: 0.012,
        amplitude: 22,
        speed: -0.016,
        color: "rgba(6, 182, 212, ", // Electric Cyan
        baseAlpha: 0.2,
        offset: 2,
        yRatio: 0.65,
      },
      {
        frequency: 0.006,
        amplitude: 35,
        speed: 0.012,
        color: "rgba(196, 181, 253, ", // Lavender
        baseAlpha: 0.15,
        offset: 4,
        yRatio: 0.75,
      },
    ];

    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;

      waves.forEach((wave) => {
        ctx.beginPath();
        const baseAmp = wave.amplitude * dpr * (mouse.hover ? 1.35 : 1);
        const yCenter = height * wave.yRatio;

        ctx.moveTo(0, yCenter);

        for (let x = 0; x <= width; x += 4 * dpr) {
          // Dynamic sine wave formula with frequency modulation
          const angle = x * wave.frequency + step * wave.speed + wave.offset;
          const noise = Math.sin(x * 0.003 + step * 0.01) * 8 * dpr;
          
          let y = yCenter + Math.sin(angle) * baseAmp + noise;

          // Mouse proximity ripple
          if (mouse.hover) {
            const dist = Math.abs(x - mouse.x);
            if (dist < 200 * dpr) {
              const mouseEffect = (1 - dist / (200 * dpr)) * 25 * dpr;
              y += Math.sin(step * 0.08) * mouseEffect;
            }
          }

          ctx.lineTo(x, y);
        }

        // Draw waveform stroke
        const strokeGradient = ctx.createLinearGradient(0, 0, width, 0);
        strokeGradient.addColorStop(0, `${wave.color}0)`);
        strokeGradient.addColorStop(0.3, `${wave.color}${wave.baseAlpha * 1.5})`);
        strokeGradient.addColorStop(0.7, `${wave.color}${wave.baseAlpha * 1.8})`);
        strokeGradient.addColorStop(1, `${wave.color}0)`);

        ctx.strokeStyle = strokeGradient;
        ctx.lineWidth = 2 * dpr;
        ctx.stroke();

        // Subtle gradient fill under wave
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const fillGradient = ctx.createLinearGradient(0, yCenter - baseAmp, 0, height);
        fillGradient.addColorStop(0, `${wave.color}${wave.baseAlpha * 0.3})`);
        fillGradient.addColorStop(1, `${wave.color}0)`);

        ctx.fillStyle = fillGradient;
        ctx.fill();
      });

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
      className="absolute inset-0 w-full h-full pointer-events-auto opacity-70 dark:opacity-80 z-0"
      aria-hidden="true"
    />
  );
}
