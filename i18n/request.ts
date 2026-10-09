import { headers } from 'next/headers';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { getLanguage } from './locales';
import { routing } from './routing';
import { toSwissSpelling } from './swiss-spelling';

/**
 * Namespaces of each route, on top of the shared ones (common, navigation, footer). Slugs come from
 * `routing.pathnames`. Most specific first: `/projects/psc-supersprint` must win over `/projects`.
 */
const ROUTE_NAMESPACES: [keyof typeof routing.pathnames, string[]][] = [
  ['/about', ['about']],
  // Services & pricing embeds the subscription simulator.
  ['/services', ['services', 'pricing']],
  // The local page reuses the homepage's facts and audiences, and shows the latest project cards.
  ['/local', ['local', 'home', 'projects']],
  // The case study template needs the project titles for its prev/next links.
  ['/projects/psc-supersprint', ['psc-supersprint', 'projects']],
  ['/projects', ['projects']],
  ['/contact', ['contact']],
  ['/privacy', ['legal']],
  ['/legal-notice', ['legal']],
  ['/terms', ['legal']],
  ['/free-mockup', ['free-mockup']],
];

/** Namespaces a pathname needs, e.g. `/fr-ch/a-propos` → `['about']`. Unknown routes get the homepage's. */
export const getNamespacesForPath = (pathname: string): string[] => {
  // Remove locale prefix (e.g., /en/about -> /about, /fr-ch/a-propos -> /a-propos)
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|es|de|it)(-ch)?(?=\/|$)/, '');

  // The homepage also shows the pricing columns and the latest project cards.
  if (pathWithoutLocale === '/' || pathWithoutLocale === '') return ['home', 'pricing', 'projects'];

  const match = ROUTE_NAMESPACES.find(([route]) =>
    Object.values(routing.pathnames[route]).some((slug) => pathWithoutLocale.startsWith(slug))
  );

  return match?.[1] ?? ['home'];
};

/**
 * Load translation messages organized by namespace.
 * Only loads namespaces needed for the current route for optimal performance.
 * A Swiss locale reads its language's files, in Swiss spelling for German.
 */
async function loadMessages(locale: string, namespaces: string[]) {
  const language = getLanguage(locale);
  // Always load common, navigation, and footer (shared across all pages)
  const sharedNamespaces = ['common', 'navigation', 'footer'];
  const allNamespaces = [...new Set([...sharedNamespaces, ...namespaces])];

  const messages: Record<string, unknown> = {};

  // Load each namespace dynamically
  for (const namespace of allNamespaces) {
    try {
      const namespaceMessages = await import(`../messages/${language}/${namespace}.json`);
      Object.assign(messages, namespaceMessages.default);
    } catch {
      console.warn(`Failed to load namespace ${namespace} for locale ${locale}`);
    }
  }

  return locale === 'de-CH' ? toSwissSpelling(messages) : messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the current pathname from headers set by proxy
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  // Determine which namespaces to load based on the route
  const namespaces = getNamespacesForPath(pathname);

  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale, namespaces),
  };
});
