'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

export const STORAGE_KEY = 'gocosmic.analytics-consent';

export type ConsentChoice = 'accepted' | 'refused';

type CookieConsentContextType = {
  choice: ConsentChoice | null;
  isCustomizing: boolean;
  isDismissable: boolean;
  analyticsEnabled: boolean;
  openManage: () => void;
  closeManage: () => void;
  saveChoice: (choice: ConsentChoice) => void;
  setIsCustomizing: Dispatch<SetStateAction<boolean>>;
  setAnalyticsEnabled: Dispatch<SetStateAction<boolean>>;
};

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

/** The stored answer, or null without one or when storage is blocked (the banner then asks again). */
const readStoredChoice = (): ConsentChoice | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'accepted' || stored === 'refused' ? stored : null;
  } catch {
    return null;
  }
};

/**
 * Whether a provider has already hydrated in this page. The first one hydrates the server HTML, where the
 * banner is rendered (and stays hidden when a choice is stored), so it reads the choice in an
 * effect. A later one is a client-only mount (a locale switch remounts the layout): it reads the choice
 * right away, so the banner never flashes.
 */
let hasHydrated = false;

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice | null>(() => (hasHydrated ? readStoredChoice() : null));
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isDismissable, setIsDismissable] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => hasHydrated && readStoredChoice() === 'accepted');

  useEffect(() => {
    hasHydrated = true;
    const stored = readStoredChoice();
    if (stored) {
      setChoice(stored);
      setAnalyticsEnabled(stored === 'accepted');
    }
  }, []);

  const openManage = () => {
    setIsCustomizing(true);
    setIsDismissable(true);
    setChoice(null);
  };

  const closeManage = () => {
    const stored = readStoredChoice();
    if (stored) {
      setChoice(stored);
      setAnalyticsEnabled(stored === 'accepted');
    }
    setIsCustomizing(false);
    setIsDismissable(false);
  };

  const saveChoice = (nextChoice: ConsentChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextChoice);
    } catch (err) {
      console.error('[CookieConsent] Failed to persist consent choice:', err);
    }
    setChoice(nextChoice);
    setAnalyticsEnabled(nextChoice === 'accepted');
    setIsDismissable(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        choice,
        isCustomizing,
        isDismissable,
        analyticsEnabled,
        openManage,
        closeManage,
        saveChoice,
        setIsCustomizing,
        setAnalyticsEnabled,
      }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
}
