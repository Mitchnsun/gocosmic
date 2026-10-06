import { describe, expect, it } from 'vitest';

import { DESIGN_TOKENS } from '@/design-system/tokens';

import { THEME_TOKENS } from './globals-css';

describe('DESIGN_TOKENS', () => {
  describe.each(Object.entries(THEME_TOKENS))('%s theme', (theme, variables) => {
    it.each(DESIGN_TOKENS.map((token) => [token.name, token] as const))(
      '%s matches its --t-* variable in globals.css',
      (name, token) => {
        expect(token.values[theme as 'dark' | 'light']).toBe(variables.get(name));
      }
    );

    it('lists every semantic variable of the theme', () => {
      expect(DESIGN_TOKENS.map(({ name }) => name).sort()).toEqual([...variables.keys()].sort());
    });
  });

  it('reads each text token on another listed token', () => {
    const names = new Set(DESIGN_TOKENS.map(({ name }) => name));
    for (const { readOn } of DESIGN_TOKENS) {
      if (readOn) expect(names).toContain(readOn);
    }
  });
});
