/* eslint-disable security/detect-non-literal-fs-filename -- reads the repository's own message files */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { LANGUAGES } from '@/i18n/locales';

/**
 * Every language must offer the same message keys, with the same `{placeholders}`, as the English
 * files: a missing key only shows up at runtime, on the page that needs it. Arrays (tags, legal
 * paragraphs) are compared as single values, since their length may differ between languages.
 * Swiss locales read their language's files, so they have none of their own.
 */
const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const REFERENCE = 'en';
const OTHER_LOCALES = LANGUAGES.filter((language) => language !== REFERENCE);
const NAMESPACES = readdirSync(path.join(MESSAGES_DIR, REFERENCE)).filter((file) => file.endsWith('.json'));

/** ICU argument names: `{price}`, `{count, plural, …}`. Plural branches (`{# box}`) are skipped. */
const PLACEHOLDER = /\{(\w+)\s*[,}]/g;

const readMessages = (locale: string, file: string): unknown =>
  JSON.parse(readFileSync(path.join(MESSAGES_DIR, locale, file), 'utf8'));

/** Flattens a message tree into `key → sorted placeholder names`. */
function describeMessages(value: unknown, prefix = '', out = new Map<string, string>()): Map<string, string> {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) describeMessages(child, prefix ? `${prefix}.${key}` : key, out);
    return out;
  }
  const text = typeof value === 'string' ? value : '';
  const names = [...new Set([...text.matchAll(PLACEHOLDER)].map((match) => match[1]))].sort();
  out.set(prefix, names.join(','));
  return out;
}

describe('message files', () => {
  it.each(NAMESPACES)('%s exists in every locale', (file) => {
    for (const locale of OTHER_LOCALES) {
      expect(readdirSync(path.join(MESSAGES_DIR, locale)), locale).toContain(file);
    }
  });

  describe.each(OTHER_LOCALES)('%s', (locale) => {
    it.each(NAMESPACES)('%s has the same keys and placeholders as English', (file) => {
      const reference = describeMessages(readMessages(REFERENCE, file));
      const translated = describeMessages(readMessages(locale, file));

      expect([...translated.keys()].sort()).toEqual([...reference.keys()].sort());
      for (const [key, placeholders] of reference) {
        expect(translated.get(key), `${file} › ${key}`).toBe(placeholders);
      }
    });
  });
});
