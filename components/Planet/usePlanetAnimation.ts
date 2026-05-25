'use client';

import { useEffect, useRef } from 'react';

export type ParallaxMode = 'pointer' | 'gyro' | 'auto';

const GYRO_GAMMA_SENSITIVITY = 0.4;
const GYRO_BETA_OFFSET = 30;
const GYRO_BETA_SENSITIVITY = 0.3;
const GYRO_LERP_FACTOR = 0.08;
const GYRO_SNAP_EPSILON = 0.01;
const PLANET_ROTATION_INCREMENT = 0.003;
const PLANET_ROTATION_MULTIPLIER = 12;
const ROTATION_TIME_RESET = Math.PI * 2;
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
  const planetRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const element = planetRef.current;
    if (!element) return;

    let frame: number;
    let time = 0;

    const tick = () => {
      time = (time + PLANET_ROTATION_INCREMENT) % ROTATION_TIME_RESET;
      element.style.transform = `rotate(${time * PLANET_ROTATION_MULTIPLIER}deg)`;
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
    const shouldUseGyro = parallaxMode === 'gyro' || (parallaxMode === 'auto' && 'ontouchstart' in window);
    if (!shouldUseGyro || reducedMotion) return;

    const element = wrapperRef.current;
    if (!element) return;

    let currentX = 0;
    let currentY = 0;
    let frame: number;
    let fallbackFrame: number | null = null;
    const target = { x: 0, y: 0 };

    const commit = () => {
      const distanceX = target.x - currentX;
      const distanceY = target.y - currentY;
      currentX = Math.abs(distanceX) < GYRO_SNAP_EPSILON ? target.x : currentX + distanceX * GYRO_LERP_FACTOR;
      currentY = Math.abs(distanceY) < GYRO_SNAP_EPSILON ? target.y : currentY + distanceY * GYRO_LERP_FACTOR;
      element.style.setProperty('--planet-tilt-x', `${currentX}px`);
      element.style.setProperty('--planet-tilt-y', `${currentY}px`);
      frame = requestAnimationFrame(commit);
    };

    frame = requestAnimationFrame(commit);

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
      if (hasGyro) return;

      let time = 0;
      const floatLoop = () => {
        time += FALLBACK_TIME_INCREMENT;
        target.x = Math.sin(time) * FALLBACK_X_AMPLITUDE;
        target.y = Math.cos(time * FALLBACK_Y_FREQUENCY) * FALLBACK_Y_AMPLITUDE;
        fallbackFrame = requestAnimationFrame(floatLoop);
      };

      fallbackFrame = requestAnimationFrame(floatLoop);
    }, FALLBACK_DELAY_MS);

    return () => {
      cancelAnimationFrame(frame);
      if (fallbackFrame !== null) cancelAnimationFrame(fallbackFrame);
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

  return { planetRef, wrapperRef };
};
