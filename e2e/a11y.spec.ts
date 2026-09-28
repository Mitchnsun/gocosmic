import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { asReturningVisitor, ROUTES, THEMES } from './helpers';

/** WCAG 2.1 A and AA, contrast included, on every route in both themes (EPIC #113 definition of done). */
for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ context }) => {
      await asReturningVisitor(context, theme);
    });

    for (const route of ROUTES) {
      test(`${route} has no WCAG A/AA violation`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' });
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        const summary = violations.map(
          ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(' ')).join(', ')}`
        );
        expect(summary).toEqual([]);
      });
    }
  });
}
