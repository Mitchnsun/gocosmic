'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

/** Properties for a single star in the starfield */
interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
}

/** Props for the Starfield component */
export interface StarfieldProps {
  /** Number of stars to render. Defaults to 150. */
  starCount?: number;
  /** Animation speed (pixels per frame). Defaults to 3. */
  speed?: number;
  /** Additional CSS class names applied to the canvas element. */
  className?: string;
  /** Freezes the stars when the visitor prefers reduced motion. Defaults to `false`,
   *  leaving the caller in charge of the preference. */
  respectReducedMotion?: boolean;
}

const DEFAULT_STAR_COUNT = 500;
const DEFAULT_SPEED = 2;

/**
 * Starfield component that renders an animated 2D canvas-based starfield.
 *
 * Creates a performant perspective (warp-speed) starfield effect using the HTML5
 * Canvas 2D API. Zero external dependencies, targets 60fps via requestAnimationFrame.
 * Fully configurable and resizes automatically with the viewport.
 *
 * With {@link StarfieldProps.respectReducedMotion} enabled and a visitor who
 * asks for reduced motion, a single static frame of still stars is drawn and
 * no animation loop is started.
 *
 * @component
 * @param {StarfieldProps} props - Component configuration
 * @returns Canvas element with animated stars, hidden from assistive technologies
 */
const Starfield = ({
  starCount = DEFAULT_STAR_COUNT,
  speed = DEFAULT_SPEED,
  className,
  respectReducedMotion = false,
}: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frozen = usePrefersReducedMotion(respectReducedMotion);
  const effectiveSpeed = frozen ? 0 : speed;
  const speedRef = useRef(effectiveSpeed);
  const starCountRef = useRef(starCount);

  useEffect(() => {
    speedRef.current = effectiveSpeed;
  }, [effectiveSpeed]);

  useEffect(() => {
    starCountRef.current = starCount;
  }, [starCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const createStar = (): Star => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * width,
      prevZ: width,
    });

    const stars: Star[] = Array.from({ length: starCountRef.current }, createStar);

    let animationId: number | null = null;

    const draw = () => {
      // Deep space background — matches bg-slate-950
      ctx.fillStyle = 'rgb(2, 6, 23)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const focalLength = width * 0.8;

      const starDelta = starCountRef.current - stars.length;
      if (starDelta > 0) {
        stars.push(...Array.from({ length: starDelta }, createStar));
      } else if (starDelta < 0) {
        stars.splice(starCountRef.current);
      }

      for (const star of stars) {
        star.prevZ = star.z;
        star.z -= speedRef.current;

        if (star.z <= 0) {
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
          star.z = width;
          star.prevZ = width;
        }

        const sx = (star.x / star.z) * focalLength + cx;
        const sy = (star.y / star.z) * focalLength + cy;
        const prevSx = (star.x / star.prevZ) * focalLength + cx;
        const prevSy = (star.y / star.prevZ) * focalLength + cy;

        const opacity = Math.min(1, 1 - star.z / width);
        const lineWidth = Math.max(0.5, (1 - star.z / width) * 2.5);

        if (frozen) {
          // No movement means no streak to draw: paint each star as a dot so a
          // frozen starfield is still a starfield.
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillRect(sx, sy, lineWidth, lineWidth);
        } else {
          ctx.beginPath();
          ctx.moveTo(prevSx, prevSy);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }

      // Frozen starfield: the frame just drawn stays on screen instead of
      // running a 60fps loop that would not move anything.
      if (!frozen) animationId = requestAnimationFrame(draw);
    };

    draw();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        // Redistribute stars to match new canvas dimensions
        for (const star of stars) {
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
          star.z = Math.random() * width;
          star.prevZ = width;
        }

        // Resizing the canvas clears its bitmap. While frozen no frame is
        // pending, so repaint the single static frame here — the running loop
        // takes care of it otherwise.
        if (frozen) draw();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [frozen]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default Starfield;
