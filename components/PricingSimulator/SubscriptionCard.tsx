'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { cn } from '@/design-system/lib/utils';

import type { UpdateFrequency } from './PricingSimulator.types';
import { getSubscriptionColor, getSubscriptionItems } from './PricingSimulator.utils';

type SubscriptionFreq = Exclude<UpdateFrequency, 'self_managed'>;

interface SubscriptionCardProps {
  freq: SubscriptionFreq;
  t: ReturnType<typeof useTranslations<'pricing'>>;
}

export function SubscriptionCard({ freq, t }: SubscriptionCardProps) {
  const color = getSubscriptionColor(freq);
  const items = getSubscriptionItems(freq);

  return (
    <div className="space-y-4">
      <h3 className={cn('text-xl font-bold sm:text-2xl', color)}>{t(`results.subscription.${freq}.title`)}</h3>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-4xl font-extrabold', color)}>{t(`results.subscription.${freq}.price`)}</span>
        <span className="text-sm text-gray-400">{t(`results.subscription.${freq}.duration`)}</span>
      </div>
      <div>
        <p className="mb-3 font-semibold text-white">{t(`results.subscription.${freq}.includes.title`)}</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <CheckCircleIcon className={cn('h-5 w-5 shrink-0', color)} aria-hidden="true" />
              <span className="text-gray-300">{t(`results.subscription.${freq}.includes.items.${item}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
