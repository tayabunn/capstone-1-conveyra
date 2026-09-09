"use client";

import { Mail, MessageSquare, Users, Smartphone, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerateMessageInput } from "@/lib/schemas";

interface ChannelSelectorProps {
  value?: GenerateMessageInput["channel"];
  onChange: (value: GenerateMessageInput["channel"]) => void;
  disabled?: boolean;
}

const channels: Array<{
  value: NonNullable<GenerateMessageInput["channel"]>;
  label: string;
  icon: React.ElementType;
}> = [
  { value: "email", label: "Email", icon: Mail },
  { value: "slack", label: "Slack", icon: MessageSquare },
  { value: "teams", label: "Teams", icon: Users },
  { value: "sms", label: "SMS", icon: Smartphone },
  { value: "whatsapp", label: "WhatsApp", icon: Phone },
  { value: "linkedin", label: "LinkedIn", icon: Globe },
];

export function ChannelSelector({
  value = "email",
  onChange,
  disabled = false,
}: ChannelSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select delivery channel"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
    >
      {channels.map((channel) => {
        const isSelected = value === channel.value;
        const Icon = channel.icon;

        return (
          <button
            key={channel.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(channel.value)}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "bg-foreground text-background border-foreground font-bold shadow-subtle"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-background" : "text-muted-foreground")} />
            <span>{channel.label}</span>
          </button>
        );
      })}
    </div>
  );
}
