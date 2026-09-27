import type { ComponentProps } from 'react';

import type { Link } from '@/i18n/navigation';

export interface PricingColumnContent {
  /** Card name, e.g. `Abonnement`. */
  title: string;
  /** Mono label above the title, e.g. `Site, hébergement et suivi`. */
  label: string;
  /** Headline figure or word, e.g. `Dès 10 €` or `Tarif à la journée`. Omitted for the "Sur mesure" card. */
  price?: string;
  /** Unit shown after the price, e.g. `/ mois`. */
  period?: string;
  description: string;
  features: string[];
  cta: { text: string; href: ComponentProps<typeof Link>['href'] };
}
