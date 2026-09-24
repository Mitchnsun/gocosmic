# PricingSimulator

Subscription composer shown on the Services & pricing page (`/services#simulator`). A
showcase site is **composed** by the visitor — a low base price they grow with tick-boxes
and two sliders — while a sticky recap shows the itemised plan and the live monthly total.
One-off projects (shop, members' area, app) are not simulated: they are quoted personally
from the "One-off project" column (`components/PricingColumns`).

---

## Architecture

```
components/PricingSimulator/
  PricingSimulator.tsx          — orchestrator: PlanBuilder on the left, PlanSummary on the right
  PricingSimulator.hooks.ts     — usePricingSimulator: the selection + derived total and quote hint
  PricingSimulator.types.ts     — shared TypeScript types (also used by lib/pricing/plan-code)
  PricingSimulator.utils.ts     — pure helpers (total, tier lookup, currency formatting)
  constants.ts                  — the price table: base, add-ons, slider tiers
  PlanBuilder.tsx               — base plan card, add-on tick-boxes and sliders
  OptionToggle.tsx              — one tickable add-on row, may nest a slider
  TierSlider.tsx                — five-position slider over a native range input
  PlanSummary.tsx               — sticky recap: itemised lines, total, free mockup CTA
  PriceTotal.tsx                — live monthly total (an <output> announced politely)
  FreeOffers.tsx                — the two no-commitment freebies (rendered by the page)
  index.ts                      — re-export surface
```

`PricingSimulator.tsx` holds no state: `usePricingSimulator()` owns it and returns the
selection, the composed total and the handlers.

The primary action is **"Request my free mockup"**: it stores the composed plan with
`storePlanCode(encodePlanCode(...))` (sessionStorage) before navigating to `/free-mockup`,
whose form sends the simulation along with the request. The plan code keeps its
`projectType` / `websiteType` fields for compatibility; the composer always sends
`website` / `showcase`.

---

## Price table

Source of truth: `constants.ts`. Amounts are monthly.

| Item                             | Price                       |
| -------------------------------- | --------------------------- |
| Base plan (1 page, hosting, TLS) | 10                          |
| Managing the domain name         | +5                          |
| Hosting on a Swiss server        | +10                         |
| Email address on the domain      | +10                         |
| Pages slider (5 positions)       | +0 / +5 / +10 / +20 / +25   |
| Updates slider (5 positions)     | +5 / +15 / +25 / +50 / +100 |

Two rules the tables alone do not carry:

- **The updates package is opt-in.** Its slider starts at +5, so gating it behind a tick-box
  is what keeps the advertised 10 base price actually reachable.
- **The top position of either slider is still priced**, and additionally surfaces a note
  saying that anything beyond it is quoted personally.

Both currencies quote the same number — only the symbol changes (`formatAmount`), matching
how the rest of the site handles `eur` / `chf` (see `lib/region.ts`).

---

## Translations

Keys live under `pricing.*` in `messages/<locale>/pricing.json` (5 locales).

| Key                     | Used by                                              |
| ----------------------- | ---------------------------------------------------- |
| `free_offers.*`         | `FreeOffers`, rendered under the simulator           |
| `builder.base.*`        | Base plan card                                       |
| `builder.options.*`     | Add-on tick-boxes                                    |
| `builder.pages.tiers.*` | Pages slider, keyed by `PAGE_TIER_KEYS`              |
| `builder.updates.*`     | Updates tick-box and its slider (`UPDATE_TIER_KEYS`) |
| `builder.total.*`       | `PlanSummary`: total, note, CTA, "beyond this" note  |
| `columns.*`             | `PricingColumns` (homepage and Services & pricing)   |

The section heading around the simulator lives in `services.simulator.*`.

Wording targets a non-technical reader: no "SSL", no "CMS", no "forfait" — the padlock,
editing content yourself, and plain monthly prices instead.

---

## Changing a price

1. Edit the number in `constants.ts` — nothing else hardcodes a subscription amount.
   One-off project floors, the mission day rate and the code handover delay live in
   `lib/pricing/offers.ts`.
2. If a slider position's wording changes, update its key in all 5 locale files.
3. `__tests__/components/PricingSimulator/PricingSimulator.utils.test.ts` asserts the
   composed totals; update the expected sums there.

## Adding a new add-on

1. Add the key to `AddOnKey` and to `ADD_ON_PRICES` / `ADD_ON_KEYS` in `constants.ts`.
2. Add `builder.options.<key>.label` and `.hint` to all 5 locale files.
3. `PlanBuilder` and `PlanSummary` render it automatically from `ADD_ON_KEYS`; no JSX change needed.
