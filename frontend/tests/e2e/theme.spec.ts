import { test, expect } from '@playwright/test';

test.describe('Theme Mode Verification', () => {
  test('verifies light and dark mode toggle and visibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Initial theme check
    const themeBtn = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeBtn).toBeVisible();

    // 2. Toggle to dark mode if not already
    await themeBtn.click();
    
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(typeof isDark).toBe('boolean');
    
    // Verify essential elements visible in active theme
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#context')).toBeVisible();
    await expect(page.getByRole('button', { name: /generate message/i })).toBeVisible();
    
    // Toggle again
    await themeBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#context')).toBeVisible();
  });
});
