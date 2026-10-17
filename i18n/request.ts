import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { getLanguage, type Language } from './locales';
import { routing } from './routing';
import { toSwissSpelling } from './swiss-spelling';

/**
 * Every message file under `messages/<language>/`. The server loads them all, so that pages can be rendered at
 * build time without knowing which route asked; the browser only receives what a page declares (see
 * `getClientMessages`). Top-level keys must therefore be unique across files.
 */
export const NAMESPACES = [
  'common',
  'navigation',
  'footer',
  'home',
  'about',
  'story',
  'services',
  'pricing',
  'pricing-page',
  'projects',
  'psc-supersprint',
  'local',
  'contact',
  'free-mockup',
  'legal',
] as const;

/**
 * Message files that exist in some languages only: those of the pages published in these languages
 * (`ROUTE_LANGUAGES`), and the labels that link to them. The other languages never load them.
 */
export const PARTIAL_NAMESPACES: Record<string, readonly Language[]> = {
  'content-pages': ['fr'],
};

/**
 * Load translation messages organized by namespace.
 * A Swiss locale reads its language's files, in Swiss spelling for German.
 */
async function loadMessages(locale: string) {
  const language = getLanguage(locale);
  const messages: Record<string, unknown> = {};
  const partial = Object.entries(PARTIAL_NAMESPACES)
    .filter(([, languages]) => languages.includes(language))
    .map(([namespace]) => namespace);

  // Load each namespace dynamically
  for (const namespace of [...NAMESPACES, ...partial]) {
    try {
      const namespaceMessages = (await import(`../messages/${language}/${namespace}.json`)) as {
        default: Record<string, unknown>;
      };
      Object.assign(messages, namespaceMessages.default);
    } catch {
      console.warn(`Failed to load namespace ${namespace} for locale ${locale}`);
    }
  }

  return locale === 'de-CH' ? toSwissSpelling(messages) : messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
