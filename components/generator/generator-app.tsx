"use client";

import { useState, useRef } from "react";
import { MessageForm } from "./message-form";
import { GeneratedMessage } from "@/components/result/generated-message";
import { ErrorState } from "@/components/feedback/error-state";
import type { GenerateMessageInput, GenerateMessageResponse } from "@/lib/schemas";

export function GeneratorApp() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<GenerateMessageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GenerateMessageInput>>({});
  
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (containerRef.current) {
      const y = containerRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleGenerate = async (data: GenerateMessageInput) => {
    setStatus("loading");
    setError(null);
    setFormData(data);
    scrollToTop();
    
    try {
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "We couldn't connect to the generation service. Please try again.");
      }

      const resultData = await response.json();
      setResult(resultData);
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };

  const handleEdit = () => {
    setStatus("idle");
    setResult(null);
    setError(null);
    scrollToTop();
  };

  const handleStartNew = () => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setFormData({});
    scrollToTop();
  };

  const handleRegenerate = () => {
    if (Object.keys(formData).length > 0) {
      handleGenerate(formData as GenerateMessageInput);
    }
  };

  return (
    <div ref={containerRef} className="bg-card border border-border/40 rounded-3xl shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)] p-8 sm:p-14 min-h-[400px] transition-all">
      {status === "error" ? (
        <div className="space-y-12">
          <ErrorState error={error || "Unknown error"} onRetry={handleRegenerate} />
          <div className="border-t border-border/50 pt-10">
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-8">Your Details</h3>
            <MessageForm 
              initialData={formData}
              onSubmit={handleGenerate}
              isLoading={false}
            />
          </div>
        </div>
      ) : status === "success" && result ? (
        <GeneratedMessage 
          data={result} 
          onRegenerate={handleRegenerate}
          onEdit={handleEdit}
          onStartNew={handleStartNew}
          isLoading={false}
        />
      ) : (
        <MessageForm 
          initialData={formData}
          onSubmit={handleGenerate}
          isLoading={status === "loading"}
        />
      )}
      <span className="sr-only" aria-live="polite" role="status">
        {status === "loading" ? "Generating message..." : status === "success" ? "Message generated successfully." : status === "error" ? (error || "Error generating message.") : ""}
      </span>
    </div>
  );
}
