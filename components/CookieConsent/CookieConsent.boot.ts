import { STORAGE_KEY } from './CookieConsentContext';

/** The server renders the banner hidden; this tells the browser copy apart, which starts visible. */
export const BANNER_STARTS_HIDDEN = typeof window === 'undefined';

/**
 * Runs right after the server-rendered banner, which starts hidden, so the banner paints with the page
 * instead of popping in after hydration. Revealing it only once it is fully parsed keeps a slow page from
 * painting it half-built, then growing upwards (a layout shift). A visitor who already answered never
 * sees it. Must stay self-contained: it is serialised into an inline script.
 */
export function revealConsentBanner(storageKey: string, banner = document.currentScript?.previousElementSibling) {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'accepted' || stored === 'refused') return;
  } catch {
    // Storage unavailable: the banner shows, as it does for a first visit.
  }
  if (banner instanceof HTMLElement) banner.hidden = false;
}

export const CONSENT_REVEAL_SCRIPT = `(${revealConsentBanner.toString()})(${JSON.stringify(STORAGE_KEY)})`;
