"use client";

import React, { useState } from "react";
import { AccessibleModal } from "./AccessibleModal";
import { AccessibleTabs } from "./AccessibleTabs";
import { AccessibleDisclosure } from "./AccessibleDisclosure";

export function AccessibilityPlayground() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("Executive");

  const tabItems = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Overview & Principles</h3>
          <p className="text-muted-foreground text-sm">
            Conveyra transforms raw technical communication into clear, executive-ready messages.
            This playground demonstrates accessible interactive patterns built from the ground up
            without third-party UI libraries.
          </p>
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
            >
              Learn More
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-border text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
            >
              Documentation
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "context",
      label: "Context",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Communication Context</h3>
          <p className="text-muted-foreground text-sm">
            Different audiences require distinct tone, brevity, and structure. Choosing the right
            context ensures that decisions are made quickly without ambiguity or friction.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Executive: High-level decisions, ROI, concise takeaways.</li>
            <li>Engineering: Technical precision, architecture details, trade-offs.</li>
            <li>Client: Empathetic, clear next steps, reassuring tone.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "output",
      label: "Output",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Generated Output Preview</h3>
          <p className="text-muted-foreground text-sm">
            AI-refined messages are delivered with crystal clarity, accompanied by tone analysis
            and readability metrics.
          </p>
          <div className="p-3 bg-muted/40 border border-border rounded-md font-mono text-xs text-foreground">
            &quot;We have completed the performance optimization roadmap, achieving a 45% reduction
            in latency while maintaining full backward compatibility.&quot;
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Page Header */}
      <header className="space-y-3 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          Playground
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Accessibility Foundations Playground
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Interactive showcase of custom WAI-ARIA compliant components built from scratch: Modal Dialog,
          Tabs, and Disclosures with focus trapping and full keyboard navigation.
        </p>
      </header>

      {/* 1. Modal Dialog Section */}
      <section
        aria-labelledby="modal-section-heading"
        className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-xs space-y-4"
      >
        <div className="space-y-1">
          <h2 id="modal-section-heading" className="text-xl font-semibold text-foreground">
            1. Modal Dialog
          </h2>
          <p className="text-sm text-muted-foreground">
            Adheres to WAI-ARIA Modal Dialog pattern. Traps focus within the dialog while open,
            listens for Escape to dismiss, and restores focus back to the trigger button upon close.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors cursor-pointer"
            data-testid="open-modal-trigger"
          >
            Open Modal
          </button>
        </div>

        {/* Modal Instance */}
        <AccessibleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Configure Assistant Preferences"
          description="Adjust your communication context and tone parameters for subsequent AI generation."
        >
          <div className="space-y-4">
            {/* Focusable Control 1: Text Input */}
            <div className="space-y-1.5">
              <label htmlFor="feedback-note-input" className="block text-sm font-medium text-foreground">
                Assistant Role Name
              </label>
              <input
                id="feedback-note-input"
                type="text"
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="e.g. Senior Tech Lead"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-testid="modal-input"
              />
            </div>

            {/* Focusable Control 2: Select Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="audience-select" className="block text-sm font-medium text-foreground">
                Target Audience
              </label>
              <select
                id="audience-select"
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                data-testid="modal-select"
              >
                <option value="Executive">Executive Leadership</option>
                <option value="Engineering">Engineering Team</option>
                <option value="Stakeholder">Product Stakeholder</option>
                <option value="Client">Direct Client</option>
              </select>
            </div>

            {/* Focusable Control 3: Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                data-testid="modal-cancel-button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Simulate save action
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                data-testid="modal-save-button"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </AccessibleModal>
      </section>

      {/* 2. Tabs Section */}
      <section
        aria-labelledby="tabs-section-heading"
        className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-xs space-y-4"
      >
        <div className="space-y-1">
          <h2 id="tabs-section-heading" className="text-xl font-semibold text-foreground">
            2. Tabs
          </h2>
          <p className="text-sm text-muted-foreground">
            Adheres to WAI-ARIA Tabs pattern with roving tabindex. Supports keyboard navigation via{" "}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded font-mono">ArrowRight</kbd>,{" "}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded font-mono">ArrowLeft</kbd>,{" "}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded font-mono">Home</kbd>, and{" "}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded font-mono">End</kbd>.
          </p>
        </div>

        <AccessibleTabs
          items={tabItems}
          defaultValue="overview"
          ariaLabel="Conveyra Communication Overview Tabs"
          className="border border-border rounded-lg bg-background"
        />
      </section>

      {/* 3. Disclosure Section */}
      <section
        aria-labelledby="disclosure-section-heading"
        className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-xs space-y-4"
      >
        <div className="space-y-1">
          <h2 id="disclosure-section-heading" className="text-xl font-semibold text-foreground">
            3. Disclosure (Accordion FAQ)
          </h2>
          <p className="text-sm text-muted-foreground">
            Adheres to WAI-ARIA Disclosure pattern. Native button triggers with{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded border border-border">aria-expanded</code> and{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded border border-border">aria-controls</code>, toggled via Enter or Space.
          </p>
        </div>

        <div className="space-y-3">
          <AccessibleDisclosure title="What is Conveyra?">
            Conveyra is an AI-powered communication assistant designed for software engineers, product
            managers, and technical teams to craft articulate, context-aware messages for diverse audiences.
          </AccessibleDisclosure>

          <AccessibleDisclosure title="How does the AI work?">
            Conveyra analyzes the objective, emotional tone, and audience context of your input, using
            advanced language models to restructure and refine the narrative for maximum clarity and impact.
          </AccessibleDisclosure>

          <AccessibleDisclosure title="What happens to my message?">
            Your text is processed securely in real-time. We do not use your confidential message data
            to train foundational models or retain it beyond the scope of generation.
          </AccessibleDisclosure>
        </div>
      </section>
    </div>
  );
}
