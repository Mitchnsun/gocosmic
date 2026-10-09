import { expect, test } from '@playwright/test';

import { asReturningVisitor, LOCALE } from './helpers';

const BANNER = '[data-cookie-banner]';

test('a first visit shows the cookie banner with the page, before the app loads', async ({ page }) => {
  // Block every JavaScript chunk: only the server HTML and the inline scripts run.
  await page.route('**/_next/static/chunks/**/*.js', (route) => route.abort());
  await page.goto(`/${LOCALE}`);

  await expect(page.locator(BANNER)).toBeVisible();
});

test('a returning visitor never sees the cookie banner, even before the app loads', async ({ context, page }) => {
  await asReturningVisitor(context, 'dark');
  await page.route('**/_next/static/chunks/**/*.js', (route) => route.abort());
  await page.goto(`/${LOCALE}`);

  await expect(page.locator(BANNER)).toBeHidden();
});

test('once the app runs, a returning visitor can still reopen the banner', async ({ context, page }) => {
  await asReturningVisitor(context, 'dark');
  await page.goto(`/${LOCALE}`, { waitUntil: 'networkidle' });

  await expect(page.locator(BANNER)).toHaveCount(0);
  await page
    .locator('footer')
    .getByRole('button', { name: /cookies/i })
    .click();
  await expect(page.locator(BANNER)).toBeVisible();
});
