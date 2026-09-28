import type { CSSProperties } from 'react';

import { cn } from '@/design-system/lib/utils';

interface SunCssProperties extends CSSProperties {
  '--sun-intensity': number;
}

export interface SunProps {
  /** Diameter, any CSS length. Defaults to the hero size: 56vw, capped at 700 px. */
  size?: string;
  /** Strength of the halo, from 0 to 1. Defaults to 1. */
  intensity?: number;
  /** Slow breathing of the halo (3.5 s). Never runs under reduced motion. Defaults to `false`. */
  pulse?: boolean;
  /** Positioning classes, e.g. `absolute -top-[38%] -right-[6%]`. */
  className?: string;
}

/**
 * The light theme's sun: a warm radial disc and its halo, pure CSS (two layers, no canvas, no
 * filter), decorative only. Use it in the hero and the closing call-to-action, never twice on a page.
 */
export function Sun({ size = 'min(56vw, 700px)', intensity = 1, pulse = false, className }: SunProps) {
  const style: SunCssProperties = { width: size, '--sun-intensity': intensity };

  return (
    <div className={cn('pointer-events-none relative aspect-square', className)} style={style} aria-hidden="true">
      <div className="sun-disc absolute inset-0 rounded-full" />
      <div className={cn('sun-halo absolute inset-0 rounded-full', { 'animate-planet-glow': pulse })} />
    </div>
  );
}
