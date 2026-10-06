import type { BrowserContext } from '@playwright/test';

import { routing } from '../i18n/routing';
import de from '../messages/de/common.json' with { type: 'json' };
import en from '../messages/en/common.json' with { type: 'json' };
import es from '../messages/es/common.json' with { type: 'json' };
import fr from '../messages/fr/common.json' with { type: 'json' };
import it from '../messages/it/common.json' with { type: 'json' };

export const THEMES = ['dark', 'light'] as const;
export type Theme = (typeof THEMES)[number];

/** Locale audited by default; set QA_LOCALE to audit another one. */
export const LOCALE = (process.env.QA_LOCALE ?? 'fr') as (typeof routing.locales)[number];
if (!routing.locales.includes(LOCALE)) {
  throw new Error(`QA_LOCALE must be one of ${routing.locales.join(', ')}, got "${LOCALE}"`);
}

/** Theme toggle labels in the audited locale, e.g. `Passer au thème clair`. */
// eslint-disable-next-line security/detect-object-injection -- LOCALE is a typed locale
export const THEME_LABELS = { de, en, es, fr, it }[LOCALE].theme;

export type RouteKey = keyof typeof routing.pathnames;

/** Public URL of a route in the audited locale, from the translated pathnames, e.g. `/projects` → `/fr/projets`. */
export function localizedUrl(routeKey: RouteKey): string {
  // eslint-disable-next-line security/detect-object-injection -- routeKey is a typed route key
  const path = routing.pathnames[routeKey];
  // eslint-disable-next-line security/detect-object-injection -- LOCALE is a typed locale
  const localized = typeof path === 'string' ? path : path[LOCALE];
  return `/${LOCALE}${localized === '/' ? '' : localized}`;
}

/** Routes backed by a `page.dev.tsx`, absent from the production build audited here. */
const DEV_ONLY_ROUTES: readonly RouteKey[] = ['/design-system'];

/** Every public route of the site in the audited locale, plus a missing page. */
export const ROUTES: string[] = [
  ...(Object.keys(routing.pathnames) as RouteKey[])
    .filter((route) => !DEV_ONLY_ROUTES.includes(route))
    .map(localizedUrl),
  `/${LOCALE}/cette-page-n-existe-pas`,
];

/** Stores the theme and a refused analytics consent before any script runs, as a returning visitor.
 *  An existing choice is kept, so a reload shows what the visitor picked with the toggle. */
export async function asReturningVisitor(context: BrowserContext, theme: Theme) {
  await context.addInitScript((choice) => {
    if (!localStorage.getItem('cs-theme')) localStorage.setItem('cs-theme', choice);
    localStorage.setItem('gocosmic.analytics-consent', 'refused');
  }, theme);
}
