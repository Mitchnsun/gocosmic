import { describe, expect, it } from 'vitest';

import {
  getLanguage,
  getLocalePrefix,
  isSwissLocale,
  LANGUAGES,
  LOCALE_PREFIXES,
  LOCALES,
  localeWithLanguage,
  normalizeAcceptLanguage,
  SWISS_LOCALES,
} from '@/i18n/locales';

describe('locales', () => {
  it('offers every language in a Swiss variant too', () => {
    expect(SWISS_LOCALES).toEqual(LANGUAGES.map((language) => `${language}-CH`));
    expect(LOCALES).toEqual([...LANGUAGES, ...SWISS_LOCALES]);
  });

  it('tells Swiss locales from language-only ones', () => {
    expect(isSwissLocale('fr-CH')).toBe(true);
    expect(isSwissLocale('de-CH')).toBe(true);
    expect(isSwissLocale('fr')).toBe(false);
    expect(isSwissLocale('fr-ch')).toBe(false);
    expect(isSwissLocale('fr-BE')).toBe(false);
  });
});

describe('getLanguage', () => {
  it('returns the language of a locale', () => {
    expect(getLanguage('fr')).toBe('fr');
    expect(getLanguage('fr-CH')).toBe('fr');
    expect(getLanguage('it-CH')).toBe('it');
  });

  it('falls back to English for an unknown language', () => {
    expect(getLanguage('ja')).toBe('en');
    expect(getLanguage('')).toBe('en');
  });
});

describe('localeWithLanguage', () => {
  it('stays on the language-only locales from a language-only one', () => {
    expect(localeWithLanguage('fr', 'de')).toBe('de');
    expect(localeWithLanguage('en', 'en')).toBe('en');
  });

  it('stays in Switzerland from a Swiss locale', () => {
    expect(localeWithLanguage('fr-CH', 'de')).toBe('de-CH');
    expect(localeWithLanguage('de-CH', 'fr')).toBe('fr-CH');
    expect(localeWithLanguage('it-CH', 'it')).toBe('it-CH');
  });
});

describe('getLocalePrefix', () => {
  it('writes the locale in lowercase', () => {
    expect(getLocalePrefix('fr')).toBe('/fr');
    expect(getLocalePrefix('fr-CH')).toBe('/fr-ch');
  });

  it('lists a prefix for the Swiss locales only', () => {
    expect(LOCALE_PREFIXES).toEqual({
      'en-CH': '/en-ch',
      'fr-CH': '/fr-ch',
      'es-CH': '/es-ch',
      'de-CH': '/de-ch',
      'it-CH': '/it-ch',
    });
  });
});

describe('normalizeAcceptLanguage', () => {
  it('drops regions other than Switzerland', () => {
    expect(normalizeAcceptLanguage('de-AT,de;q=0.9,en;q=0.8')).toBe('de,de;q=0.9,en;q=0.8');
    expect(normalizeAcceptLanguage('en-GB')).toBe('en');
    expect(normalizeAcceptLanguage('fr-BE, fr;q=0.9')).toBe('fr,fr;q=0.9');
    expect(normalizeAcceptLanguage('zh-Hant-TW')).toBe('zh');
  });

  it('keeps the Swiss region, whatever its case or position', () => {
    expect(normalizeAcceptLanguage('fr-CH,fr;q=0.9,en;q=0.8')).toBe('fr-CH,fr;q=0.9,en;q=0.8');
    expect(normalizeAcceptLanguage('de-ch')).toBe('de-CH');
    expect(normalizeAcceptLanguage('gsw-CH;q=0.7')).toBe('gsw-CH;q=0.7');
    expect(normalizeAcceptLanguage('de-Latn-CH')).toBe('de-CH');
  });

  it('leaves bare languages alone and drops what is not a language, such as the wildcard', () => {
    expect(normalizeAcceptLanguage('it')).toBe('it');
    expect(normalizeAcceptLanguage('fr, *;q=0.5')).toBe('fr');
    expect(normalizeAcceptLanguage('*')).toBe('');
  });

  it('turns every language Swiss for a visitor located in Switzerland, with Swiss English as a last resort', () => {
    expect(normalizeAcceptLanguage('fr-FR,fr;q=0.9,en;q=0.8', true)).toBe('fr-CH,fr-CH;q=0.9,en-CH;q=0.8,en-CH;q=0.01');
    expect(normalizeAcceptLanguage('zh-CN', true)).toBe('zh-CH,en-CH;q=0.01');
    expect(normalizeAcceptLanguage('*', true)).toBe('en-CH;q=0.01');
    expect(normalizeAcceptLanguage('', true)).toBe('en-CH;q=0.01');
  });
});
