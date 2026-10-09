'use client';

import { useLocale } from 'next-intl';
import { type MouseEvent, useEffect } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';

/** Query parameters of the current page, read when the visitor picks a language (e.g. `?type=mobile`). */
export function readCurrentQuery(): Record<string, string> | undefined {
  const query = Object.fromEntries(new URLSearchParams(window.location.search));
  return Object.keys(query).length > 0 ? query : undefined;
}

/**
 * Section anchor to restore once the page is shown in the requested language.
 * The next-intl router only compiles a pathname and a query, so the anchor
 * rides along in module state, which survives the client-side navigation.
 */
let pendingHash: { hash: string; locale: string; pathname: string } | null = null;

/** Element id targeted by an anchor; a malformed escape such as `#%` falls back to the raw text instead of throwing. */
function anchorId(hash: string): string {
  const raw = hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Puts the anchor back in the URL and scrolls to its section, once the same page is shown in the target language. */
function restorePendingHash(locale: string, pathname: string) {
  if (pendingHash?.locale !== locale || pendingHash.pathname !== pathname) return;
  const { hash } = pendingHash;
  pendingHash = null;
  const { pathname: path, search } = window.location;
  window.history.replaceState(window.history.state, '', `${path}${search}${hash}`);
  document.getElementById(anchorId(hash))?.scrollIntoView();
}

/**
 * Opens the current page in the locale picked (e.g. `de-CH`) and keeps what the
 * visitor had chosen on it: query parameters, such as the projects filter, and the
 * section anchor, such as `#simulator`. The query and the anchor are read at click
 * time, since filters and in-page links update the URL without a navigation.
 * The next-intl router performs the switch, which also keeps the locale cookie
 * in sync.
 */
export function useSwitchLocale() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  // Every switcher runs this after a navigation; the first one to see the pending anchor applies it.
  useEffect(() => {
    restorePendingHash(currentLocale, pathname);
  }, [pathname, currentLocale]);

  return (locale: string) => {
    // Picking the locale already shown changes nothing: stay put, keeping the query and the anchor.
    if (locale === currentLocale) return;
    const query = readCurrentQuery();
    const href = query ? { pathname, query } : pathname;
    const { hash } = window.location;
    pendingHash = hash ? { hash, locale, pathname } : null;

    // With an anchor, scrolling is left to the anchor restore, instead of jumping to the top of the new page first.
    router.push(href, hash ? { locale, scroll: false } : { locale });
  };
}

/**
 * Click handler for a link to the current page in another locale. The link targets the bare page, so a plain
 * click also keeps the current query and section anchor, while a click opening a new tab keeps the link's own address.
 */
export function useLocaleLinkClick() {
  const switchLocale = useSwitchLocale();

  return (event: MouseEvent<HTMLAnchorElement>, locale: string) => {
    const isPlainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPlainClick || (!readCurrentQuery() && !window.location.hash)) return;
    event.preventDefault();
    switchLocale(locale);
  };
}
