import type { Region } from '@/lib/region';

import type { Fact } from './FactsLine';

const FACTS = ['price', 'reply', 'contact', 'area'] as const;

/** Translator scoped to the `homepage` messages. */
type HomepageTranslator = (key: string, values?: Record<string, string>) => string;

/** The homepage hero facts, shared with the local page: starting price, reply time, contact and area of the region. */
export function buildHeroFacts(t: HomepageTranslator, region: Region, price: string): Fact[] {
  return FACTS.map((fact) => {
    const key = fact === 'area' ? `area.${region}` : fact;
    return { highlight: t(`hero.facts.${key}.highlight`, { price }), text: t(`hero.facts.${key}.text`) };
  });
}
