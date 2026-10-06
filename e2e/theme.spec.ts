import { expect, test } from '@playwright/test';

import { asReturningVisitor, LOCALE, THEME_LABELS } from './helpers';

const CREAM = 'rgb(255, 248, 231)';
const VOID = 'rgb(2, 6, 23)';

test('a returning light-theme visitor never sees the dark page, even before the app loads', async ({
  context,
  page,
}) => {
  await asReturningVisitor(context, 'light');
  // Block every JavaScript chunk: only the inline theme script in the HTML can run.
  await page.route('**/_next/static/chunks/**/*.js', (route) => route.abort());
  await page.goto(`/${LOCALE}`);

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', CREAM);
  // The browser chrome follows too: the first theme-color tag is the cream stand-in.
  await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', '#fff8e7');
});

test('once the app runs, a single theme-color tag remains, on the stored theme', async ({ context, page }) => {
  await asReturningVisitor(context, 'light');
  await page.goto(`/${LOCALE}`, { waitUntil: 'networkidle' });

  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fff8e7');
});

test('without any stored choice the site opens dark, whatever the OS prefers', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto(`/${LOCALE}`);

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', VOID);
  await context.close();
});

test('the toggle switches the theme, the browser chrome and remembers the choice', async ({ context, page }) => {
  await asReturningVisitor(context, 'dark');
  await page.goto(`/${LOCALE}`);
  await page.locator('header nav').getByRole('button', { name: THEME_LABELS.toggle_light }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fff8e7');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
