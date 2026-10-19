/* eslint-disable security/detect-non-literal-fs-filename -- reads the repository's own message files */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { vi } from 'vitest';

import { LANGUAGES } from '@/i18n/locales';
import requestConfig, { NAMESPACES, PARTIAL_NAMESPACES } from '@/i18n/request';

vi.mock('next-intl/server', () => ({ getRequestConfig: (config: unknown) => config }));

interface Config {
  locale: string;
  messages: Record<string, Record<string, unknown>>;
}
const MESSAGES_DIR = path.join(process.cwd(), 'messages');

/** Message files of a language, without their extension. */
const filesOf = (language: string) =>
  readdirSync(path.join(MESSAGES_DIR, language)).map((file) => path.basename(file, '.json'));

/** Files that exist in a language only because a page is published in it. */
const partialFilesOf = (language: string) =>
  Object.entries(PARTIAL_NAMESPACES)
    .filter(([, languages]) => languages.includes(language as (typeof LANGUAGES)[number]))
    .map(([namespace]) => namespace);

const loadConfig = requestConfig as unknown as (params: {
  requestLocale: Promise<string | undefined>;
}) => Promise<Config>;

describe('request config', () => {
  it('lists every message file', () => {
    expect([...NAMESPACES].sort()).toEqual(filesOf('en').sort());
  });

  it.each(LANGUAGES)('finds in %s the shared files, plus those of its own pages', (language) => {
    expect(filesOf(language).sort()).toEqual([...NAMESPACES, ...partialFilesOf(language)].sort());
  });

  it('loads the files of a page published in some languages only in those languages', async () => {
    const swiss = await loadConfig({ requestLocale: Promise.resolve('fr-CH') });
    const german = await loadConfig({ requestLocale: Promise.resolve('de') });

    expect(swiss.messages.contentPages).toBeDefined();
    expect(german.messages.contentPages).toBeUndefined();
  });

  // The server merges every file into one object, so a top-level key in two files would overwrite the other.
  it.each(LANGUAGES)('never repeats in %s a top-level key of a shared file', async (language) => {
    const { messages } = await loadConfig({ requestLocale: Promise.resolve(language) });
    const sharedKeys = new Set(Object.keys((await loadConfig({ requestLocale: Promise.resolve('en') })).messages));

    for (const namespace of partialFilesOf(language)) {
      const file = JSON.parse(readFileSync(path.join(MESSAGES_DIR, language, `${namespace}.json`), 'utf8')) as object;
      for (const key of Object.keys(file)) {
        expect(sharedKeys.has(key), `${key} in ${namespace}`).toBe(false);
        expect(messages).toHaveProperty(key);
      }
    }
  });

  it('loads every namespace, whatever the page', async () => {
    const { locale, messages } = await loadConfig({ requestLocale: Promise.resolve('fr-CH') });

    expect(locale).toBe('fr-CH');
    expect(Object.keys(messages)).toEqual(
      expect.arrayContaining(['navigation', 'homepage', 'about', 'services', 'pricing', 'contact', 'legal'])
    );
    // Each page keeps its own title: the shared `meta` is the homepage's.
    expect(messages.about?.meta).not.toEqual(messages.meta);
  });

  it('falls back to the default locale on an unknown one', async () => {
    const { locale } = await loadConfig({ requestLocale: Promise.resolve('pt') });

    expect(locale).toBe('en');
  });

  it('spells Swiss German without the sharp s', async () => {
    const { messages } = await loadConfig({ requestLocale: Promise.resolve('de-CH') });

    expect(JSON.stringify(messages)).not.toContain('ß');
  });
});
