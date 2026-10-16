import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

import { getLanguage } from '../i18n/locales';
import de from '../messages/de/pricing.json' with { type: 'json' };
import en from '../messages/en/pricing.json' with { type: 'json' };
import es from '../messages/es/pricing.json' with { type: 'json' };
import fr from '../messages/fr/pricing.json' with { type: 'json' };
import it from '../messages/it/pricing.json' with { type: 'json' };
import { asReturningVisitor, LOCALE, localizedUrl, THEMES } from './helpers';

/** Simulator and guided mode copy in the audited locale. */
const { builder: b, guide: g } = { de, en, es, fr, it }[getLanguage(LOCALE)].pricing;

/** WCAG 2.1 A and AA violations on the page as it stands, one line per rule. */
async function violationsOf(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return violations.map(({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(' ')).join(', ')}`);
}

const tick = (page: Page, label: string) => page.getByRole('checkbox', { name: label, exact: false }).first().check();

/**
 * The axe audit of `a11y.spec.ts` only sees the pricing page as it loads (see `docs/lessons.md`). This one
 * reaches the states revealed on interaction, in both themes: the guided mode open with its answers, the
 * replace warning, ticked rows and their sub-options, "More options" open, an info bubble open, and the
 * bar of small screens.
 */
for (const theme of THEMES) {
  test.describe(`pricing page states, ${theme} theme`, () => {
    test.beforeEach(async ({ context, page }) => {
      await asReturningVisitor(context, theme);
      await page.goto(localizedUrl('/pricing'), { waitUntil: 'networkidle' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    });

    test('the guided mode, answered, then its replace warning, has no WCAG A/AA violation', async ({ page }) => {
      await tick(page, b.options.english.label);
      await page.getByRole('button', { name: g.button }).click();
      await page.getByRole('radio', { name: g.situation.new }).check();
      await page.getByRole('radio', { name: g.editor.studio }).check();
      await page.getByRole('radio', { name: b.domain_question.no }).first().check();
      await page.getByRole('radio', { name: g.pages.two_four }).check();
      await page.getByRole('checkbox', { name: g.contact.form }).check();
      await page.getByRole('radio', { name: g.email.team }).check();
      await page.getByRole('radio', { name: g.news.monthly }).check();
      expect(await violationsOf(page)).toEqual([]);

      await page.getByRole('button', { name: g.submit }).click();
      await expect(page.getByRole('alert').filter({ hasText: g.confirm.text })).toBeVisible();
      expect(await violationsOf(page)).toEqual([]);
    });

    test('ticked rows, sub-options, "More options" and an info bubble have no WCAG A/AA violation', async ({
      page,
    }) => {
      await page.getByRole('radio', { name: b.domain_question.no }).check();
      for (const label of [
        b.options.contact_form.label,
        b.options.english.label,
        b.options.news.label,
        b.options.email.label,
        b.updates.label,
      ])
        await tick(page, label);
      await page.getByRole('button', { name: b.groups.more }).click();
      for (const label of [
        b.options.redirects.label,
        b.options.seo.label,
        b.options.analytics.label,
        b.options.detailed_analytics.label,
        b.options.articles.label,
      ])
        await tick(page, label);
      expect(await violationsOf(page)).toEqual([]);

      await page.getByRole('button', { name: b.info_label.replace('{option}', b.options.email.label) }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      expect(await violationsOf(page)).toEqual([]);
    });

    test('the bar of small screens has no WCAG A/AA violation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 740 });
      await page.getByRole('slider').first().scrollIntoViewIfNeeded();
      // The header's button has the same name: the bar's comes last.
      await expect(page.getByRole('link', { name: b.total.mobile_cta, exact: true }).last()).toBeVisible();

      expect(await violationsOf(page)).toEqual([]);
    });
  });
}
