/*
 * Figures of the offers presented outside the subscription simulator.
 * Amounts are identical in euros and Swiss francs — only the symbol changes (see `formatAmount`).
 * Everything here is pending the owner's validation of the pricing model (ticket CS-05).
 */

/** Indicative starting price of a one-off project, per kind of project. */
export const PROJECT_FLOORS = {
  members: 3500,
  shop: 5000,
  mobile: 8000,
} as const;

/** Daily rate of a mission reinforcing an existing team, excluding VAT. */
export const MISSION_DAY_RATE = 600;

/** Months of subscription after which the source code is handed over at no cost. */
export const CODE_HANDOVER_MONTHS = 36;
