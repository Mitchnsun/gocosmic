'use client';

import { useEffect, useRef } from 'react';

export type ParallaxMode = 'pointer' | 'gyro' | 'auto';

const GYRO_GAMMA_SENSITIVITY = 0.4;
const GYRO_BETA_OFFSET = 30;
const GYRO_BETA_SENSITIVITY = 0.3;
const GYRO_LERP_FACTOR = 0.08;
const GYRO_SNAP_EPSILON = 0.01;
const FALLBACK_DELAY_MS = 1500;
const FALLBACK_TIME_INCREMENT = 0.008;
const FALLBACK_X_AMPLITUDE = 8;
const FALLBACK_Y_AMPLITUDE = 5;
const FALLBACK_Y_FREQUENCY = 0.7;

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
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const element = wrapperRef.current;
    if (!element) return;

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
    const shouldUseGyro = parallaxMode === 'gyro' || (parallaxMode === 'auto' && 'ontouchstart' in window);
    if (!shouldUseGyro || reducedMotion) return;

    const element = wrapperRef.current;
    if (!element) return;

    let currentX = 0;
    let currentY = 0;
    let frame: number | null = null;
    let floating = false;
    let time = 0;
    const target = { x: 0, y: 0 };

    // One loop eases the tilt towards its target and, without a gyroscope, makes that target float.
    const commit = () => {
      if (floating) {
        time += FALLBACK_TIME_INCREMENT;
        target.x = Math.sin(time) * FALLBACK_X_AMPLITUDE;
        target.y = Math.cos(time * FALLBACK_Y_FREQUENCY) * FALLBACK_Y_AMPLITUDE;
      }
      const distanceX = target.x - currentX;
      const distanceY = target.y - currentY;
      currentX = Math.abs(distanceX) < GYRO_SNAP_EPSILON ? target.x : currentX + distanceX * GYRO_LERP_FACTOR;
      currentY = Math.abs(distanceY) < GYRO_SNAP_EPSILON ? target.y : currentY + distanceY * GYRO_LERP_FACTOR;
      element.style.setProperty('--planet-tilt-x', `${currentX}px`);
      element.style.setProperty('--planet-tilt-y', `${currentY}px`);
      frame = requestAnimationFrame(commit);
    };

    // The loop runs only while the planet is on screen: a planet hidden at this breakpoint never starts it.
    const visibility = new IntersectionObserver((entries) => {
      if (entries.at(-1)?.isIntersecting) {
        frame ??= requestAnimationFrame(commit);
      } else if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    });
    visibility.observe(element);

    let hasGyro = false;
    const handleOrientation = (event: DeviceOrientationEvent) => {
      hasGyro = true;
      target.x = Math.max(-gyroAmplitude, Math.min(gyroAmplitude, (event.gamma ?? 0) * GYRO_GAMMA_SENSITIVITY));
      target.y = Math.max(
        -gyroAmplitude,
        Math.min(gyroAmplitude, ((event.beta ?? 0) - GYRO_BETA_OFFSET) * GYRO_BETA_SENSITIVITY)
      );
    };

    window.addEventListener('deviceorientation', handleOrientation);

    const fallbackTimerId = window.setTimeout(() => {
      floating = !hasGyro;
    }, FALLBACK_DELAY_MS);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      visibility.disconnect();
      window.clearTimeout(fallbackTimerId);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroAmplitude, parallaxMode, reducedMotion]);

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

  return { wrapperRef };
};
