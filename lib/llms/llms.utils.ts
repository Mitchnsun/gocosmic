import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { getCanonicalUrl } from '@/i18n/canonical';
import { routing } from '@/i18n/routing';

type RouteKey = keyof typeof routing.pathnames;

/** URL of a page in the version both files link to: English, with prices in euros. */
export const pageUrl = (route: RouteKey) => getCanonicalUrl(routing.defaultLocale, route);

/** URL of a page published in French only, in its version with prices in euros. */
export const frenchPageUrl = (route: RouteKey) => getCanonicalUrl('fr', route);

/** An amount in euros as the French pages show it, e.g. "10 €". */
export const inEurosInFrench = (amount: number) => formatAmount(amount, 'eur', 'fr');

export const link = (label: string, url: string) => `[${label}](${url})`;

/** A list item with a bold lead, e.g. "**Craftspeople**: Carpenter, plumber…", and optional nested items. */
export const item = (lead: string, text?: string, children: readonly string[] = []) =>
  [`- **${lead}**${text ? `: ${text}` : ''}`, ...children.map((child) => `  - ${child}`)].join('\n');

export const list = (items: readonly string[]) => items.map((entry) => `- ${entry}`).join('\n');

/** A heading followed by its blocks, blank lines between them; empty blocks are left out. */
export const section = (heading: string, blocks: readonly (string | undefined)[], level = 2) =>
  [`${'#'.repeat(level)} ${heading}`, ...blocks.filter(Boolean)].join('\n\n');

/** The site charges the same amounts in euros and Swiss francs, e.g. "€10 / CHF 10". */
export const inBothCurrencies = (amount: number) =>
  `${formatAmount(amount, 'eur', 'en')} / ${formatAmount(amount, 'chf', 'en')}`;

/** A surcharge in both currencies, e.g. "+€5 / +CHF 5". */
export const surchargeInBothCurrencies = (amount: number) =>
  `+${formatAmount(amount, 'eur', 'en')} / +${formatAmount(amount, 'chf', 'en')}`;

/** A whole text file: its blocks separated by blank lines, ending with a newline. */
export const toTextFile = (blocks: readonly string[]) => `${blocks.join('\n\n')}\n`;

/** Values of a translated list or map, e.g. the bullet points of a case study, in their declared order. */
export const valuesOf = (raw: unknown) => Object.values(raw as Record<string, string>);

/** Keys of a translated map, e.g. the audiences of the homepage, in their declared order. */
export const keysOf = (raw: unknown) => Object.keys(raw as Record<string, unknown>);
