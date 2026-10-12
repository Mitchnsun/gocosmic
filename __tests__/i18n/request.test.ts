/* eslint-disable security/detect-non-literal-fs-filename -- reads the repository's own message files */
import { readdirSync } from 'node:fs';
import path from 'node:path';

import { vi } from 'vitest';

import requestConfig, { NAMESPACES } from '@/i18n/request';

vi.mock('next-intl/server', () => ({ getRequestConfig: (config: unknown) => config }));

interface Config {
  locale: string;
  messages: Record<string, Record<string, unknown>>;
}
const loadConfig = requestConfig as unknown as (params: {
  requestLocale: Promise<string | undefined>;
}) => Promise<Config>;

describe('request config', () => {
  it('lists every message file', () => {
    const files = readdirSync(path.join(process.cwd(), 'messages', 'en')).map((file) => path.basename(file, '.json'));

    expect([...NAMESPACES].sort()).toEqual(files.sort());
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
