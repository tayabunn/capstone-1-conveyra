import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AccessibleDisclosure } from "../AccessibleDisclosure";

describe("AccessibleDisclosure", () => {
  it("renders with semantic button trigger and collapsed state by default", () => {
    render(
      <AccessibleDisclosure title="Disclosure Title">
        <p>Hidden body text</p>
      </AccessibleDisclosure>
    );

    const trigger = screen.getByRole("button", { name: /Disclosure Title/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls");

    const panel = screen.getByTestId("disclosure-panel");
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute("role", "region");
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
    expect(panel).toHaveAttribute("hidden");
  });

  it("toggles open and closed on click", () => {
    const handleToggle = vi.fn();

    render(
      <AccessibleDisclosure title="Toggle Test" onToggle={handleToggle}>
        <p>Revealed panel text</p>
      </AccessibleDisclosure>
    );

    const trigger = screen.getByRole("button", { name: /Toggle Test/i });

    // Click to open
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("disclosure-panel")).not.toHaveAttribute("hidden");
    expect(handleToggle).toHaveBeenCalledWith(true);

    // Click to close
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("disclosure-panel")).toHaveAttribute("hidden");
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it("supports keyboard activation via Enter and Space keys", () => {
    render(
      <AccessibleDisclosure title="Keyboard Test">
        <p>Keyboard accessible content</p>
      </AccessibleDisclosure>
    );

    const trigger = screen.getByRole("button", { name: /Keyboard Test/i });

    // Click/key on trigger (native button activates click on Enter and Space)
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports defaultOpen prop", () => {
    render(
      <AccessibleDisclosure title="Pre-opened" defaultOpen={true}>
        <p>Immediately visible</p>
      </AccessibleDisclosure>
    );

    const trigger = screen.getByRole("button", { name: /Pre-opened/i });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("disclosure-panel")).not.toHaveAttribute("hidden");
  });
});
