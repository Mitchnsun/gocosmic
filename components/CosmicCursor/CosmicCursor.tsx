'use client';

import { useEffect, useRef, useState } from 'react';

import { useCosmicCursor } from './useCosmicCursor';

/** Props for the CosmicCursor component */
export interface CosmicCursorProps {
  /** Number of trailing dots. Defaults to 8. */
  trailLength?: number;
  /** Magnetic pull range (px). Defaults to 80. */
  magneticRange?: number;
  /** Magnetic easing factor (0–1). Defaults to 0.15. */
  magneticEase?: number;
  /**
   * Core cursor size in pixels (diameter). The arc is drawn at `coreSize / 2` radius,
   * so `coreSize={6}` renders a 6px-wide dot. Defaults to 6.
   */
  coreSize?: number;
  /** Trailing dot size in pixels (diameter). Defaults to 3. */
  trailSize?: number;
}

const COLORS = {
  aerospace: '#FF4F00',
  cosmicLatte: '#FFF8E7',
};

/** Parse a hex color into { r, g, b } */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/**
 * CosmicCursor — canvas-based custom cursor with trailing and magnetic snap effects.
 *
 * - Canvas fullscreen overlay, pointer-events: none
 * - 60fps RAF loop — no DOM queries per frame
 * - Respects `prefers-reduced-motion` (static dot only)
 * - Returns `null` on touch devices so no canvas is added to the DOM
 * - Hides the native cursor on all elements via an injected `<style>` tag using `!important`,
 *   which overrides utility classes such as `cursor-pointer` on interactive elements. Text
 *   inputs keep the native text caret, and clickable form controls (checkboxes, radios,
 *   ranges, selects) keep the native hand/grab cursor instead of the canvas dot.
 *
 * @component
 */
const CosmicCursor = ({
  trailLength = 8,
  magneticRange = 80,
  magneticEase = 0.15,
  coreSize = 6,
  trailSize = 3,
}: CosmicCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stateRef, updateTrail } = useCosmicCursor({ trailLength, magneticRange, magneticEase });
  // Tracks touch-device detection; updated after mount to avoid SSR hydration mismatches.
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    // Touch devices don't have a visible cursor — remove the canvas from the DOM
    if (state.isTouchDevice) {
      setIsTouchDevice(true);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Inject a global style to hide the native cursor on all elements.
    // `!important` is required to override utility classes like `cursor-pointer` on buttons.
    // Clickable form controls keep the native hand/grab cursor; text inputs keep the native
    // text cursor. Both are excluded from the canvas dot in useCosmicCursor's `usesNativeCursor`
    // / native-select detection. `[role="slider"]` covers Radix Slider thumbs (e.g. the pricing
    // page-count control), which render as a plain div rather than a native form element.
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-cosmic-cursor', '');
    styleEl.textContent =
      '* { cursor: none !important; } ' +
      'input:is([type="checkbox"],[type="radio"],[type="button"],[type="submit"],[type="reset"],[type="color"],[type="file"]), ' +
      'select, label:has(input:is([type="checkbox"],[type="radio"])) { cursor: pointer !important; } ' +
      '[role="slider"] { cursor: grab !important; } ' +
      '[role="slider"]:active { cursor: grabbing !important; } ' +
      'input:not([type]), input:is([type="text"],[type="email"],[type="search"],[type="tel"],[type="url"],[type="password"],[type="number"],[type="date"]), ' +
      'textarea, [contenteditable="true"] { cursor: text !important; }';

    document.head.appendChild(styleEl);

    let animationId: number;
    let lastFrameTime = performance.now();
    // Smoothed cursor position for snapping
    let smoothX = state.mouse.x;
    let smoothY = state.mouse.y;

    const draw = (now: number) => {
      const rawDt = now - lastFrameTime;
      lastFrameTime = now;

      // Skip animation updates for large deltas (tab was backgrounded) to avoid jumps;
      // just re-schedule and wait for the next normal frame
      if (rawDt > 100) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!state.isVisible) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const reduced = state.reducedMotion;
      const accentRgb = hexToRgb(state.accentColor);
      const latteRgb = hexToRgb(COLORS.cosmicLatte);

      // Smooth cursor position toward target
      const ease = state.isMagnetic ? 0.25 : 0.5;
      smoothX += (state.mouse.x - smoothX) * ease;
      smoothY += (state.mouse.y - smoothY) * ease;

      // ── Trailing dots ────────────────────────────────────────────────────
      if (!reduced && !state.usesNativeCursor) {
        updateTrail();
        const trail = state.trail;
        for (const [i, point] of trail.entries()) {
          const t = i / trail.length; // 0 = oldest, 1 = newest
          const alpha = t * 0.6;
          const radius = trailSize * (0.4 + t * 0.6);

          // Color: interpolate cosmicLatte → aerospace
          const r = Math.round(latteRgb.r + (accentRgb.r - latteRgb.r) * t);
          const g = Math.round(latteRgb.g + (accentRgb.g - latteRgb.g) * t);
          const b = Math.round(latteRgb.b + (accentRgb.b - latteRgb.b) * t);

          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
        }
      }

      // ── Core dot + glow ──────────────────────────────────────────────────
      if (!state.usesNativeCursor) {
        const glowSize = state.isMagnetic ? coreSize * 5 : coreSize * 3;
        const gradient = ctx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, glowSize);
        gradient.addColorStop(0, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.5)`);
        gradient.addColorStop(1, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0)`);

        ctx.beginPath();
        ctx.arc(smoothX, smoothY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Solid core
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, coreSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${accentRgb.r},${accentRgb.g},${accentRgb.b})`;
        ctx.fill();

        // Magnetic ring
        if (state.isMagnetic && !reduced) {
          ctx.beginPath();
          ctx.arc(smoothX, smoothY, coreSize * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.4)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      styleEl.remove();
    };
  }, [stateRef, updateTrail, coreSize, trailSize]);

  // On touch devices, return null after mount detection so no canvas is present in the DOM
  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default CosmicCursor;
