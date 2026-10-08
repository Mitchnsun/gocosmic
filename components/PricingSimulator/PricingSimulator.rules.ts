import type { Region } from '@/lib/region';

import { ARTICLE_TIERS, MAX_EXTRA_MAILBOXES, PAGE_TIERS, TIERED_TABLES, UPDATE_TIERS } from './constants';
import type {
  AddOnKey,
  ArticleTier,
  Formula,
  PlanSelection,
  TieredKey,
  TierIndexOf,
  UpdateTier,
} from './PricingSimulator.types';

/** Clamps any number (slider value, decoded digit…) onto a position of a table of `length` tiers. */
export function clampTier<T extends readonly unknown[]>(value: number, table: T): TierIndexOf<T> {
  const rounded = Math.round(value);
  if (Number.isNaN(rounded) || rounded < 0) return 0 as TierIndexOf<T>;
  return Math.min(rounded, table.length - 1) as TierIndexOf<T>;
}

/** Clamps a mailbox count onto 0…`MAX_EXTRA_MAILBOXES`. */
export function clampMailboxes(value: number): number {
  const rounded = Math.round(value);
  if (Number.isNaN(rounded) || rounded < 0) return 0;
  return Math.min(rounded, MAX_EXTRA_MAILBOXES);
}

/*
 * Visitor actions. They apply the cascades the visitor triggers directly: ticking the email
 * address ticks the domain it lives on, and unticking a parent unticks what hangs from it.
 */

export function setFormula(selection: PlanSelection, formula: Formula): PlanSelection {
  return { ...selection, formula };
}

export function toggleAddOn(selection: PlanSelection, key: AddOnKey): PlanSelection {
  // eslint-disable-next-line security/detect-object-injection -- key is an AddOnKey
  const addOns = { ...selection.addOns, [key]: !selection.addOns[key] };
  if (key === 'email' && addOns.email) addOns.domain = true;
  if (key === 'domain' && !addOns.domain) addOns.email = false;
  if (!addOns.email) addOns.redirects = false;
  return { ...selection, addOns, mailboxes: addOns.email ? selection.mailboxes : 0 };
}

export function toggleTiered(selection: PlanSelection, key: TieredKey): PlanSelection {
  // eslint-disable-next-line security/detect-object-injection -- key is a TieredKey
  const next = { ...selection, [key]: selection[key] === null ? 0 : null };
  if (key === 'analytics' && next.analytics === null) next.addOns = { ...next.addOns, detailed_analytics: false };
  return next;
}

export function setTier(selection: PlanSelection, key: TieredKey, value: number): PlanSelection {
  // eslint-disable-next-line security/detect-object-injection -- key is a TieredKey
  return { ...selection, [key]: clampTier(value, TIERED_TABLES[key]) };
}

export function setMailboxes(selection: PlanSelection, value: number): PlanSelection {
  return { ...selection, mailboxes: selection.addOns.email ? clampMailboxes(value) : 0 };
}

export function setPages(selection: PlanSelection, value: number): PlanSelection {
  return { ...selection, pages: clampTier(value, PAGE_TIERS) };
}

export function toggleUpdates(selection: PlanSelection): PlanSelection {
  return { ...selection, updatesEnabled: !selection.updatesEnabled };
}

/**
 * Moving the slider means the visitor wants the package, even when articles had switched it on.
 * A position below what the articles need is ignored, so it cannot linger once they are removed.
 */
export function setUpdates(selection: PlanSelection, value: number): PlanSelection {
  const updates = clampTier(value, UPDATE_TIERS);
  const floor = getUpdatesFloor(selection.articles);
  if (floor !== null && updates < floor) return selection;
  return { ...selection, updatesEnabled: true, updates };
}

/** Lowest update tier the chosen article rhythm needs, since each published article counts as a change. */
export function getUpdatesFloor(articles: ArticleTier | null): UpdateTier | null {
  if (articles === null) return null;
  // eslint-disable-next-line security/detect-object-injection -- articles is an ArticleTier
  const { minUpdates } = ARTICLE_TIERS[articles];
  return clampTier(
    UPDATE_TIERS.findIndex((tier) => tier.key === minUpdates),
    UPDATE_TIERS
  );
}

/**
 * Applies the rules that depend on context. The visitor's own choices are kept apart (in the hook)
 * and normalised on every render, so they come back when the context changes: the news section
 * returns when switching back to "We take care of everything", and the update slider falls back to
 * the visitor's own choice once articles are removed. Idempotent.
 */
export function normalizePlan(choices: PlanSelection): PlanSelection {
  const addOns = { ...choices.addOns };
  if (!addOns.domain) addOns.email = false;
  if (!addOns.email) addOns.redirects = false;
  if (choices.analytics === null) addOns.detailed_analytics = false;
  // The news section comes with "You stay in control": it is never charged on top.
  if (choices.formula === 'self_service') addOns.news = false;

  const floor = getUpdatesFloor(choices.articles);
  const ownUpdates = choices.updatesEnabled ? choices.updates : null;
  const updates = floor === null ? choices.updates : (Math.max(ownUpdates ?? 0, floor) as UpdateTier);

  return {
    ...choices,
    addOns,
    mailboxes: addOns.email ? clampMailboxes(choices.mailboxes) : 0,
    updatesEnabled: choices.updatesEnabled || floor !== null,
    updates,
  };
}

/** Swiss hosting is offered to visitors from Switzerland only; every other add-on, everywhere. */
export function isAddOnOffered(key: AddOnKey, region: Region): boolean {
  return key !== 'swiss_hosting' || region === 'ch';
}

/** True when articles pushed the update package above what the visitor had chosen. */
export function isUpdatesRaised(choices: PlanSelection): boolean {
  const floor = getUpdatesFloor(choices.articles);
  return floor !== null && (!choices.updatesEnabled || choices.updates < floor);
}
