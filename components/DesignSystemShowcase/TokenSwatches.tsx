import { contrastRatio, over, parseColor, toHex } from '@/design-system/lib/contrast';
import { cn } from '@/design-system/lib/utils';
import { DESIGN_TOKENS, type ThemeFace, tokenValue } from '@/design-system/tokens';

import { ContrastBadge } from './ContrastBadge';

/** Value of a token in a theme; every `readOn` points to a listed token (checked by the tokens test). */
const valueOf = (name: string, theme: ThemeFace) => {
  const token = DESIGN_TOKENS.find((candidate) => candidate.name === name);
  return token ? tokenValue(token, theme) : '';
};

/** One swatch per semantic token, painted by the token itself, with its value and WCAG ratio in `theme`. */
export function TokenSwatches({ theme }: { theme: ThemeFace }) {
  const background = parseColor(valueOf('bg', theme));

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
      {DESIGN_TOKENS.map((token) => {
        const { name, swatch, role, readOn } = token;
        const value = tokenValue(token, theme);
        const resolved = toHex(over(parseColor(value), background));
        return (
          <li key={name} className="text-2xs flex flex-col gap-1.5">
            <span className={cn('border-line-2 mb-1 h-14 rounded-xl border', swatch)} aria-hidden="true" />
            <code className="text-fg font-mono text-xs">{name}</code>
            <span className="text-fg-2">{role}</span>
            <code className="text-fg-3 font-mono">{value === resolved ? value : `${value} → ${resolved}`}</code>
            {readOn && (
              <span className="text-fg-3">
                on {readOn}: <ContrastBadge ratio={contrastRatio(value, valueOf(readOn, theme))} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
