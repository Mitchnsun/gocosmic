import { BASE_PRICE } from '@/components/PricingSimulator/constants';

import { EN } from '../llms.messages';
import { inBothCurrencies, item, keysOf, link, pageUrl, section, valuesOf } from '../llms.utils';

/** The free mockup: what to send and what comes back. */
export function buildFreeMockupSection(): string {
  const t = EN.freeMockup;
  const steps = keysOf(t.raw('steps.items')).map((key) =>
    item(t(`steps.items.${key}.title`), t(`steps.items.${key}.description`))
  );

  return section(link(EN.footer('free_mockup_page'), pageUrl('/free-mockup')), [
    t('intro'),
    section(t('steps.title'), [steps.join('\n')], 3),
  ]);
}

/** About: the founder's background and why a small studio. */
export function buildAboutSection(): string {
  const t = EN.about;
  const price = { price: inBothCurrencies(BASE_PRICE) };
  const reasons = keysOf(t.raw('why.reasons')).map((key) =>
    item(t(`why.reasons.${key}.title`), t(`why.reasons.${key}.description`, price))
  );

  return section(link(EN.footer('link_about'), pageUrl('/about')), [
    t('lead'),
    section(t('path.title'), valuesOf(t.raw('path.paragraphs')), 3),
    section(t('why.title'), [t('why.lead'), reasons.join('\n')], 3),
  ]);
}

/** The local page: where the studio meets its clients in person. */
export function buildLocalSection(): string {
  const t = EN.local;
  const zones = keysOf(t.raw('zones.items')).map((key) =>
    item(t(`zones.items.${key}.title`), t(`zones.items.${key}.description`))
  );

  return section(link(EN.footer('local_page'), pageUrl('/local')), [
    t('intro.lead.fr'),
    section(t('zones.title'), [zones.join('\n')], 3),
  ]);
}
