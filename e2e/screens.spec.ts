import { expect, test } from '@playwright/test';

import { asReturningVisitor, localizedUrl, type RouteKey, THEMES } from './helpers';

/** Full-page captures for the visual review of both themes, written to e2e/screenshots (git-ignored). */
const PAGES: RouteKey[] = ['/', '/services', '/projects', '/contact'];
const WIDTHS = [360, 768, 1280, 1440];

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    test(`screens · ${theme} · ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await asReturningVisitor(context, theme);
      const page = await context.newPage();

      for (const routeKey of PAGES) {
        const url = localizedUrl(routeKey);
        const response = await page.goto(url, { waitUntil: 'networkidle' });
        // A wrong slug would otherwise capture the not-found page without failing.
        expect(response?.status(), url).toBe(200);
        const name = url.replaceAll('/', '_');
        await page.screenshot({ path: `e2e/screenshots/${theme}-${width}${name}.png`, fullPage: true });
      }
      await context.close();
    });
  }
}
