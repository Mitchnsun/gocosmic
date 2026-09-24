import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { PROJECT_FLOORS } from '@/lib/pricing/offers';
import { getCurrency, type Region } from '@/lib/region';

import type { PricingColumnContent } from './PricingColumns.types';

/** Translator scoped to the `pricing.columns` messages. */
type ColumnsTranslator = (key: string, values?: Record<string, string>) => string;

/** Builds both pricing columns from the `pricing.columns` messages and the typed price table. */
export function buildPricingColumns(
  t: ColumnsTranslator,
  region: Region,
  locale: string
): { subscription: PricingColumnContent; project: PricingColumnContent } {
  const currency = getCurrency(region);
  const price = (amount: number) => formatAmount(amount, currency, locale);

  return {
    subscription: {
      label: t('subscription.label'),
      price: t('subscription.price', { price: price(BASE_PRICE) }),
      period: t('subscription.period'),
      description: t('subscription.description'),
      features: [
        t('subscription.features.included'),
        t('subscription.features.options'),
        t('subscription.features.mockup'),
      ],
      cta: { text: t('subscription.cta'), href: { pathname: '/services', hash: 'simulator' } },
    },
    project: {
      label: t('project.label'),
      price: t('project.price'),
      description: t('project.description'),
      features: [
        t('project.features.floors', {
          members: price(PROJECT_FLOORS.members),
          shop: price(PROJECT_FLOORS.shop),
          mobile: price(PROJECT_FLOORS.mobile),
        }),
        t('project.features.payment'),
        t('project.features.ownership'),
      ],
      cta: { text: t('project.cta'), href: '/contact' },
    },
  };
}
