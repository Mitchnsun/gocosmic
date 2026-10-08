'use client';

import Starfield, { type StarfieldProps } from '@/components/Starfield';
import { useResolvedTheme } from '@/components/Theme';

/**
 * Starfield for the dark theme only, as a full-bleed layer at `-z-20`. The `light:` CSS variant hides
 * it from the first paint, then it unmounts in the light theme so its animation loop stops.
 */
export default function NightStarfield(props: StarfieldProps) {
  if (useResolvedTheme() === 'light') return null;

  return (
    <div className="light:hidden absolute inset-0 -z-20" aria-hidden="true">
      <Starfield {...props} />
    </div>
  );
}
