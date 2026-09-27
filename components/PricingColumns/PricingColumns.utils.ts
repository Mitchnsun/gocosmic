import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { getCurrency, type Region } from '@/lib/region';

import type { PricingColumnContent } from './PricingColumns.types';

/** Translator scoped to the `pricing.columns` messages. */
type ColumnsTranslator = (key: string, values?: Record<string, string>) => string;

/** Builds the four pricing columns from the `pricing.columns` messages and the typed price table. */
export function buildPricingColumns(t: ColumnsTranslator, region: Region, locale: string): PricingColumnContent[] {
  const currency = getCurrency(region);
  const price = (amount: number) => formatAmount(amount, currency, locale);

  return [
    {
      title: t('subscription.title'),
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
    {
      title: t('guidance.title'),
      label: t('guidance.label'),
      price: t('guidance.price'),
      description: t('guidance.description'),
      features: [t('guidance.features.architecture'), t('guidance.features.design'), t('guidance.features.designer')],
      cta: { text: t('guidance.cta'), href: '/contact' },
    },
    {
      title: t('reinforcement.title'),
      label: t('reinforcement.label'),
      price: t('reinforcement.price'),
      description: t('reinforcement.description'),
      features: [
        t('reinforcement.features.technical'),
        t('reinforcement.features.features'),
        t('reinforcement.features.team'),
      ],
      cta: { text: t('reinforcement.cta'), href: '/contact' },
    },
    {
      title: t('custom.title'),
      label: t('custom.label'),
      description: t('custom.description'),
      features: [t('custom.features.payment'), t('custom.features.ownership')],
      cta: { text: t('custom.cta'), href: '/contact' },
    },
  ];
}
