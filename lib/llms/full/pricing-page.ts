import { EN } from '../llms.messages';
import { item, keysOf, link, pageUrl, section } from '../llms.utils';
import { buildPricingSections } from './pricing';

/** A card of the pricing page: its title, then one item per entry. */
function buildCard(namespace: 'free_offers' | 'quoted_services'): string {
  const t = (key: string) => EN.pricing(`${namespace}.${key}`);
  const entries = keysOf(EN.pricing.raw(`${namespace}.items`)).map((key) =>
    item(t(`items.${key}.title`), t(`items.${key}.description`))
  );

  return section(`${t('title')} (${t('eyebrow')})`, [entries.join('\n'), t('note')], 3);
}

/** Pricing: the free offers, the full price list of the subscription, then the services quoted apart. */
export function buildPricingPageSection(): string {
  return section(link(EN.footer('link_pricing'), pageUrl('/pricing')), [
    EN.pricingPage('intro.lead'),
    buildCard('free_offers'),
    ...buildPricingSections(),
    buildCard('quoted_services'),
  ]);
}
