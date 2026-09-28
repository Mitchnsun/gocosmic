import { expect, test } from '@playwright/test';

import { asReturningVisitor, LOCALE } from './helpers';

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
  await page
    .locator('header nav')
    .getByRole('button', { name: /th[eè]me clair|light theme/i })
    .click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fff8e7');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
