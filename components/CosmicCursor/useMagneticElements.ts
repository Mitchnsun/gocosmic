'use client';

import { RefObject, useEffect, useRef } from 'react';

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
 * The `selectors` array is intentionally read only on mount — marking elements as
 * magnetic is a one-time setup operation and does not need to re-run on every render.
 *
 * @param selectors - Array of { selector, accent } config objects
 * @returns A React ref to attach to the container element
 *
 * @example
 * const ref = useMagneticElements([{ selector: 'button.cta', accent: 'aerospace' }]);
 * return <section ref={ref}>...</section>;
 */
export function useMagneticElements(selectors: MagneticSelector[]): RefObject<HTMLElement | null> {
  const containerRef = useRef<HTMLElement | null>(null);

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
    // selectors is intentionally excluded — magnetic marking is a one-time mount operation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
