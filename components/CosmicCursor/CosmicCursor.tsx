'use client';

import { useEffect, useRef } from 'react';

import { useCosmicCursor } from './useCosmicCursor';

/** Props for the CosmicCursor component */
export interface CosmicCursorProps {
  /** Number of trailing dots. Defaults to 8. */
  trailLength?: number;
  /** Orbit radius at rest (px). Defaults to 24. */
  orbitRadius?: number;
  /** Number of orbital dots. Defaults to 3. */
  orbitCount?: number;
  /** Magnetic pull range (px). Defaults to 80. */
  magneticRange?: number;
  /** Magnetic easing factor (0–1). Defaults to 0.15. */
  magneticEase?: number;
  /** Core cursor radius (px). Defaults to 6. */
  coreSize?: number;
  /** Trailing dot radius (px). Defaults to 3. */
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
 * CosmicCursor — canvas-based custom cursor with trailing, magnetic snap, and orbital effects.
 *
 * - Canvas fullscreen overlay, pointer-events: none
 * - 60fps RAF loop — no DOM queries per frame
 * - Respects `prefers-reduced-motion` (static dot only)
 * - Disabled on touch devices
 * - Hides the native cursor on desktop
 *
 * @component
 */
const CosmicCursor = ({
  trailLength = 8,
  orbitRadius = 24,
  orbitCount = 3,
  magneticRange = 80,
  magneticEase = 0.15,
  coreSize = 6,
  trailSize = 3,
}: CosmicCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stateRef, updateTrail } = useCosmicCursor({ trailLength, magneticRange, magneticEase });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    if (state.isTouchDevice) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Hide native cursor on the document body
    document.documentElement.style.cursor = 'none';

    let animationId: number;
    let orbitAngle = 0;
    let restTimer = 0;
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

      const dt = rawDt;

      // Decay velocity every frame so it falls to zero when the mouse is stationary
      state.velocity *= 0.95;

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
      if (!reduced && !state.isTextInput) {
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

      // ── Orbital dots at rest ─────────────────────────────────────────────
      if (!reduced && !state.isTextInput) {
        const VELOCITY_THRESHOLD = 10;
        const isAtRest = state.velocity < VELOCITY_THRESHOLD;

        if (isAtRest) {
          restTimer = Math.min(restTimer + dt, 200);
        } else {
          restTimer = Math.max(restTimer - dt * 2, 0);
        }

        const orbitOpacity = restTimer / 200;

        if (orbitOpacity > 0) {
          // 2 RPM → 1 rotation per 30 000ms → angle/ms = (2π / 30 000)
          orbitAngle += (Math.PI * 2 * dt) / 30_000;

          for (let i = 0; i < orbitCount; i++) {
            const angle = orbitAngle + (Math.PI * 2 * i) / orbitCount;
            const ox = smoothX + Math.cos(angle) * orbitRadius;
            const oy = smoothY + Math.sin(angle) * orbitRadius;

            ctx.beginPath();
            ctx.arc(ox, oy, trailSize * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${orbitOpacity * 0.7})`;
            ctx.fill();
          }
        }
      }

      // ── Core dot + glow ──────────────────────────────────────────────────
      if (!state.isTextInput) {
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
      document.documentElement.style.cursor = '';
    };
  }, [stateRef, updateTrail, coreSize, trailSize, orbitCount, orbitRadius]);

  // Don't render on touch devices (detected server-side safely as false)
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
