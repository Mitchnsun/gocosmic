import { useCallback, useState } from 'react';

/**
 * Hook that manages the "warp speed" interaction state for the CTA starfield.
 *
 * Exposes the current warping state along with handlers to start and stop the
 * effect. When {@link enabled} is `false` (for example because the user prefers
 * reduced motion) `startWarp` becomes a no-op so the starfield keeps its rest
 * speed.
 *
 * @param enabled - Whether the warp effect is allowed to trigger.
 * @returns The warping state and start/stop handlers.
 */
export const useWarpEffect = (enabled: boolean) => {
  const [isWarping, setIsWarping] = useState(false);

  const startWarp = useCallback(() => {
    if (!enabled) return;
    setIsWarping(true);
  }, [enabled]);

  const stopWarp = useCallback(() => {
    setIsWarping(false);
  }, []);

  return { isWarping, startWarp, stopWarp };
};
