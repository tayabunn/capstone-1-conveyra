import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Playground E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/playground/accessibility");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Axe Accessibility Audit on Playground Route", async ({ page }) => {
    const scanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const seriousOrCritical = scanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(seriousOrCritical).toHaveLength(0);
  });

  test("Modal: Open, Trap Focus, Escape, and Restore Focus", async ({ page }) => {
    const openButton = page.getByTestId("open-modal-trigger");
    await expect(openButton).toBeVisible();

    // 1. Focus and open modal
    await openButton.focus();
    await page.keyboard.press("Enter");

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("aria-modal", "true");

    // 2. Tab through modal controls and verify trap
    await page.keyboard.press("Tab");
    const input = page.getByTestId("modal-input");
    await expect(input).toBeFocused();

    await page.keyboard.press("Tab");
    const select = page.getByTestId("modal-select");
    await expect(select).toBeFocused();

    // 3. Escape closes modal and restores focus
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
    await expect(openButton).toBeFocused();
  });

  test("Tabs: Keyboard navigation via Arrow keys, Home, and End", async ({ page }) => {
    const overviewTab = page.getByTestId("tab-overview");
    const contextTab = page.getByTestId("tab-context");
    const outputTab = page.getByTestId("tab-output");

    await overviewTab.focus();
    await expect(overviewTab).toHaveAttribute("aria-selected", "true");

    // ArrowRight -> Context
    await page.keyboard.press("ArrowRight");
    await expect(contextTab).toBeFocused();
    await expect(contextTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("tabpanel-context")).toBeVisible();

    // ArrowRight -> Output
    await page.keyboard.press("ArrowRight");
    await expect(outputTab).toBeFocused();
    await expect(outputTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("tabpanel-output")).toBeVisible();

    // ArrowRight from last tab -> wraps to Overview
    await page.keyboard.press("ArrowRight");
    await expect(overviewTab).toBeFocused();
    await expect(overviewTab).toHaveAttribute("aria-selected", "true");

    // End key -> jumps to Output
    await page.keyboard.press("End");
    await expect(outputTab).toBeFocused();

    // Home key -> jumps to Overview
    await page.keyboard.press("Home");
    await expect(overviewTab).toBeFocused();
  });

  test("Disclosure: Keyboard expansion and state updates", async ({ page }) => {
    const triggers = page.getByTestId("disclosure-trigger");
    const firstTrigger = triggers.first();

    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");

    // Focus and expand via Enter
    await firstTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

    // Collapse via Space
    await page.keyboard.press("Space");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  });
});
