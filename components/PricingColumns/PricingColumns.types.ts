import type { ComponentProps } from 'react';

import type { Link } from '@/i18n/navigation';

export interface PricingColumnContent {
  /** Mono label above the price, e.g. `Abonnement · site + suivi`. */
  label: string;
  /** Headline figure or word, e.g. `Dès 10 €` or `Sur mesure`. */
  price: string;
  /** Unit shown after the price, e.g. `/ mois`. */
  period?: string;
  description: string;
  features: string[];
  cta: { text: string; href: ComponentProps<typeof Link>['href'] };
}
