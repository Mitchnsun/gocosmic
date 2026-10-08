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

const BACKGROUND = 'rgb(2, 6, 23)';
const STAR_RGB = '255, 255, 255';

const DEFAULT_STAR_COUNT = 500;
const DEFAULT_SPEED = 2;

/**
 * Stars are drawn in depth bands, one path per band, instead of one path per star: a few canvas calls
 * per frame whatever the star count. Nearer bands are brighter and thicker.
 */
const DEPTH_BANDS = 12;
const BAND_STYLES = Array.from({ length: DEPTH_BANDS }, (_, band) => {
  const nearness = (band + 0.5) / DEPTH_BANDS;
  return { color: `rgba(${STAR_RGB}, ${nearness})`, width: Math.max(0.5, nearness * 2.5) };
});

/**
 * Starfield component that renders an animated 2D canvas-based starfield.
 *
 * Creates a performant perspective (warp-speed) starfield effect using the HTML5
 * Canvas 2D API. Zero external dependencies, targets 60fps via requestAnimationFrame.
 * Fully configurable and resizes automatically with the viewport. The loop only runs
 * while the canvas is on screen, and stars are stroked per depth band, not one by one.
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
    const bands = BAND_STYLES.map((style) => ({ ...style, stars: [] as Star[] }));

    const draw = () => {
      ctx.fillStyle = BACKGROUND;
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

      for (const band of bands) band.stars.length = 0;

      for (const star of stars) {
        star.prevZ = star.z;
        star.z -= speedRef.current;

        if (star.z <= 0) {
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
          star.z = width;
          star.prevZ = width;
        }

        const nearness = 1 - star.z / width;
        bands.at(Math.min(DEPTH_BANDS - 1, Math.max(0, Math.floor(nearness * DEPTH_BANDS))))?.stars.push(star);
      }

      for (const { color, width: lineWidth, stars: bandStars } of bands) {
        if (bandStars.length === 0) continue;

        if (frozen) {
          // No movement means no streak to draw: paint each star as a dot so a
          // frozen starfield is still a starfield.
          ctx.fillStyle = color;
          for (const { x, y, z } of bandStars) {
            ctx.fillRect((x / z) * focalLength + cx, (y / z) * focalLength + cy, lineWidth, lineWidth);
          }
          continue;
        }

        ctx.beginPath();
        for (const { x, y, z, prevZ } of bandStars) {
          ctx.moveTo((x / prevZ) * focalLength + cx, (y / prevZ) * focalLength + cy);
          ctx.lineTo((x / z) * focalLength + cx, (y / z) * focalLength + cy);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    const loop = () => {
      draw();
      animationId = requestAnimationFrame(loop);
    };

    const pause = () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      animationId = null;
    };

    // The first frame is painted right away; a frozen starfield stops there. A moving one
    // animates only while the canvas is on screen, so an off-screen field costs nothing.
    draw();
    const visibility = frozen
      ? null
      : new IntersectionObserver((entries) => {
          // Batched records: the last one is the canvas's current state.
          if (!entries.at(-1)?.isIntersecting) pause();
          else if (animationId === null) animationId = requestAnimationFrame(loop);
        });
    visibility?.observe(canvas);

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

        // Resizing the canvas clears its bitmap. Unless the loop is running and
        // repaints it on its next frame, paint the current frame here.
        if (animationId === null) draw();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      pause();
      visibility?.disconnect();
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [frozen]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default Starfield;
