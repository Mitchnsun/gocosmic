import { useEffect, useRef, useState } from 'react';

import {
  HeaderProps,
  MOBILE_HEIGHT,
  MOBILE_MAX_WIDTH,
  SCROLL_COMPACT_THRESHOLD,
  SCROLL_DIRECTION_THRESHOLD,
  TABLET_COMPACT_HEIGHT,
  TABLET_EXPANDED_HEIGHT,
  TABLET_MAX_WIDTH,
} from './constants';

export const useHeader = ({
  adaptiveHeight = true,
  minHeight = MOBILE_HEIGHT,
  maxHeight = TABLET_EXPANDED_HEIGHT,
  respectReducedMotion = true,
}: HeaderProps = {}) => {
  const [headerHeight, setHeaderHeight] = useState(maxHeight);
  const [reduceMotion, setReduceMotion] = useState(false);
  const lastScrollY = useRef(0);
  const isCompactRef = useRef(false);

  // Sync reduceMotion with the OS preference; re-evaluates if the user changes the setting mid-session.
  useEffect(() => {
    if (!respectReducedMotion || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setReduceMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener('change', updateReducedMotion);
  }, [respectReducedMotion]);

  // Shrink the header when scrolling down, expand it when scrolling up.
  // On resize, reapply the correct height for the new breakpoint without waiting for the next scroll.
  useEffect(() => {
    if (!adaptiveHeight || typeof window === 'undefined') {
      return;
    }

    const getHeights = () => {
      if (window.innerWidth <= MOBILE_MAX_WIDTH) {
        return { expandedHeight: MOBILE_HEIGHT, compactHeight: MOBILE_HEIGHT };
      }
      if (window.innerWidth <= TABLET_MAX_WIDTH) {
        return { expandedHeight: TABLET_EXPANDED_HEIGHT, compactHeight: TABLET_COMPACT_HEIGHT };
      }

      return { expandedHeight: maxHeight, compactHeight: minHeight };
    };

    const updateHeightOnScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      // Ignore sub-pixel noise to prevent header oscillation during anchor navigation
      if (Math.abs(delta) < SCROLL_DIRECTION_THRESHOLD) return;

      const isScrollingDown = delta > 0;
      const { expandedHeight, compactHeight } = getHeights();
      const shouldCompact = isScrollingDown && currentScrollY > SCROLL_COMPACT_THRESHOLD;

      if (shouldCompact !== isCompactRef.current) {
        isCompactRef.current = shouldCompact;
        setHeaderHeight(shouldCompact ? compactHeight : expandedHeight);
      }
    };

    const handleResize = () => {
      const { expandedHeight, compactHeight } = getHeights();
      setHeaderHeight(isCompactRef.current ? compactHeight : expandedHeight);
    };

    updateHeightOnScroll();
    window.addEventListener('scroll', updateHeightOnScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', updateHeightOnScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [adaptiveHeight, maxHeight, minHeight]);

  return { headerHeight, reduceMotion };
};
