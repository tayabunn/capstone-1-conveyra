import { test, expect } from '@playwright/test';

const viewports = [
  { name: '320px (Ultra Compact)', width: 320, height: 600 },
  { name: '375px (iPhone SE)', width: 375, height: 667 },
  { name: '390px (iPhone 13/14)', width: 390, height: 844 },
  { name: '414px (Plus/Max Mobile)', width: 414, height: 896 },
  { name: '768px (Tablet Portrait)', width: 768, height: 1024 },
  { name: '1024px (Tablet Landscape)', width: 1024, height: 768 },
  { name: '1280px+ (Desktop)', width: 1280, height: 800 },
];

for (const vp of viewports) {
  test(`Responsive test at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Check no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // 2. Check hero header visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // 3. Check generator form and CTA visible
    await expect(page.locator('#context')).toBeVisible();
    await expect(page.getByRole('button', { name: /generate message/i })).toBeVisible();

    // 4. Check sections visible
    await expect(page.locator('#how-it-works')).toBeVisible();
    await expect(page.locator('#use-cases')).toBeVisible();
  });
}
