'use client';

import { RefObject, useEffect } from 'react';

export interface MagneticSelector {
  /** CSS selector for elements to mark as magnetic */
  selector: string;
  /** Accent color name to apply when snapping */
  accent?: string;
}

/**
 * Hook that marks elements inside a container as magnetic for the CosmicCursor.
 *
 * Adds `data-magnetic` and optionally `data-accent` to matched elements on mount.
 * Attributes are removed on cleanup.
 *
 * @param selectors - Array of { selector, accent } config objects
 * @returns A React ref to attach to the container element
 *
 * @example
 * const ref = useMagneticElements([{ selector: 'button.cta', accent: 'aerospace' }]);
 * return <section ref={ref}>...</section>;
 */
export function useMagneticElements(selectors: MagneticSelector[]): RefObject<HTMLElement | null> {
  const containerRef: RefObject<HTMLElement | null> = { current: null };

  useEffect(() => {
    const container = containerRef.current ?? document;
    const applied: Element[] = [];

    for (const { selector, accent } of selectors) {
      for (const el of container.querySelectorAll(selector)) {
        el.setAttribute('data-magnetic', '');
        if (accent) el.setAttribute('data-accent', accent);
        applied.push(el);
      }
    }

    return () => {
      for (const el of applied) {
        el.removeAttribute('data-magnetic');
        el.removeAttribute('data-accent');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return a stable ref object so callers can attach it to a container
  return containerRef as RefObject<HTMLElement | null>;
}
