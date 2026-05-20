import type { AccentColor, SubscriptionItemKey, UpdateFrequency } from './PricingSimulator.types';

type SubscriptionFreq = Exclude<UpdateFrequency, 'self_managed'>;

export function getRateColorClass(accentColor: AccentColor): string {
  switch (accentColor) {
    case 'amber':
      return 'text-amber-400';
    case 'purple':
      return 'text-purple-400';
    case 'yellow':
      return 'text-yellow-400';
  }
}

export function getSubscriptionItems(freq: SubscriptionFreq): SubscriptionItemKey[] {
  const base: SubscriptionItemKey[] = ['site', 'seo', 'updates', 'domain', 'hosting', 'ssl', 'email'];
  if (freq === 'few_per_year') return base;
  return [...base, 'content_update'];
}

export function getSubscriptionColor(freq: SubscriptionFreq): string {
  switch (freq) {
    case 'few_per_year':
      return 'text-jungle';
    case 'monthly':
      return 'text-blue-400';
    case 'weekly':
      return 'text-royal';
  }
}
