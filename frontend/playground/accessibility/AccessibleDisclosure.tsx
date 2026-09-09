"use client";

import React, { useState, useId } from "react";

export interface AccessibleDisclosureProps {
  /** The title/label displayed in the disclosure button trigger */
  title: React.ReactNode;
  /** Content revealed when the disclosure is expanded */
  children: React.ReactNode;
  /** Controlled open state */
  isOpen?: boolean;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Callback fired when the disclosure is toggled */
  onToggle?: (isOpen: boolean) => void;
  /** Optional custom CSS classes for the outer container */
  className?: string;
  /** Optional custom CSS classes for the trigger button */
  buttonClassName?: string;
  /** Optional custom CSS classes for the panel container */
  panelClassName?: string;
}

/**
 * AccessibleDisclosure
 * 
 * A handcrafted, fully accessible Disclosure / Collapsible component adhering
 * strictly to W3C WAI-ARIA Disclosure Pattern.
 * 
 * Key Accessibility Features:
 * 1. Semantic Trigger:
 *    - Uses a native `<button>` element ensuring native Enter & Space key activation,
 *      native keyboard focusability, and built-in disabled support.
 * 2. State Exposure:
 *    - Employs `aria-expanded="true|false"` to communicate state to screen readers.
 * 3. Relationship Association:
 *    - Associates the button with the collapsible panel via `aria-controls`.
 *    - Associates the panel with the button via `aria-labelledby` and `role="region"`.
 * 4. Natural Tab Flow:
 *    - When expanded, pressing Tab naturally advances into the interactive controls
 *      inside the panel.
 * 5. Minimalist ARIA:
 *    - Uses semantic HTML where possible without redundant ARIA attributes.
 */
export function AccessibleDisclosure({
  title,
  children,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onToggle,
  className = "",
  buttonClassName = "",
  panelClassName = "",
}: AccessibleDisclosureProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const baseId = useId();
  const buttonId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;

  const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const nextState = !isExpanded;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <div className={`border border-border rounded-lg overflow-hidden transition-colors ${className}`}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={handleToggle}
          className={`w-full flex items-center justify-between p-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer ${buttonClassName}`}
          data-testid="disclosure-trigger"
        >
          <span>{title}</span>
          <svg
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ease-in-out ${
              isExpanded ? "transform rotate-180 text-foreground" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isExpanded}
        className={`p-4 border-t border-border bg-card/50 text-card-foreground text-sm leading-relaxed ${
          isExpanded ? "block" : "hidden"
        } ${panelClassName}`}
        data-testid="disclosure-panel"
      >
        {children}
      </div>
    </div>
  );
}
