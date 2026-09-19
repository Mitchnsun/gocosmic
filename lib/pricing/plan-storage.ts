import { decodePlanCode, encodePlanCode } from '@/lib/pricing/plan-code';

/** sessionStorage key holding the pricing simulation on its way to the mockup form. */
export const PLAN_STORAGE_KEY = 'gocosmic.pricingPlan';

/** Stores a plan code, ignoring storage failures (private browsing, blocked storage). */
export const storePlanCode = (code: string): void => {
  try {
    window.sessionStorage.setItem(PLAN_STORAGE_KEY, code);
  } catch {
    // The request is then sent without the simulation.
  }
};

/**
 * Reads the stored plan code. The value is editable by the visitor, so it is
 * re-validated and returned re-encoded: only a canonical code comes out.
 */
export const readStoredPlanCode = (): string | null => {
  try {
    const plan = decodePlanCode(window.sessionStorage.getItem(PLAN_STORAGE_KEY));
    return plan ? encodePlanCode(plan) : null;
  } catch {
    return null;
  }
};

/** Forgets the stored plan, ignoring storage failures. */
export const clearStoredPlanCode = (): void => {
  try {
    window.sessionStorage.removeItem(PLAN_STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
};
