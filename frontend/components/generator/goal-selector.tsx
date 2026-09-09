"use client";

import { cn } from "@/lib/utils";
import type { GenerateMessageInput } from "@/lib/schemas";
import {
  Target,
  ShieldAlert,
  HelpCircle,
  XCircle,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
} from "lucide-react";

interface GoalSelectorProps {
  value?: GenerateMessageInput["goal"];
  onChange: (value: GenerateMessageInput["goal"]) => void;
  disabled?: boolean;
}

const goals: Array<{
  value: NonNullable<GenerateMessageInput["goal"]>;
  label: string;
  icon: React.ElementType;
}> = [
  { value: "request_action", label: "Request Action", icon: Target },
  { value: "make_request", label: "Make a Request", icon: Target },
  { value: "seek_alignment", label: "Seek Alignment", icon: CheckCircle2 },
  { value: "set_boundary", label: "Set Boundary", icon: ShieldAlert },
  { value: "de_escalate", label: "De-escalate", icon: AlertTriangle },
  { value: "give_feedback", label: "Give Feedback", icon: MessageCircle },
  { value: "ask_clarification", label: "Ask Clarification", icon: HelpCircle },
  { value: "decline_politely", label: "Decline Politely", icon: XCircle },
  { value: "follow_up", label: "Follow Up", icon: RotateCw },
];

export function GoalSelector({
  value = "request_action",
  onChange,
  disabled = false,
}: GoalSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select communication goal"
      className="grid grid-cols-2 sm:grid-cols-4 gap-2"
    >
      {goals.map((goal) => {
        const isSelected = value === goal.value;
        const Icon = goal.icon;

        return (
          <button
            key={goal.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(goal.value)}
            className={cn(
              "flex items-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "bg-brand-subtle text-brand border-brand-border font-bold shadow-subtle dark:bg-brand-subtle/30"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon
              className={cn(
                "w-3.5 h-3.5 shrink-0",
                isSelected ? "text-brand" : "text-muted-foreground"
              )}
            />
            <span className="truncate">{goal.label}</span>
          </button>
        );
      })}
    </div>
  );
}
