'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Flags an element as visible once it scrolls into view, then stops observing.
 * Without IntersectionObserver (old browsers, tests) the element shows at once.
 */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
