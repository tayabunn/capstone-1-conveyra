"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageForm } from "./message-form";
import { GeneratedMessage } from "@/components/result/generated-message";
import { ErrorState } from "@/components/feedback/error-state";
import { CommunicationContextTool } from "./communication-context-tool";
import type { GenerateMessageInput, GenerateMessageResponse } from "@/lib/schemas";

function GeneratorAppInner() {
  const searchParams = useSearchParams();
  const reuseId = searchParams ? searchParams.get("reuse") : null;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<GenerateMessageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GenerateMessageInput>>({
    channel: "email",
    goal: "request_action",
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToTop = () => {
    if (containerRef.current) {
      const y = containerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Handle "Use Again" prepopulation from history
  useEffect(() => {
    if (reuseId) {
      fetch(`/api/messages/${reuseId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.message) {
            const m = data.message;
            setFormData({
              context: m.originalThought,
              recipient: m.recipient as GenerateMessageInput["recipient"],
              goal: (m.communicationGoal || "request_action") as GenerateMessageInput["goal"],
              channel: (m.channel?.toLowerCase() || "email") as GenerateMessageInput["channel"],
              tone: m.tone as GenerateMessageInput["tone"],
              length: m.length as GenerateMessageInput["length"],
              draft: m.roughDraft || "",
            });
            scrollToTop();
          }
        })
        .catch(() => {
          // Ignore
        });
    }
  }, [reuseId]);

  // Focus management effect for state transitions
  useEffect(() => {
    if (status === "success" && resultHeadingRef.current) {
      resultHeadingRef.current.focus();
    } else if (status === "error" && errorContainerRef.current) {
      errorContainerRef.current.focus();
    }
  }, [status]);

  const handleGenerate = async (data: GenerateMessageInput) => {
    // Abort any existing in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus("loading");
    setError(null);
    setFormData(data);
    
    try {
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "We couldn't connect to the generation service. Please try again.");
      }

      const resultData = (await response.json()) as GenerateMessageResponse;
      setResult(resultData);
      setStatus("success");
      scrollToTop();
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Request was intentionally cancelled by the user
        setStatus("idle");
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setStatus("error");
      scrollToTop();
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("idle");
    // Return focus to the context textarea
    setTimeout(() => {
      document.getElementById("context")?.focus();
    }, 50);
  };

  const handleEdit = () => {
    setStatus("idle");
    setResult(null);
    setError(null);
    scrollToTop();
    setTimeout(() => {
      document.getElementById("context")?.focus();
    }, 100);
  };

  const handleStartNew = () => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setFormData({
      channel: "email",
      goal: "request_action",
    });
    scrollToTop();
    setTimeout(() => {
      document.getElementById("context")?.focus();
    }, 100);
  };

  const handleRegenerate = () => {
    if (Object.keys(formData).length > 0) {
      handleGenerate(formData as GenerateMessageInput);
    }
  };

  return (
    <div 
      id="generator"
      ref={containerRef} 
      className="relative rounded-3xl p-6 sm:p-10 md:p-12 min-h-[420px] transition-all overflow-hidden card-luminous-tactile"
    >
      {/* Subtle colored accent line at the top of the workspace */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric via-brand to-electric" />
      
      {status === "error" ? (
        <div className="space-y-8" ref={errorContainerRef} tabIndex={-1}>
          <ErrorState error={error || "Unknown error"} onRetry={handleRegenerate} />
          <div className="border-t border-border/70 pt-6">
            <h3 className="text-xs font-bold tracking-tight text-foreground mb-6 uppercase font-mono">Your Submission</h3>
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
          headingRef={resultHeadingRef}
          onRegenerate={handleRegenerate}
          onEdit={handleEdit}
          onStartNew={handleStartNew}
          isLoading={false}
        />
      ) : status === "loading" ? (
        <div className="space-y-6">
          <CommunicationContextTool
            state="input-streaming"
            input={formData}
          />
          <MessageForm 
            initialData={formData}
            onSubmit={handleGenerate}
            onCancel={handleCancel}
            isLoading={true}
          />
        </div>
      ) : (
        <MessageForm 
          initialData={formData}
          onSubmit={handleGenerate}
          onCancel={handleCancel}
          isLoading={false}
        />
      )}

      {/* Screen Reader Live Status Announcement */}
      <span className="sr-only" aria-live="polite" role="status">
        {status === "loading"
          ? "Analyzing communication context and generating calibrated message..."
          : status === "success"
          ? "Message generated successfully with context analysis. Use Tab to review your suggested message and strategic rationale."
          : status === "error"
          ? `Generation failed: ${error || "An error occurred."} You can try again below.`
          : ""}
      </span>
    </div>
  );
}

export function GeneratorApp() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-muted-foreground">Loading workspace...</div>}>
      <GeneratorAppInner />
    </Suspense>
  );
}
