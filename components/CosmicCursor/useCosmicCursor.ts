'use client';

import { useCallback, useEffect, useRef } from 'react';

import type { Theme } from '@/components/Theme';

/** Matches when the primary pointer is not a precise one such as a mouse or trackpad. */
export const COARSE_POINTER_QUERY = 'not all and (pointer: fine)';

/** Represents a single trailing dot position */
interface TrailPoint {
  x: number;
  y: number;
}

/** State managed by the cosmic cursor hook */
interface CosmicCursorState {
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
  /** Current accent color hex */
  accentColor: string;
  /** True when snapping toward a link or a button */
  isMagnetic: boolean;
  /** True when hovering a form control that shows its own native cursor (text caret, hand, grab…) — hide the canvas dot */
  usesNativeCursor: boolean;
  /** Theme of the surface under the pointer: the page theme, or `dark` over a dark island */
  surfaceTheme: Theme;
}

/** Number of trailing dots. */
const TRAIL_LENGTH = 8;
/** Magnetic pull range, in pixels. */
const MAGNETIC_RANGE = 80;
/** Magnetic easing factor (0–1). */
const MAGNETIC_EASE = 0.15;

const COLORS = {
  aerospace: '#FF4F00',
  space: '#1E2952',
} as const;

/**
 * Apply magnetic snapping toward an element center.
 *
 * The positional pull is only applied when the pointer is within `MAGNETIC_RANGE` of the element's
 * center. Without this guard, a wide element (e.g. a full-row link) would drag the drawn
 * cursor far from the pointer toward its center — the magnetic ring still
 * activates outside the range so hovering the element remains visible, just without moving the
 * cursor away from what the user is actually pointing at.
 */
function applySnap(state: CosmicCursorState, rect: DOMRect, rawX: number, rawY: number) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.sqrt((cx - rawX) ** 2 + (cy - rawY) ** 2);
  if (dist < MAGNETIC_RANGE) {
    state.mouse.x += (cx - rawX) * MAGNETIC_EASE;
    state.mouse.y += (cy - rawY) * MAGNETIC_EASE;
  }
  state.isMagnetic = true;
}

/**
 * Hook that tracks mouse position, accent color, and magnetic snapping.
 * Returns a ref to the mutable state object so the canvas render loop can read it
 * without triggering React re-renders.
 */
export function useCosmicCursor() {
  const stateRef = useRef<CosmicCursorState>({
    mouse: { x: -200, y: -200 },
    isVisible: false,
    reducedMotion: false,
    isTouchDevice: false,
    trail: [],
    accentColor: COLORS.aerospace,
    isMagnetic: false,
    usesNativeCursor: false,
    surfaceTheme: 'dark',
  });

  useEffect(() => {
    const state = stateRef.current;

    // Keep the custom cursor for mice and trackpads only: any primary pointer that isn't fine
    // (finger, stylus, TV remote, no pointer at all) keeps the native behaviour.
    state.isTouchDevice = window.matchMedia(COARSE_POINTER_QUERY).matches;
    if (state.isTouchDevice) return;

    // Detect reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    state.reducedMotion = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => {
      state.reducedMotion = e.matches;
    };
    mq.addEventListener('change', onMqChange);

    // Trail initialization
    state.trail = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -200, y: -200 }));

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

      // The nearest data-theme is <html> (set by next-themes) or a dark island such as a case
      // study hero with a project image, so the trail stays visible on whatever surface the pointer is over.
      state.surfaceTheme =
        isElement && target.closest('[data-theme]')?.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

      // Links and buttons pull the dot toward their center.
      const hovered = isElement ? target.closest('a, button') : null;
      state.isMagnetic = false;
      state.accentColor = COLORS.aerospace;
      if (hovered) applySnap(state, hovered.getBoundingClientRect(), e.clientX, e.clientY);

      // Orange fill under the pointer: switch to space so the dot stays visible.
      if (hovered?.classList.contains('bg-aerospace')) state.accentColor = COLORS.space;
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
      mq.removeEventListener('change', onMqChange);
    };
  }, []);

  /** Called each frame with the drawn dot position, so the trail follows the dot. */
  const updateTrail = useCallback((x: number, y: number) => {
    const state = stateRef.current;
    if (state.trail.length === 0) return;
    // Shift: oldest point becomes newest
    state.trail.shift();
    state.trail.push({ x, y });
  }, []);

  return { stateRef, updateTrail };
}
