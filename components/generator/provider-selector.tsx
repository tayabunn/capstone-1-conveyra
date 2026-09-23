"use client";

import { Sparkles, Zap, Rocket, Cpu, ShieldCheck, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModelProviderOption } from "@/lib/schemas";

interface ProviderSelectorProps {
  value?: ModelProviderOption;
  onChange: (value: ModelProviderOption) => void;
  disabled?: boolean;
}

const providers: Array<{
  value: ModelProviderOption;
  name: string;
  badge: string;
  badgeVariant: "brand" | "electric" | "lavender" | "secondary";
  icon: React.ElementType;
}> = [
  {
    value: "auto",
    name: "Auto (Failover)",
    badge: "Recommended",
    badgeVariant: "brand",
    icon: ShieldCheck,
  },
  {
    value: "gemini",
    name: "Gemini 2.5",
    badge: "Accurate",
    badgeVariant: "electric",
    icon: Sparkles,
  },
  {
    value: "groq",
    name: "Groq Llama 3.3",
    badge: "⚡ 300 t/s",
    badgeVariant: "electric",
    icon: Zap,
  },
  {
    value: "cerebras",
    name: "Cerebras",
    badge: "🚀 2000 t/s",
    badgeVariant: "lavender",
    icon: Rocket,
  },
  {
    value: "openrouter",
    name: "OpenRouter",
    badge: "Free Tier",
    badgeVariant: "secondary",
    icon: Cpu,
  },
  {
    value: "github",
    name: "GitHub Models",
    badge: "GPT-4o mini",
    badgeVariant: "secondary",
    icon: Terminal,
  },
];


export function ProviderSelector({
  value = "auto",
  onChange,
  disabled = false,
}: ProviderSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select AI provider engine"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
    >
      {providers.map((provider) => {
        const isSelected = value === provider.value;
        const Icon = provider.icon;

        return (
          <button
            key={provider.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(provider.value)}
            className={cn(
              "flex flex-col items-start gap-1 p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "chip-tactile-active text-white"
                : "chip-tactile text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <Icon
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  isSelected ? "text-white" : "text-brand"
                )}
              />
              <span
                className={cn(
                  "text-[9px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded-md",
                  isSelected
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-secondary text-foreground/80 border border-border/50"
                )}
              >
                {provider.badge}
              </span>
            </div>
            <span className={cn("text-xs font-bold leading-tight mt-0.5", isSelected ? "text-white" : "text-foreground")}>
              {provider.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
