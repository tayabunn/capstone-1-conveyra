"use client";

import React, { useEffect, useRef, useId, useCallback } from "react";
import { createPortal } from "react-dom";

export interface AccessibleModalProps {
  /** Controls whether the modal is currently open */
  isOpen: boolean;
  /** Callback fired when a request to close the modal is made (Escape, close button, backdrop click) */
  onClose: () => void;
  /** Title text or node displayed as modal header and used as accessible name */
  title: React.ReactNode;
  /** Optional descriptive text or node linked via aria-describedby */
  description?: React.ReactNode;
  /** Modal body content */
  children: React.ReactNode;
  /** Optional element ref to focus initially when modal opens */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Optional fallback element to restore focus to if the original trigger is unmounted */
  fallbackRestoreRef?: React.RefObject<HTMLElement | null>;
  /** Whether clicking the backdrop overlay should close the modal. Defaults to true. */
  closeOnBackdropClick?: boolean;
  /** Custom CSS classes for the modal container */
  className?: string;
}

/**
 * Standard selector for finding all focusable elements inside a DOM subtree.
 * Filters out disabled elements, hidden elements, and elements with tabIndex = -1.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contentEditable=true]:not([tabindex="-1"])',
].join(", ");

/**
 * AccessibleModal
 * 
 * A handcrafted, fully accessible modal dialog adhering strictly to W3C WAI-ARIA
 * Dialog (Modal) Authoring Practices.
 * 
 * Key Accessibility Features:
 * 1. Semantics: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.
 * 2. Focus Management:
 *    - Captures trigger (`document.activeElement`) prior to open.
 *    - Moves focus to `initialFocusRef` or the first focusable control inside the modal.
 *    - Traps keyboard focus (`Tab` / `Shift+Tab`) strictly inside the modal container.
 *    - Restores focus to the trigger upon closing, with safe fallback handling if unmounted.
 * 3. Escape Key: Dismisses modal immediately when pressed.
 * 4. Background Interaction: Body scroll locked while open; backdrop click handling.
 * 5. Portal: Rendered cleanly into `document.body` to avoid parent clipping and z-index issues.
 */
const emptySubscribe = () => () => {};
function useIsMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
  fallbackRestoreRef,
  closeOnBackdropClick = true,
  className = "",
}: AccessibleModalProps) {
  const mounted = useIsMounted();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Generate stable unique IDs for ARIA associations
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = description ? `${baseId}-description` : undefined;

  /**
   * Helper to query all currently visible, interactive focusable elements
   * within the dialog content.
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!modalRef.current) return [];
    const elements = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );
    // Filter out elements that are hidden from the layout or screen readers
    return elements.filter((el) => {
      // In JSDOM getClientRects / offsetWidth might be 0, so check style visibility too
      const style = window.getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    });
  }, []);

  /**
   * 1. Focus Management on Open & Close
   * When modal opens:
   * - Save current active element (trigger)
   * - Move focus to initialFocusRef or first focusable control
   * When modal closes:
   * - Restore focus to the saved trigger, or fallback element if trigger was removed from DOM
   */
  useEffect(() => {
    if (!isOpen) return;

    // Capture the trigger element before opening (ignore body / root)
    const currentActive = document.activeElement as HTMLElement | null;
    if (currentActive && currentActive !== document.body && currentActive !== document.documentElement) {
      triggerRef.current = currentActive;
    }

    // Lock body scroll to prevent background scrolling
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Set initial focus inside dialog
    const focusTimer = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else if (modalRef.current) {
        // If no focusable child exists, focus the modal container itself
        modalRef.current.focus();
      }
    });

    const fallbackTarget = fallbackRestoreRef?.current;

    return () => {
      cancelAnimationFrame(focusTimer);
      // Restore body scroll
      document.body.style.overflow = originalBodyOverflow;

      // Restore focus to original trigger on close (with fallback)
      const trigger = triggerRef.current;
      const isTriggerValid = trigger && trigger !== document.body && document.body.contains(trigger);

      if (isTriggerValid) {
        trigger.focus();
      } else if (fallbackTarget && document.body.contains(fallbackTarget)) {
        fallbackTarget.focus();
      }
    };
  }, [isOpen, initialFocusRef, fallbackRestoreRef, getFocusableElements]);

  /**
   * 2. Keyboard Event Listeners (Escape key and Tab Focus Trapping)
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Escape key closes modal
    if (event.key === "Escape") {
      event.stopPropagation();
      event.preventDefault();
      onClose();
      return;
    }

    // Focus Trap: intercept Tab and Shift+Tab navigation
    if (event.key === "Tab") {
      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: If on first element or container, wrap focus to last element
        if (
          document.activeElement === firstElement ||
          document.activeElement === modalRef.current
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: If on last element, wrap focus to first element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  /**
   * Handle clicks on backdrop overlay
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !mounted) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-xl shadow-2xl p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="text-sm text-muted-foreground">
                {description}
              </div>
            )}
          </div>

          {/* Accessible Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
            data-testid="modal-close-button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
