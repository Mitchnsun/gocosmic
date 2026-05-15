'use client';

import { RefObject, useEffect, useRef } from 'react';

export interface MagneticSelector {
  /** CSS selector for elements to mark as magnetic */
  selector: string;
  /** Accent color name to apply when snapping */
  accent?: string;
}

/** Per-element record of the original attribute state before this hook modified it */
interface ElementRecord {
  hadMagnetic: boolean;
  prevAccent: string | null;
}

/**
 * Hook that marks elements inside a container as magnetic for the CosmicCursor.
 *
 * Adds `data-magnetic` and optionally `data-accent` to matched elements on mount.
 * On cleanup the hook restores each element's original attribute state — if an element
 * already had `data-magnetic` or `data-accent` before this hook ran, those values are
 * preserved rather than unconditionally removed.
 *
 * The `selectors` array is intentionally read only on mount — marking elements as
 * magnetic is a one-time setup operation and does not need to re-run on every render.
 *
 * When the ref is not attached to a container element, the hook falls back to
 * querying the entire document. This is intentional: it allows callers to use
 * useMagneticElements without a container ref when they want global magnetic marking.
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

    // Capture each element's original attribute state before we make any changes.
    // We only record an element once (its state before the first selector matches it).
    const records = new Map<Element, ElementRecord>();

    for (const { selector, accent } of selectors) {
      for (const el of container.querySelectorAll(selector)) {
        if (!records.has(el)) {
          records.set(el, {
            hadMagnetic: el.hasAttribute('data-magnetic'),
            prevAccent: el.getAttribute('data-accent'),
          });
        }
        el.setAttribute('data-magnetic', '');
        if (accent) el.setAttribute('data-accent', accent);
      }
    }

    return () => {
      for (const [el, { hadMagnetic, prevAccent }] of records) {
        // Only remove data-magnetic if this hook added it
        if (!hadMagnetic) {
          el.removeAttribute('data-magnetic');
        }
        // Restore data-accent to original value; only touch it when the current
        // value differs from what was there before
        const currentAccent = el.getAttribute('data-accent');
        if (currentAccent !== prevAccent) {
          if (prevAccent !== null) {
            el.setAttribute('data-accent', prevAccent);
          } else {
            el.removeAttribute('data-accent');
          }
        }
      }
    };
    // selectors is intentionally excluded — magnetic marking is a one-time mount operation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
