import { test } from '@playwright/test';

import { asReturningVisitor, LOCALE, THEMES } from './helpers';

/** Full-page captures for the visual review of both themes, written to e2e/screenshots (git-ignored). */
const PAGES = ['', '/services', '/projets', '/contact'].map((path) => `/${LOCALE}${path}`);
const WIDTHS = [360, 768, 1280, 1440];

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    test(`screens · ${theme} · ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await asReturningVisitor(context, theme);
      const page = await context.newPage();

      for (const path of PAGES) {
        await page.goto(path, { waitUntil: 'networkidle' });
        const name = path.replaceAll('/', '_') || '_home';
        await page.screenshot({ path: `e2e/screenshots/${theme}-${width}${name}.png`, fullPage: true });
      }
      await context.close();
    });
  }
}
