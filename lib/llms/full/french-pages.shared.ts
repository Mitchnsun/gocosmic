import { PROJECTS_BY_SLUG } from '@/components/CaseStudy';
import { buildExamplePlan } from '@/components/ContentPage/ContentPage.utils';
import { getCommitmentLine, getPlanItemLabel } from '@/components/PricingSimulator/PricingSimulator.labels';
import { getMonthlyTotal, getPlanItems } from '@/components/PricingSimulator/PricingSimulator.utils';
import type { ExamplePlan } from '@/data/content-pages';

import { FR } from '../llms.messages';
import { frenchPageUrl, inEurosInFrench, item, link, list } from '../llms.utils';

/** The case studies backing a French page, each with the description of its card. */
export const projectLinks = (slugs: readonly (keyof typeof PROJECTS_BY_SLUG)[]) =>
  list(
    slugs.map((slug) => {
      const { href, i18nKey } = PROJECTS_BY_SLUG[slug];
      const title = FR.projectsList(`items.${i18nKey}.title`);
      return `${link(title, frenchPageUrl(href))}: ${FR.projectsList(`items.${i18nKey}.description`)}`;
    })
  );

/** An example composition, line by line in euros, with its total, its commitment and the note under it. */
export function examplePlanText(example: ExamplePlan): string {
  const plan = buildExamplePlan(example);
  const lines = getPlanItems(plan).map(
    (line) =>
      `${getPlanItemLabel(FR.pricing, plan, line)}: ${line.id === 'formula' ? '' : '+'}${inEurosInFrench(line.amount)}`
  );
  const total = `${inEurosInFrench(getMonthlyTotal(plan))} ${FR.pricing('builder.period')}`;

  return [
    list(lines),
    item(FR.contentPages('example.total'), total),
    getCommitmentLine(FR.pricing, plan),
    FR.contentPages('example.note'),
  ].join('\n\n');
}
