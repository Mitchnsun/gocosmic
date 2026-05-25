'use client';

import { useEffect, useRef } from 'react';

export type ParallaxMode = 'pointer' | 'gyro' | 'auto';

export interface UsePlanetAnimationOptions {
  /** Parallax source. */
  parallaxMode?: ParallaxMode;
  /** Maximum gyroscope tilt in pixels. */
  gyroAmplitude?: number;
  /** Scroll parallax speed. Set to 0 to disable it. */
  scrollFactor?: number;
  /** Disables all animation effects. */
  reducedMotion?: boolean;
}

export const usePlanetAnimation = ({
  parallaxMode = 'auto',
  gyroAmplitude = 15,
  scrollFactor = 0.3,
  reducedMotion = false,
}: UsePlanetAnimationOptions = {}) => {
  const planetRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile =
    parallaxMode === 'gyro' || (parallaxMode === 'auto' && typeof window !== 'undefined' && 'ontouchstart' in window);

  useEffect(() => {
    if (reducedMotion) return;

    const element = planetRef.current;
    if (!element) return;

    let frame: number;
    let time = 0;

    const tick = () => {
      time += 0.003;
      element.style.transform = `rotate(${time * 12}deg)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const element = wrapperRef.current;
    if (!element) return;

    element.style.opacity = '0';
    element.style.setProperty('--planet-reveal-scale', '0.72');
    element.style.transition =
      'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';

    const frame = requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.setProperty('--planet-reveal-scale', '1');
    });

    const handleTransitionEnd = () => {
      element.style.opacity = '';
      element.style.removeProperty('--planet-reveal-scale');
      element.style.transition = '';
    };

    element.addEventListener('transitionend', handleTransitionEnd, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!isMobile || reducedMotion) return;

    const element = wrapperRef.current;
    if (!element) return;

    let currentX = 0;
    let currentY = 0;
    let frame: number;
    let fallbackFrame: number | null = null;
    const target = { x: 0, y: 0 };

    const commit = () => {
      currentX += (target.x - currentX) * 0.08;
      currentY += (target.y - currentY) * 0.08;
      element.style.setProperty('--planet-tilt-x', `${currentX}px`);
      element.style.setProperty('--planet-tilt-y', `${currentY}px`);
      frame = requestAnimationFrame(commit);
    };

    frame = requestAnimationFrame(commit);

    let hasGyro = false;
    const handleOrientation = (event: DeviceOrientationEvent) => {
      hasGyro = true;
      target.x = Math.max(-gyroAmplitude, Math.min(gyroAmplitude, (event.gamma ?? 0) * 0.4));
      target.y = Math.max(-gyroAmplitude, Math.min(gyroAmplitude, ((event.beta ?? 0) - 30) * 0.3));
    };

    window.addEventListener('deviceorientation', handleOrientation);

    const fallbackTimer = window.setTimeout(() => {
      if (hasGyro) return;

      let time = 0;
      const floatLoop = () => {
        time += 0.008;
        target.x = Math.sin(time) * 8;
        target.y = Math.cos(time * 0.7) * 5;
        fallbackFrame = requestAnimationFrame(floatLoop);
      };

      fallbackFrame = requestAnimationFrame(floatLoop);
    }, 1500);

    return () => {
      cancelAnimationFrame(frame);
      if (fallbackFrame !== null) cancelAnimationFrame(fallbackFrame);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroAmplitude, isMobile, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || scrollFactor === 0) return;

    const element = wrapperRef.current;
    if (!element) return;

    const handleScroll = () => {
      element.style.setProperty('--planet-scroll-y', `${-(window.scrollY * scrollFactor)}px`);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion, scrollFactor]);

  return { planetRef, wrapperRef };
};
