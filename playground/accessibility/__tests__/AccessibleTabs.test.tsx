import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AccessibleTabs, TabItem } from "../AccessibleTabs";

describe("AccessibleTabs", () => {
  const sampleTabs: TabItem[] = [
    { id: "tab1", label: "Tab One", content: "Content for Tab One" },
    { id: "tab2", label: "Tab Two", content: "Content for Tab Two" },
    { id: "tab3", label: "Tab Three", content: "Content for Tab Three" },
    { id: "tab4", label: "Disabled Tab", content: "Disabled Content", disabled: true },
  ];

  it("renders tablist with correct ARIA attributes", () => {
    render(<AccessibleTabs items={sampleTabs} ariaLabel="Test Navigation Tabs" />);

    const tablist = screen.getByRole("tablist", { name: "Test Navigation Tabs" });
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);

    // Initial selected state
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");

    // Tabpanel association
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Content for Tab One");
    expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tabs[0].id);
  });

  it("switches tabs on mouse click", () => {
    render(<AccessibleTabs items={sampleTabs} ariaLabel="Test Tabs" />);

    const tab2 = screen.getByTestId("tab-tab2");
    fireEvent.click(tab2);

    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("tabindex", "0");
    expect(screen.getByTestId("tab-tab1")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByTestId("tab-tab1")).toHaveAttribute("tabindex", "-1");

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Content for Tab Two");
  });

  it("navigates forward using ArrowRight and wraps around disabled items", () => {
    render(<AccessibleTabs items={sampleTabs} ariaLabel="Test Tabs" />);

    const tab1 = screen.getByTestId("tab-tab1");
    const tab2 = screen.getByTestId("tab-tab2");
    const tab3 = screen.getByTestId("tab-tab3");

    tab1.focus();
    expect(document.activeElement).toBe(tab1);

    // ArrowRight -> tab2
    fireEvent.keyDown(tab1, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tab2);
    expect(tab2).toHaveAttribute("aria-selected", "true");

    // ArrowRight -> tab3
    fireEvent.keyDown(tab2, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tab3);
    expect(tab3).toHaveAttribute("aria-selected", "true");

    // ArrowRight on tab3 (tab4 is disabled) -> wraps to tab1
    fireEvent.keyDown(tab3, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tab1);
    expect(tab1).toHaveAttribute("aria-selected", "true");
  });

  it("navigates backward using ArrowLeft and wraps around", () => {
    render(<AccessibleTabs items={sampleTabs} ariaLabel="Test Tabs" />);

    const tab1 = screen.getByTestId("tab-tab1");
    const tab3 = screen.getByTestId("tab-tab3");

    tab1.focus();

    // ArrowLeft on tab1 -> wraps to last enabled tab (tab3)
    fireEvent.keyDown(tab1, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(tab3);
    expect(tab3).toHaveAttribute("aria-selected", "true");
  });

  it("jumps to first and last tab using Home and End keys", () => {
    render(<AccessibleTabs items={sampleTabs} defaultValue="tab2" ariaLabel="Test Tabs" />);

    const tab1 = screen.getByTestId("tab-tab1");
    const tab2 = screen.getByTestId("tab-tab2");
    const tab3 = screen.getByTestId("tab-tab3");

    tab2.focus();

    // End key -> jumps to last enabled (tab3)
    fireEvent.keyDown(tab2, { key: "End" });
    expect(document.activeElement).toBe(tab3);
    expect(tab3).toHaveAttribute("aria-selected", "true");

    // Home key -> jumps to first enabled (tab1)
    fireEvent.keyDown(tab3, { key: "Home" });
    expect(document.activeElement).toBe(tab1);
    expect(tab1).toHaveAttribute("aria-selected", "true");
  });

  it("supports manual activation mode", () => {
    render(
      <AccessibleTabs
        items={sampleTabs}
        activationMode="manual"
        ariaLabel="Manual Mode Tabs"
      />
    );

    const tab1 = screen.getByTestId("tab-tab1");
    const tab2 = screen.getByTestId("tab-tab2");

    tab1.focus();

    // ArrowRight in manual mode moves focus but does NOT activate
    fireEvent.keyDown(tab1, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tab2);
    expect(tab2).toHaveAttribute("aria-selected", "false");
    expect(tab1).toHaveAttribute("aria-selected", "true");

    // Press Enter to activate
    fireEvent.keyDown(tab2, { key: "Enter" });
    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content for Tab Two");
  });
});
