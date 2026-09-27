import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
};

const getSnapshot = () => typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;

// The server cannot know the preference; hydration starts from this value and React then re-renders with
// the browser's, instead of leaving mismatched attributes (e.g. `data-reduced-motion`) in the page.
const getServerSnapshot = () => false;

/** Whether the visitor asked for reduced motion, kept in sync with the media query. */
export const usePrefersReducedMotion = (enabled: boolean) => {
  const prefersReducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return enabled && prefersReducedMotion;
};
