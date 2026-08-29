import { test, expect } from '@playwright/test';

test.describe('Conveyra Generator Flow', () => {
  test('should successfully generate and copy a message', async ({ page, context }) => {
    // Grant clipboard permissions for copying
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('response', response => {
      if (response.url().includes('api/generate-message')) {
        console.log('NETWORK RESPONSE:', response.status(), response.url());
      }
    });

    // 1. Open application
    await page.goto('/');

    // Verify page loaded
    await expect(page.getByRole('heading', { name: /Say what you mean/i })).toBeVisible();

    // Mock the API response to avoid hitting real Gemini API
    await page.route('**/api/generate-message', async route => {
      console.log('Mock intercepted the request!');
      const json = {
        message: 'This is the successfully mocked generated message.',
        approach: 'This approach is direct and mocked.',
        alternative: 'This is a mocked alternative version.'
      };
      
      // Add a slight delay to ensure the loading state is visible
      await new Promise(r => setTimeout(r, 800));
      await route.fulfill({ json });
    });

    // 2. Complete required form fields
    await page.fill('#context', 'I need to ask my manager for more time on the current project deadline.');
    await page.getByLabel(/Who are you writing to/i).selectOption('manager');
    
    // For Tone and Length, they are custom radio groups.
    await page.locator('label').filter({ hasText: 'Professional' }).click();
    await page.locator('label').filter({ hasText: 'Short' }).click();

    // 4. Generate
    const generateBtn = page.getByRole('button', { name: /Generate Message/i });
    await generateBtn.click();

    // Check for validation errors
    const alerts = page.getByRole('alert');
    if (await alerts.count() > 0) {
      console.log('Validation errors:', await alerts.allInnerTexts());
    }
    
    // Print DOM
    const html = await page.content();
    console.log("PAGE HTML:");
    console.log(html.substring(0, 1500) + '... (truncated)');
    console.log("---");
    if (html.includes("Your Suggested Message")) {
      console.log("FOUND HEADING IN HTML!");
    } else {
      console.log("HEADING NOT FOUND IN HTML!");
    }

    // 5. Verify result
    await expect(page.getByRole('heading', { name: 'Your Suggested Message' })).toBeVisible();
    await expect(page.getByText('This is the successfully mocked generated message.')).toBeVisible();
    await expect(page.getByText('This approach is direct and mocked.')).toBeVisible();
    await expect(page.getByText('This is a mocked alternative version.')).toBeVisible();

    // 6. Copy message
    const copyBtn = page.getByRole('button', { name: /Copy Message/i });
    await copyBtn.click();

    // 7. Verify feedback
    await expect(page.getByText('Copied to clipboard')).toBeVisible();
  });
});
