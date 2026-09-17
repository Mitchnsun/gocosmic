'use client';

import { useCallback, useEffect, useRef } from 'react';

/** Represents a single trailing dot position */
export interface TrailPoint {
  x: number;
  y: number;
}

/** State managed by the cosmic cursor hook */
export interface CosmicCursorState {
  /** Current mouse position */
  mouse: { x: number; y: number };
  /** True when mouse is on the page */
  isVisible: boolean;
  /** True when reduced motion is preferred */
  reducedMotion: boolean;
  /** True on touch-only devices (no custom cursor) */
  isTouchDevice: boolean;
  /** Trailing dot history */
  trail: TrailPoint[];
  /** Current accent color hex (reacts to data-accent) */
  accentColor: string;
  /** True when snapping toward a magnetic element */
  isMagnetic: boolean;
  /** True when hovering a form control that shows its own native cursor (text caret, hand, grab…) — hide the canvas dot */
  usesNativeCursor: boolean;
}

export interface UseCosmicCursorOptions {
  trailLength?: number;
  magneticRange?: number;
  magneticEase?: number;
}

const COLORS = {
  aerospace: '#FF4F00',
  royal: '#7851A9',
  jungle: '#29AB87',
} as const;

type AccentKey = keyof typeof COLORS;

function resolveAccent(key: string | null): string {
  if (key && key in COLORS) return COLORS[key as AccentKey];
  return COLORS.aerospace;
}

/**
 * Apply magnetic snapping toward an element center.
 *
 * The positional pull is only applied when the pointer is within `range` of the element's
 * center. Without this guard, a wide element (e.g. a full-row link) would drag the drawn
 * cursor far from the pointer toward its center — the accent color and magnetic ring still
 * activate outside `range` so hovering the element remains visible, just without moving the
 * cursor away from what the user is actually pointing at.
 */
function applySnap(
  state: CosmicCursorState,
  rect: DOMRect,
  rawX: number,
  rawY: number,
  ease: number,
  range: number,
  accent: string | null
) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.sqrt((cx - rawX) ** 2 + (cy - rawY) ** 2);
  if (dist < range) {
    state.mouse.x += (cx - rawX) * ease;
    state.mouse.y += (cy - rawY) * ease;
  }
  state.accentColor = resolveAccent(accent);
  state.isMagnetic = true;
}

/**
 * Hook that tracks mouse position, accent color, and magnetic snapping.
 * Returns a ref to the mutable state object so the canvas render loop can read it
 * without triggering React re-renders.
 */
export function useCosmicCursor({
  trailLength = 8,
  magneticRange = 80,
  magneticEase = 0.15,
}: UseCosmicCursorOptions = {}) {
  const stateRef = useRef<CosmicCursorState>({
    mouse: { x: -200, y: -200 },
    isVisible: false,
    reducedMotion: false,
    isTouchDevice: false,
    trail: [],
    accentColor: COLORS.aerospace,
    isMagnetic: false,
    usesNativeCursor: false,
  });

  // Ref holding magnetic element list — populated at mount and on DOM mutations
  const magneticElementsRef = useRef<Element[]>([]);

  useEffect(() => {
    const state = stateRef.current;

    // Detect touch-only device
    state.isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (state.isTouchDevice) return;

    // Detect reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    state.reducedMotion = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => {
      state.reducedMotion = e.matches;
    };
    mq.addEventListener('change', onMqChange);

    // Cache of element → last measured bounding rect, invalidated on scroll/resize/DOM change
    const rectCache = new Map<Element, DOMRect>();
    const invalidateRectCache = () => rectCache.clear();

    // Scan magnetic elements
    const scanMagnetic = () => {
      magneticElementsRef.current = Array.from(document.querySelectorAll('[data-magnetic]'));
      // Invalidate rect cache when the element list changes
      rectCache.clear();
    };
    scanMagnetic();

    window.addEventListener('scroll', invalidateRectCache, { passive: true });
    window.addEventListener('resize', invalidateRectCache, { passive: true });

    // Observe DOM mutations to keep the magnetic list fresh.
    // Also watch attribute changes so that elements marked by useMagneticElements
    // (or declaratively via data-magnetic) are picked up without a full DOM insertion.
    const observer = new MutationObserver(scanMagnetic);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-magnetic', 'data-accent'],
    });

    // Trail initialization
    state.trail = Array.from({ length: trailLength }, () => ({ x: -200, y: -200 }));

    const onMouseMove = (e: MouseEvent) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
      state.isVisible = true;

      // Guard: EventTarget is not guaranteed to be an Element (could be a text node or Document).
      // All Element-only APIs below are safe only after this check.
      const target = e.target;
      const isElement = target instanceof Element;

      // Detect elements that show their own native cursor (text caret, hand, grab…) so the
      // canvas dot doesn't draw on top of it — the CSS in CosmicCursor.tsx picks which cursor
      // each of these actually gets. `[role="slider"]` covers Radix Slider thumbs, which render
      // as a plain div rather than a native `input[type="range"]`.
      state.usesNativeCursor =
        isElement &&
        (target.tagName.toLowerCase() === 'input' ||
          target.tagName.toLowerCase() === 'textarea' ||
          target.tagName.toLowerCase() === 'select' ||
          target.getAttribute('contenteditable') === 'true' ||
          target.closest('[role="slider"]') !== null);

      // Magnetic detection — scan [data-magnetic] elements and find the closest
      // Use cached rects (invalidated on scroll/resize) to avoid layout thrashing
      let closestDist = Infinity;
      let closestEl: Element | null = null;
      let closestRect: DOMRect | null = null;

      for (const el of magneticElementsRef.current) {
        let rect = rectCache.get(el);
        if (!rect) {
          rect = el.getBoundingClientRect();
          rectCache.set(el, rect);
        }
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        if (dist < closestDist) {
          closestDist = dist;
          closestEl = el;
          closestRect = rect;
        }
      }

      if (closestEl && closestRect && closestDist < magneticRange) {
        // Explicit [data-magnetic] element: snap and change accent
        applySnap(
          state,
          closestRect,
          e.clientX,
          e.clientY,
          magneticEase,
          magneticRange,
          closestEl.getAttribute('data-accent')
        );
      } else {
        state.isMagnetic = false;
        state.accentColor = COLORS.aerospace;

        // Auto-magnetic for <a> and <button> — apply snapping for consistency
        if (isElement) {
          const closest = target.closest('a, button');
          if (closest) {
            const rect = closest.getBoundingClientRect();
            applySnap(
              state,
              rect,
              e.clientX,
              e.clientY,
              magneticEase,
              magneticRange,
              closest.getAttribute('data-accent')
            );
          }
        }
      }
    };

    const onMouseLeave = () => {
      state.isVisible = false;
    };
    const onMouseEnter = () => {
      state.isVisible = true;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('scroll', invalidateRectCache);
      window.removeEventListener('resize', invalidateRectCache);
      mq.removeEventListener('change', onMqChange);
      observer.disconnect();
    };
  }, [trailLength, magneticRange, magneticEase]);

  /** Update the trail queue — called each animation frame */
  const updateTrail = useCallback(() => {
    const state = stateRef.current;
    if (state.trail.length === 0) return;
    // Shift: oldest point becomes newest
    state.trail.shift();
    state.trail.push({ x: state.mouse.x, y: state.mouse.y });
  }, []);

  return { stateRef, updateTrail };
}
