import React, { useState, useRef } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AccessibleModal } from "../AccessibleModal";

describe("AccessibleModal", () => {
  function TestModalWrapper({
    initialOpen = false,
    initialFocus = false,
    unmountTrigger = false,
  }: {
    initialOpen?: boolean;
    initialFocus?: boolean;
    unmountTrigger?: boolean;
  }) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [showTrigger, setShowTrigger] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const fallbackRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <button
          ref={fallbackRef}
          type="button"
          data-testid="fallback-target"
        >
          Fallback Target
        </button>

        {showTrigger && (
          <button
            type="button"
            data-testid="open-trigger"
            onClick={() => {
              setIsOpen(true);
              if (unmountTrigger) {
                setShowTrigger(false);
              }
            }}
          >
            Open Modal
          </button>
        )}

        <AccessibleModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Test Title"
          description="Modal Test Description"
          initialFocusRef={initialFocus ? inputRef : undefined}
          fallbackRestoreRef={fallbackRef}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="First field"
            data-testid="first-input"
          />
          <button type="button" data-testid="second-button">
            Second Action
          </button>
          <button
            type="button"
            data-testid="close-action-button"
            onClick={() => setIsOpen(false)}
          >
            Done
          </button>
        </AccessibleModal>
      </div>
    );
  }

  it("does not render dialog in DOM when isOpen is false", () => {
    render(<TestModalWrapper initialOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens modal and sets correct ARIA attributes", () => {
    render(<TestModalWrapper initialOpen={true} />);
    
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");

    const title = screen.getByText("Modal Test Title");
    const description = screen.getByText("Modal Test Description");
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("moves focus into the dialog on open", async () => {
    render(<TestModalWrapper initialOpen={false} />);

    const trigger = screen.getByTestId("open-trigger");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await waitFor(() => {
      const activeEl = document.activeElement;
      expect(activeEl).not.toBe(trigger);
      expect(activeEl?.tagName).toMatch(/BUTTON|INPUT/);
    });
  });

  it("respects initialFocusRef if provided", async () => {
    render(<TestModalWrapper initialOpen={true} initialFocus={true} />);

    await waitFor(() => {
      const input = screen.getByTestId("first-input");
      expect(document.activeElement).toBe(input);
    });
  });

  it("closes modal and restores focus to trigger on close button click", async () => {
    render(<TestModalWrapper initialOpen={false} />);

    const trigger = screen.getByTestId("open-trigger");
    trigger.focus();
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const closeBtn = screen.getByTestId("modal-close-button");
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(trigger);
    });
  });

  it("closes modal when Escape is pressed", async () => {
    render(<TestModalWrapper initialOpen={false} />);

    const trigger = screen.getByTestId("open-trigger");
    trigger.focus();
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(trigger);
    });
  });

  it("traps focus inside dialog on Tab and Shift+Tab", async () => {
    render(<TestModalWrapper initialOpen={true} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const dialog = screen.getByRole("dialog");
    const closeBtn = screen.getByTestId("modal-close-button");
    const doneButton = screen.getByTestId("close-action-button");

    // 1. Focus on doneButton (the last element) and press Tab -> should wrap to closeBtn
    doneButton.focus();
    expect(document.activeElement).toBe(doneButton);

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(closeBtn);

    // 2. Focus on closeBtn (first element) and press Shift+Tab -> should wrap to doneButton
    closeBtn.focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(doneButton);
  });

  it("safely restores focus to fallback element if original trigger was unmounted", async () => {
    render(<TestModalWrapper initialOpen={false} unmountTrigger={true} />);

    const trigger = screen.getByTestId("open-trigger");
    trigger.focus();
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const closeBtn = screen.getByTestId("modal-close-button");
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(screen.getByTestId("fallback-target"));
    });
  });

  it("closes modal on backdrop click", async () => {
    render(<TestModalWrapper initialOpen={true} />);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
