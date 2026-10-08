import { type RefObject, useEffect, useState } from 'react';

/** `Space Grotesk 600 · 56px / 56px · -1.68px` from a computed style. */
export const describeType = (style: CSSStyleDeclaration): string => {
  const family = style.fontFamily.split(',')[0]?.replaceAll(/["']/g, '').trim() || 'inherit';
  return `${family} ${style.fontWeight} · ${style.fontSize} / ${style.lineHeight} · ${style.letterSpacing}`;
};

/**
 * Computed typography of the first element matching `selector` inside `ref`, read after mount so
 * the page shows what the browser really renders next to the expected spec.
 */
export function useComputedType(ref: RefObject<HTMLElement | null>, selector: string): string | null {
  const [computed, setComputed] = useState<string | null>(null);

  useEffect(() => {
    const target = ref.current?.querySelector(selector);
    if (target) setComputed(describeType(getComputedStyle(target)));
  }, [ref, selector]);

  return computed;
}
