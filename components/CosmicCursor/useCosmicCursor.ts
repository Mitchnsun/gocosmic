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
  /** Velocity magnitude (px/s) */
  velocity: number;
  /** Current accent color hex (reacts to data-accent) */
  accentColor: string;
  /** True when snapping toward a magnetic element */
  isMagnetic: boolean;
  /** True when hovering an input/textarea (hide custom cursor) */
  isTextInput: boolean;
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
 * Hook that tracks mouse position, velocity, accent color, and magnetic snapping.
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
    velocity: 0,
    accentColor: COLORS.aerospace,
    isMagnetic: false,
    isTextInput: false,
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

    // Scan magnetic elements
    const scanMagnetic = () => {
      magneticElementsRef.current = Array.from(document.querySelectorAll('[data-magnetic]'));
    };
    scanMagnetic();

    // Observe DOM mutations to keep the magnetic list fresh
    const observer = new MutationObserver(scanMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });

    // Trail initialization
    state.trail = Array.from({ length: trailLength }, () => ({ x: -200, y: -200 }));

    let lastX = state.mouse.x;
    let lastY = state.mouse.y;
    let lastTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastTime || 16;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      state.velocity = (Math.sqrt(dx * dx + dy * dy) / dt) * 1000;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
      state.isVisible = true;

      // Detect text inputs
      const target = e.target as Element | null;
      const tag = target?.tagName?.toLowerCase();
      state.isTextInput = tag === 'input' || tag === 'textarea' || target?.getAttribute('contenteditable') === 'true';

      // Magnetic detection
      let closestDist = Infinity;
      let closestEl: Element | null = null;

      for (const el of magneticElementsRef.current) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        if (dist < closestDist) {
          closestDist = dist;
          closestEl = el;
        }
      }

      if (closestEl && closestDist < magneticRange) {
        state.isMagnetic = true;
        const rect = closestEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Ease cursor toward element center
        state.mouse.x += (cx - e.clientX) * magneticEase;
        state.mouse.y += (cy - e.clientY) * magneticEase;
        state.accentColor = resolveAccent(closestEl.getAttribute('data-accent'));
      } else {
        state.isMagnetic = false;
        state.accentColor = COLORS.aerospace;
      }

      // Auto-magnetic for <a> and <button> without data-magnetic
      if (!state.isMagnetic && target) {
        const closest = target.closest('a, button');
        if (closest) {
          state.isMagnetic = true;
          state.accentColor = resolveAccent(closest.getAttribute('data-accent'));
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
