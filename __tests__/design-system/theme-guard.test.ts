/* eslint-disable security/detect-non-literal-fs-filename -- walks the repository's own source tree */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Raw theme colours (ghost, void, cosmic-latte, ember, misty-rose as hex or RGB channels) must not
 * come back in component code: they would stay put when the theme switches. Classes are guarded by
 * ESLint; this catches inline styles, canvas colours and string constants. Each exception below is
 * a colour that is meant to stay fixed.
 */
const RAW_THEME_COLOUR =
  /248[\s,_]+248[\s,_]+255|#f8f8ff|\b2[\s,_]+6[\s,_]+23\b|#020617|#fff8e7|255[\s,_]+248[\s,_]+231|#1c1012|#ffe4e1/i;

const ALLOWED: Record<string, string> = {
  'components/Starfield/Starfield.tsx': 'the canvas paints its own sky: void, or cosmic-latte for the light tone',
  'components/CosmicCursor/CosmicCursor.tsx': 'per-theme trail colours, picked from the resolved theme',
  'components/Theme/Theme.constants.ts': 'browser chrome colour per theme',
  'components/FreeMockupForm/FreeMockupForm.utils.ts': 'palette swatches are content, not theme colours',
  'design-system/accent.ts': "RGB channels of the 'ghost' accent, kept for inline glows",
};

const ROOTS = ['app', 'components', 'design-system', 'lib'];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });

describe('theme colour guard', () => {
  const offenders = ROOTS.flatMap(sourceFiles)
    .map((file) => file.split(path.sep).join('/'))
    .filter((file) => !(file in ALLOWED))
    .filter((file) => RAW_THEME_COLOUR.test(readFileSync(file, 'utf8')));

  it('keeps raw theme colours out of components, outside the documented exceptions', () => {
    expect(offenders).toEqual([]);
  });

  it('only lists exceptions that still exist', () => {
    for (const file of Object.keys(ALLOWED)) {
      expect(RAW_THEME_COLOUR.test(readFileSync(file, 'utf8')), file).toBe(true);
    }
  });
});
