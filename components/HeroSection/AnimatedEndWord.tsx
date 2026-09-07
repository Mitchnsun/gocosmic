'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/design-system/lib/utils';

interface AnimatedEndWordProps {
  word: string;
  className?: string;
  prefersReducedMotion: boolean;
}

const AnimatedEndWord = ({ word, className, prefersReducedMotion }: AnimatedEndWordProps) => {
  const [displayed, setDisplayed] = useState(word);
  const [previous, setPrevious] = useState<string | null>(null);
  const displayedRef = useRef(word);

  useEffect(() => {
    if (word === displayedRef.current) return;

    if (prefersReducedMotion) {
      displayedRef.current = word;
      setDisplayed(word);
      return;
    }

    const old = displayedRef.current;
    displayedRef.current = word;
    setPrevious(old);
    setDisplayed(word);

    const timer = setTimeout(() => setPrevious(null), 400);
    return () => clearTimeout(timer);
  }, [word, prefersReducedMotion]);

  return (
    <span className="relative inline-block">
      {previous !== null && (
        <span className={cn('word-exit absolute inset-0', className)} aria-hidden="true">
          {previous}
        </span>
      )}
      <span className={cn({ 'word-enter': previous !== null }, className)}>{displayed}</span>
    </span>
  );
};

export default AnimatedEndWord;
