import { useEffect, useRef, useState } from 'react';

export const useWordCycler = (words: string[], interval: number, disabled: boolean): string => {
  const [index, setIndex] = useState(0);
  const wordsRef = useRef(words);
  wordsRef.current = words;

  useEffect(() => {
    if (disabled || words.length <= 1) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % wordsRef.current.length);
    }, interval);

    return () => clearInterval(id);
  }, [words.length, interval, disabled]);

  // eslint-disable-next-line security/detect-object-injection
  return wordsRef.current[index] ?? wordsRef.current[0] ?? '';
};
