export type ProjectType = 'website' | 'mobile' | 'both';

/** `showcase` opens the plan builder; every other type leads to a custom quote. */
export type WebsiteType = 'showcase' | 'self_managed' | 'accounts' | 'ecommerce';

/** Add-ons the visitor ticks on top of the base plan. */
export type AddOnKey = 'domain' | 'swiss_hosting' | 'email';

/** Zero-based position on a five-step slider. */
export type TierIndex = 0 | 1 | 2 | 3 | 4;

export interface PlanSelection {
  addOns: Record<AddOnKey, boolean>;
  pages: TierIndex;
  /** The update package is opt-in: its slider only counts once enabled. */
  updatesEnabled: boolean;
  updates: TierIndex;
}
