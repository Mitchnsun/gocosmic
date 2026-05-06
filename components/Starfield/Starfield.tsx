'use client';

import { useEffect, useRef } from 'react';

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
}

const DEFAULT_STAR_COUNT = 150;
const DEFAULT_SPEED = 3;

/**
 * Starfield component that renders an animated 2D canvas-based starfield.
 *
 * Creates a performant perspective (warp-speed) starfield effect using the HTML5
 * Canvas 2D API. Zero external dependencies, targets 60fps via requestAnimationFrame.
 * Fully configurable and resizes automatically with the viewport.
 *
 * @component
 * @param {StarfieldProps} props - Component configuration
 * @returns Canvas element with animated stars, hidden from assistive technologies
 */
const Starfield = ({ starCount = DEFAULT_STAR_COUNT, speed = DEFAULT_SPEED, className }: StarfieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const stars: Star[] = Array.from({ length: starCount }, createStar);

    let animationId: number;

    const draw = () => {
      // Deep space background — matches bg-slate-950
      ctx.fillStyle = 'rgb(2, 6, 23)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const focalLength = width * 0.8;

      for (const star of stars) {
        star.prevZ = star.z;
        star.z -= speed;

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

        ctx.beginPath();
        ctx.moveTo(prevSx, prevSy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
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
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount, speed]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default Starfield;
