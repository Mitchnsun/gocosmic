'use client';

import { useEffect, useRef, useState } from 'react';

interface UseProjectsAnimationOptions {
  /** Stagger delay in ms before this element becomes visible. */
  delay: number;
  /** Skip animation entirely (prefers-reduced-motion). */
  reducedMotion: boolean;
}

interface UseProjectsAnimationReturn {
  ref: React.RefObject<HTMLElement | null>;
  visible: boolean;
}

/**
 * Observes an element via IntersectionObserver and marks it as visible after
 * an optional stagger `delay`.  Guards against React StrictMode double-invoke
 * with `hasIntersected` ref so the animation fires only once per mount.
 */
export function useProjectsAnimation({
  delay,
  reducedMotion,
}: UseProjectsAnimationOptions): UseProjectsAnimationReturn {
  const ref = useRef<HTMLElement | null>(null);
  const hasIntersected = useRef(false);
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion || hasIntersected.current) {
      setVisible(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            hasIntersected.current = true;
            timer = setTimeout(() => setVisible(true), delay);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, reducedMotion]);

  return { ref, visible };
}
