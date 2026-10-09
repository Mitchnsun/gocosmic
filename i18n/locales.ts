// Relative imports only: `next.config.ts` loads this module (through `routing.ts`) before path aliases exist.

/** Languages the site is translated into; each one has its own message files under `messages/`. */
export const LANGUAGES = ['en', 'fr', 'es', 'de', 'it'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Swiss variant of every language, served under its own URL (`/fr-ch`, `/de-ch`…) and always shown with the
 * Swiss region: the Geneva base and Swiss francs. Language-only locales (`/fr`) always show the default region,
 * so each version has a stable URL for search engines to index. They share their language's messages and
 * translated slugs.
 */
export const SWISS_LOCALES = [
  'en-CH',
  'fr-CH',
  'es-CH',
  'de-CH',
  'it-CH',
] as const satisfies readonly `${Language}-CH`[];
export type SwissLocale = (typeof SWISS_LOCALES)[number];

export const LOCALES = [...LANGUAGES, ...SWISS_LOCALES] as const;
export type Locale = (typeof LOCALES)[number];

export function isSwissLocale(locale: string): locale is SwissLocale {
  return (SWISS_LOCALES as readonly string[]).includes(locale);
}

/** Language of a locale, e.g. `fr-CH` → `fr`; anything unknown falls back to the default language. */
export function getLanguage(locale: string): Language {
  const language = locale.split('-')[0];
  return LANGUAGES.find((candidate) => candidate === language) ?? DEFAULT_LANGUAGE;
}

/** The locale showing a language in the same region as `locale`, e.g. (`fr-CH`, `de`) → `de-CH`. */
export function localeWithLanguage(locale: string, language: string): Locale {
  const target = getLanguage(language);
  return isSwissLocale(locale) ? `${target}-CH` : target;
}

/** URL prefix of a locale, lowercase like the rest of the URL, e.g. `fr-CH` → `/fr-ch`. */
export function getLocalePrefix(locale: string): string {
  return `/${locale.toLowerCase()}`;
}

/** URL prefixes that differ from the locale itself: the Swiss ones. */
export const LOCALE_PREFIXES = Object.fromEntries(
  SWISS_LOCALES.map((locale) => [locale, getLocalePrefix(locale)])
) as Record<SwissLocale, string>;

/**
 * `Accept-Language` reduced to what locale detection should act on: the language of each entry, with the Swiss
 * region kept, or added to every language for a visitor located in Switzerland. Detection favours regional
 * locales, so `de-AT` or `en-GB` would otherwise land on the Swiss version; this way only a visitor in
 * Switzerland or a browser set to a Swiss locale (`fr-CH`, `gsw-CH`) does.
 */
export function normalizeAcceptLanguage(header: string, inSwitzerland = false): string {
  return header
    .split(',')
    .map((entry) => {
      const [range = '', ...params] = entry.trim().split(';');
      const [language = '', ...subtags] = range.trim().split('-');
      // A language subtag has two or three letters; the `*` wildcard stays as is.
      const isLanguage = /^[a-z]{2,3}$/i.test(language);
      const isSwiss = isLanguage && (inSwitzerland || subtags.some((subtag) => subtag.toUpperCase() === 'CH'));
      return [isSwiss ? `${language}-CH` : language, ...params].join(';');
    })
    .join(',');
}
