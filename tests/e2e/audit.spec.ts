import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface ViolationItem {
  id: string;
  impact?: string | null;
  description: string;
  nodes: number;
}

test.describe('Automated Audits', () => {
  test('Axe Accessibility Audit on Local Application', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violationsByImpact: Record<string, ViolationItem[]> = {
      critical: [],
      serious: [],
      moderate: [],
      minor: [],
    };

    accessibilityScanResults.violations.forEach((violation) => {
      const impact = violation.impact || 'minor';
      if (!violationsByImpact[impact]) violationsByImpact[impact] = [];
      violationsByImpact[impact].push({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        nodes: violation.nodes.length,
      });
    });

    console.log('--- AXE AUDIT REPORT (LOCAL) ---');
    console.log('Passes:', accessibilityScanResults.passes.length);
    console.log('Incomplete:', accessibilityScanResults.incomplete.length);
    console.log('Inapplicable:', accessibilityScanResults.inapplicable.length);
    console.log('Violations Summary:', {
      critical: violationsByImpact.critical.length,
      serious: violationsByImpact.serious.length,
      moderate: violationsByImpact.moderate.length,
      minor: violationsByImpact.minor.length,
    });
    console.log('Detailed Violations:', JSON.stringify(violationsByImpact, null, 2));

    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')).toHaveLength(0);
  });

  test('Axe Accessibility Audit on Production Vercel URL', async ({ page }) => {
    await page.goto('https://capstone-1-conveyra.vercel.app/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violationsByImpact: Record<string, ViolationItem[]> = {
      critical: [],
      serious: [],
      moderate: [],
      minor: [],
    };

    accessibilityScanResults.violations.forEach((violation) => {
      const impact = violation.impact || 'minor';
      if (!violationsByImpact[impact]) violationsByImpact[impact] = [];
      violationsByImpact[impact].push({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        nodes: violation.nodes.length,
      });
    });

    console.log('--- AXE AUDIT REPORT (VERCEL PROD) ---');
    console.log('Passes:', accessibilityScanResults.passes.length);
    console.log('Incomplete:', accessibilityScanResults.incomplete.length);
    console.log('Inapplicable:', accessibilityScanResults.inapplicable.length);
    console.log('Violations Summary:', {
      critical: violationsByImpact.critical.length,
      serious: violationsByImpact.serious.length,
      moderate: violationsByImpact.moderate.length,
      minor: violationsByImpact.minor.length,
    });
    console.log('Detailed Violations:', JSON.stringify(violationsByImpact, null, 2));

    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')).toHaveLength(0);
  });
});
