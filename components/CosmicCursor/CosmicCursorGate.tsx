'use client';

import { usePathname } from '@/i18n/navigation';

import CosmicCursor from './CosmicCursor';

/** Routes keeping the native cursor: the design system page is a static reference. */
const NATIVE_CURSOR_ROUTES = new Set(['/design-system']);

/** The site-wide custom cursor, except on the routes listed above. */
export function CosmicCursorGate() {
  return NATIVE_CURSOR_ROUTES.has(usePathname()) ? null : <CosmicCursor />;
}
