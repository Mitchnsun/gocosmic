'use client';

import { cn } from '@/design-system/lib/utils';

import type { AccentColor } from './PricingSimulator.types';
import { getRateColorClass } from './PricingSimulator.utils';

export interface RateCardProps {
  title: string;
  rate: string;
  rateNote: string;
  description: string;
  disclaimer: string;
  noFixedPrice?: string;
  accentColor: AccentColor;
}

export function RateCard({ title, rate, rateNote, description, disclaimer, noFixedPrice, accentColor }: RateCardProps) {
  const colorClass = getRateColorClass(accentColor);

  return (
    <div className="space-y-4">
      <h3 className={cn('text-xl font-bold sm:text-2xl', colorClass)}>{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-4xl font-extrabold', colorClass)}>{rate}</span>
        <sup className={cn('text-sm', colorClass)}>{rateNote}</sup>
      </div>
      <p className="text-gray-300">{description}</p>
      {noFixedPrice && (
        <p className="rounded-md bg-slate-700/50 px-4 py-3 text-sm font-medium text-gray-200 italic">{noFixedPrice}</p>
      )}
      <p className="text-xs text-gray-500">{disclaimer}</p>
    </div>
  );
}
