"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectLinePickerProps {
  primarySubject?: string | null;
  topic?: string;
  className?: string;
}

export function SubjectLinePicker({
  primarySubject,
  topic = "Action Required",
  className,
}: SubjectLinePickerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate 3 contextual subject line variations if primarySubject exists
  const subject1 = primarySubject || `Quick Update: ${topic}`;
  const subject2 = primarySubject ? `Regarding: ${primarySubject.replace(/^(re:|regarding:)\s*/i, "")}` : `Important: Regarding our next steps`;
  const subject3 = primarySubject ? `[Action Item] ${primarySubject}` : `Action requested: ${topic}`;

  const subjects = [
    { type: "Direct", text: subject1 },
    { type: "Diplomatic", text: subject2 },
    { type: "Action-Led", text: subject3 },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/60 backdrop-blur-md p-4 space-y-3", className)}>
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        <Mail className="w-4 h-4 text-brand" />
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
          Suggested Subject Lines
        </span>
      </div>

      <div className="space-y-2">
        {subjects.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-background/50 border border-border/50 hover:border-brand/40 transition-colors group text-xs"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5 rounded bg-muted/60 shrink-0">
                {item.type}
              </span>
              <span className="truncate font-medium text-foreground">{item.text}</span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(item.text, idx)}
              className="shrink-0 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Copy subject line"
              aria-label={`Copy ${item.type} subject line`}
            >
              {copiedIndex === idx ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
