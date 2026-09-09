"use client";

import React, { useState, useRef, useId, useCallback } from "react";

export interface TabItem {
  /** Unique value/identifier for the tab */
  id: string;
  /** Label to display on the tab button */
  label: React.ReactNode;
  /** Content rendered inside the corresponding tabpanel */
  content: React.ReactNode;
  /** Optional disabled state */
  disabled?: boolean;
}

export interface AccessibleTabsProps {
  /** List of tabs and their corresponding content */
  items: TabItem[];
  /** Controlled active tab ID */
  value?: string;
  /** Initial active tab ID for uncontrolled mode */
  defaultValue?: string;
  /** Callback fired when the active tab changes */
  onChange?: (tabId: string) => void;
  /** Accessible label describing the purpose of the tablist */
  ariaLabel: string;
  /** 
   * Activation model:
   * - "automatic" (default): Moving focus with arrow keys immediately selects and activates the tab.
   * - "manual": Moving focus with arrow keys changes focus only; user must press Enter or Space to activate.
   */
  activationMode?: "automatic" | "manual";
  /** Optional custom CSS classes for the container */
  className?: string;
}

/**
 * AccessibleTabs
 * 
 * A handcrafted, accessible Tabs component adhering strictly to the W3C WAI-ARIA
 * Tabs Pattern (Authoring Practices Guide).
 * 
 * Key Accessibility Features:
 * 1. Semantics & Roles:
 *    - Container: `role="tablist"` with descriptive `aria-label`.
 *    - Triggers: `role="tab"`, `aria-selected="true|false"`, `aria-controls="[panelId]"`.
 *    - Panels: `role="tabpanel"`, `aria-labelledby="[tabId]"`, `tabIndex={0}`.
 * 
 * 2. Roving tabindex Focus Model:
 *    - The selected tab receives `tabIndex={0}`.
 *    - All non-selected tabs receive `tabIndex={-1}`.
 *    - Pressing `Tab` from outside enters directly onto the active tab. Pressing `Tab` again
 *      moves focus into the active tabpanel (or first focusable element within it).
 * 
 * 3. Keyboard Navigation:
 *    - `ArrowRight`: Focuses next non-disabled tab (wraps around to the first tab).
 *    - `ArrowLeft`: Focuses previous non-disabled tab (wraps around to the last tab).
 *    - `Home`: Focuses the first non-disabled tab.
 *    - `End`: Focuses the last non-disabled tab.
 *    - `Enter` / `Space`: Activates the currently focused tab in manual activation mode.
 */
export function AccessibleTabs({
  items,
  value,
  defaultValue,
  onChange,
  ariaLabel,
  activationMode = "automatic",
  className = "",
}: AccessibleTabsProps) {
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Find initial selected ID
  const initialId = defaultValue || items.find((item) => !item.disabled)?.id || items[0]?.id || "";
  const [internalSelectedId, setInternalSelectedId] = useState<string>(initialId);

  // Controlled vs uncontrolled selectedId
  const selectedId = value !== undefined ? value : internalSelectedId;

  // Selected tab index
  const selectedIndex = items.findIndex((item) => item.id === selectedId);

  const handleSelectTab = useCallback(
    (id: string) => {
      if (value === undefined) {
        setInternalSelectedId(id);
      }
      onChange?.(id);
    },
    [value, onChange]
  );

  /**
   * Focus a tab at a specific index and optionally activate it (if automatic mode)
   */
  const focusTab = (index: number, activate = false) => {
    const targetTab = tabRefs.current[index];
    if (targetTab) {
      targetTab.focus();
      if (activate || activationMode === "automatic") {
        const item = items[index];
        if (item && !item.disabled) {
          handleSelectTab(item.id);
        }
      }
    }
  };

  /**
   * Find next non-disabled tab index with cyclic wrapping
   */
  const getNextEnabledIndex = (currentIndex: number, step: 1 | -1): number => {
    const total = items.length;
    let nextIndex = (currentIndex + step + total) % total;
    while (items[nextIndex]?.disabled && nextIndex !== currentIndex) {
      nextIndex = (nextIndex + step + total) % total;
    }
    return nextIndex;
  };

  /**
   * Find first non-disabled tab index
   */
  const getFirstEnabledIndex = (): number => {
    const index = items.findIndex((item) => !item.disabled);
    return index !== -1 ? index : 0;
  };

  /**
   * Find last non-disabled tab index
   */
  const getLastEnabledIndex = (): number => {
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].disabled) return i;
    }
    return items.length - 1;
  };

  /**
   * Keyboard navigation handler following WAI-ARIA Tabs specification
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        const nextIndex = getNextEnabledIndex(currentIndex, 1);
        focusTab(nextIndex, activationMode === "automatic");
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const prevIndex = getNextEnabledIndex(currentIndex, -1);
        focusTab(prevIndex, activationMode === "automatic");
        break;
      }
      case "Home": {
        event.preventDefault();
        const firstIndex = getFirstEnabledIndex();
        focusTab(firstIndex, activationMode === "automatic");
        break;
      }
      case "End": {
        event.preventDefault();
        const lastIndex = getLastEnabledIndex();
        focusTab(lastIndex, activationMode === "automatic");
        break;
      }
      case "Enter":
      case " ": {
        if (activationMode === "manual") {
          event.preventDefault();
          const item = items[currentIndex];
          if (item && !item.disabled) {
            handleSelectTab(item.id);
          }
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Tab List Container */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className="flex items-center gap-1 border-b border-border pb-px overflow-x-auto"
      >
        {items.map((item, index) => {
          const isSelected = item.id === selectedId;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              aria-disabled={item.disabled ? "true" : undefined}
              disabled={item.disabled}
              // Roving tabindex: Selected tab has 0 (focusable via Tab), others have -1
              tabIndex={isSelected || (selectedIndex === -1 && index === 0) ? 0 : -1}
              onClick={() => !item.disabled && handleSelectTab(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isSelected
                  ? "text-primary border-b-2 border-primary font-semibold bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid={`tab-${item.id}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        const tabId = `${baseId}-tab-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            // tabIndex 0 allows keyboard navigation into the panel if it has no focusable elements
            tabIndex={0}
            hidden={!isSelected}
            className={`p-4 rounded-b-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isSelected ? "block" : "hidden"
            }`}
            data-testid={`tabpanel-${item.id}`}
          >
            {isSelected && item.content}
          </div>
        );
      })}
    </div>
  );
}
