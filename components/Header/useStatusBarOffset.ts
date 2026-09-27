import { useState } from 'react';

import { STATUS_BAR_HEIGHT } from './constants';

/**
 * How much of the status bar is still visible above the sticky header, read
 * once on mount. The status bar scrolls away while the header stays pinned,
 * so a mobile drawer's top spacer must shrink accordingly or it leaves an
 * empty band once the visitor has scrolled down.
 */
export function useStatusBarOffset(): number {
  const [offset] = useState(() => {
    if (typeof window === 'undefined') return STATUS_BAR_HEIGHT;
    return Math.max(0, STATUS_BAR_HEIGHT - window.scrollY);
  });

  return offset;
}
