'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

export const STORAGE_KEY = 'gocosmic.analytics-consent';

export type ConsentChoice = 'accepted' | 'refused';

type CookieConsentContextType = {
  isReady: boolean;
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

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isDismissable, setIsDismissable] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;
    if (stored === 'accepted' || stored === 'refused') {
      setChoice(stored);
      setAnalyticsEnabled(stored === 'accepted');
    }
    setIsReady(true);
  }, []);

  const openManage = () => {
    setIsCustomizing(true);
    setIsDismissable(true);
    setChoice(null);
  };

  const closeManage = () => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;
    if (stored === 'accepted' || stored === 'refused') {
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
        isReady,
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
