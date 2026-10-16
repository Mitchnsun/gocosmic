import { MAX_EXTRA_MAILBOXES, PAGE_TIERS, TIERED_TABLES, UPDATE_TIERS } from './constants';
import type { AddOnKey, Formula, PlanSelection, TieredKey, TierIndexOf } from './PricingSimulator.types';

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
 * Visitor actions. They apply the cascades the visitor triggers directly: unticking a parent unticks
 * what hangs from it.
 */

export function setFormula(selection: PlanSelection, formula: Formula): PlanSelection {
  return { ...selection, formula };
}

/** Answers "Do you already have a domain name?"; the domain itself follows in `normalizePlan`. */
export function setOwnDomain(selection: PlanSelection, ownDomain: boolean): PlanSelection {
  return { ...selection, ownDomain };
}

export function toggleAddOn(selection: PlanSelection, key: AddOnKey): PlanSelection {
  const addOns = { ...selection.addOns, [key]: !selection.addOns[key] };
  if (!addOns.email) addOns.redirects = false;
  return { ...selection, addOns, mailboxes: addOns.email ? selection.mailboxes : 0 };
}

export function toggleTiered(selection: PlanSelection, key: TieredKey): PlanSelection {
  const next = { ...selection, [key]: selection[key] === null ? 0 : null };
  if (key === 'analytics' && next.analytics === null) next.addOns = { ...next.addOns, detailed_analytics: false };
  return next;
}

export function setTier(selection: PlanSelection, key: TieredKey, value: number): PlanSelection {
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

export function setUpdates(selection: PlanSelection, value: number): PlanSelection {
  return { ...selection, updates: clampTier(value, UPDATE_TIERS) };
}

/** An option that unticking another one removes along with it, announced to the visitor. */
export type Cascade = 'detailed_analytics' | 'email_extras';

/**
 * What unticking `key` would remove along with it, from the visitor's current choices: the detailed
 * statistics with the visit statistics, the extra mailboxes and redirects with the email address.
 */
export function getCascade(choices: PlanSelection, key: 'email' | 'analytics'): Cascade | null {
  const plan = normalizePlan(choices);
  if (key === 'analytics')
    return plan.analytics !== null && plan.addOns.detailed_analytics ? 'detailed_analytics' : null;
  return plan.addOns.email && (plan.mailboxes > 0 || plan.addOns.redirects) ? 'email_extras' : null;
}

/**
 * Applies the rules that depend on context. The visitor's own choices are kept apart (in the hook)
 * and normalised on every render, so they come back when the context changes: the news return when
 * switching back to "We take care of everything", the email address when answering again that there
 * is no domain name yet. Idempotent.
 */
export function normalizePlan(choices: PlanSelection): PlanSelection {
  const addOns = { ...choices.addOns };
  // Without a domain name of their own, the studio manages one for the client; with one, the
  // domain and email options are not offered.
  addOns.domain = choices.ownDomain === false;
  if (!addOns.domain) addOns.email = false;
  if (!addOns.email) addOns.redirects = false;
  if (choices.analytics === null) addOns.detailed_analytics = false;

  return {
    ...choices,
    addOns,
    // "You stay in control" includes a news section the client publishes in: never charged on top.
    news: choices.formula === 'self_service' ? null : choices.news,
    mailboxes: addOns.email ? clampMailboxes(choices.mailboxes) : 0,
  };
}
