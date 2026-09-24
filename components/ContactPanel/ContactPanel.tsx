'use client';

import { useTranslations } from 'next-intl';
import { type KeyboardEvent, useId, useState } from 'react';

import { BookingEmbed } from '@/components/BookingEmbed';
import { ContactForm } from '@/components/ContactForm';
import { cn } from '@/design-system/lib/utils';

type ContactMode = 'message' | 'call';
const MODES: ContactMode[] = ['message', 'call'];

interface ContactPanelProps {
  /** Validated Google Calendar embed URL, or `null` while no booking page exists. */
  bookingUrl: string | null;
}

/**
 * Two ways to get in touch, as tabs: write a message, or book a call.
 * Arrow keys move between the tabs, as the ARIA tabs pattern expects.
 */
export function ContactPanel({ bookingUrl }: ContactPanelProps) {
  const t = useTranslations('contact.modes');
  const [mode, setMode] = useState<ContactMode>('message');
  const baseId = useId();
  const tabId = (tab: ContactMode) => `${baseId}-${tab}-tab`;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length] ?? 'message';
    setMode(next);
    document.getElementById(tabId(next))?.focus();
  };

  return (
    <div className="border-ghost/10 bg-ghost/[0.02] flex flex-col gap-6 rounded-3xl border p-[clamp(1.25rem,3vw,2.25rem)]">
      <div
        role="tablist"
        aria-label={t('label')}
        className="border-ghost/10 bg-void grid grid-cols-2 gap-1 rounded-full border p-1">
        {MODES.map((tab) => (
          <button
            key={tab}
            id={tabId(tab)}
            role="tab"
            type="button"
            aria-selected={mode === tab}
            aria-controls={`${baseId}-${tab}-panel`}
            tabIndex={mode === tab ? 0 : -1}
            onClick={() => setMode(tab)}
            onKeyDown={handleKeyDown}
            className={cn(
              'font-display focus-visible:ring-aerospace/70 h-11 cursor-pointer rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              { 'bg-ghost text-void': mode === tab, 'text-ghost/70 hover:text-ghost': mode !== tab }
            )}>
            {t(tab)}
          </button>
        ))}
      </div>

      {MODES.map((tab) => (
        <div key={tab} id={`${baseId}-${tab}-panel`} role="tabpanel" aria-labelledby={tabId(tab)} hidden={mode !== tab}>
          {tab === 'message' ? <ContactForm variant="embedded" /> : <BookingEmbed url={bookingUrl} />}
        </div>
      ))}
    </div>
  );
}
