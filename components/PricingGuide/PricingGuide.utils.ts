import { INITIAL_SELECTION, NEWS_TIERS, PAGE_TIERS, UPDATE_TIERS } from '@/components/PricingSimulator/constants';
import { clampTier, normalizePlan } from '@/components/PricingSimulator/PricingSimulator.rules';
import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';

import type { GuideAnswers, GuideOutcome, GuideStep } from './PricingGuide.types';

export const INITIAL_ANSWERS: GuideAnswers = {
  situation: null,
  existingPlan: null,
  editor: null,
  ownDomain: null,
  pages: null,
  contact: [],
  email: null,
  news: null,
  updates: null,
};

/**
 * Where the first answers lead: a site to create or to redo goes on to the questions and the
 * composition; keeping a site and being helped goes to the contact page; a shop, a members' area or
 * an app goes to a quote. `null` until the visitor has said enough.
 */
export function getOutcome({ situation, existingPlan }: GuideAnswers): GuideOutcome {
  if (situation === 'custom') return 'quote';
  if (situation === 'new') return 'compose';
  if (situation !== 'existing' || existingPlan === null) return null;
  return existingPlan === 'redo' ? 'compose' : 'contact';
}

/**
 * The questions to ask, in order, given the answers so far: the email question only without a domain
 * name of one's own, the news question only when the studio makes the changes.
 */
export function getSteps(answers: GuideAnswers): GuideStep[] {
  const opening: GuideStep[] = answers.situation === 'existing' ? ['situation', 'existing'] : ['situation'];
  if (getOutcome(answers) !== 'compose') return opening;
  return [
    ...opening,
    'editor',
    'domain',
    'pages',
    'contact',
    ...(answers.ownDomain === 'no' ? (['email'] as const) : []),
    ...(answers.editor === 'self' ? [] : (['news'] as const)),
    'updates',
  ];
}

/** Position of a key in a tier table, or `null` when it is not one of its steps. */
const tierOf = (table: readonly { key: string }[], key: string | null) => {
  const index = table.findIndex((tier) => tier.key === key);
  return index === -1 ? null : index;
};

/**
 * Turns the answers into the simulator's choices, normalised. A question left unanswered leaves its
 * options unticked; "I don't know yet" keeps one page, to be adjusted.
 */
export function answersToChoices(answers: GuideAnswers): PlanSelection {
  const formula = answers.editor === 'self' ? 'self_service' : 'managed';
  const ownDomain = answers.ownDomain === null ? null : answers.ownDomain === 'yes';
  const email = ownDomain === false && (answers.email === 'yes' || answers.email === 'team');
  const updates = tierOf(UPDATE_TIERS, answers.updates);
  const news = formula === 'managed' ? tierOf(NEWS_TIERS, answers.news) : null;

  return normalizePlan({
    ...INITIAL_SELECTION,
    formula,
    ownDomain,
    addOns: {
      ...INITIAL_SELECTION.addOns,
      contact_form: answers.contact.includes('form'),
      booking: answers.contact.includes('booking'),
      email,
    },
    pages: clampTier(tierOf(PAGE_TIERS, answers.pages) ?? 0, PAGE_TIERS),
    updatesEnabled: updates !== null,
    updates: clampTier(updates ?? 0, UPDATE_TIERS),
    news: news === null ? null : clampTier(news, NEWS_TIERS),
    mailboxes: email && answers.email === 'team' ? 1 : 0,
  });
}
