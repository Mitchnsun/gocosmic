# PricingSimulator

Interactive pricing tool. A showcase site is **composed** by the visitor — a low base price
they grow with tick-boxes and two sliders, with the monthly total updating live. Every other
kind of project leads to a personal quote rather than a figure.

---

## Architecture

```
components/PricingSimulator/
  PricingSimulator.tsx          — orchestrator: renders steps and results, no state
  PricingSimulator.hooks.ts     — usePricingSimulator: all state + derived flags
  PricingSimulator.types.ts     — shared TypeScript types
  PricingSimulator.utils.ts     — pure helpers (total, tier lookup, currency formatting)
  constants.ts                  — the price table: base, add-ons, slider tiers
  OptionButton.tsx              — selectable pill button (steps 1 and 2)
  StepCard.tsx                  — step container
  PlanBuilder.tsx               — the composable showcase plan
  OptionToggle.tsx              — one tickable add-on row, may nest a slider
  TierSlider.tsx                — five-position slider over a native range input
  PriceTotal.tsx                — live monthly total
  QuoteCard.tsx                 — "custom project" result, deliberately figure-free
  ContactBanner.tsx             — mailto CTA banner
  FreeOffers.tsx                — the two no-commitment freebies (rendered by the page)
  index.ts                      — re-export surface
```

`PricingSimulator.tsx` holds no state: `usePricingSimulator()` owns it and returns the
visibility flags, the composed total and the handlers.

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

## Decision graph

```
┌────────────────────────────────────────────────┐
│ Step 1 — What would you like to create?        │
└────────────────────────────────────────────────┘
        │              │                │
   "website"       "mobile"          "both"
        │              │                │
        ▼              └────────┬───────┘
┌──────────────────────────┐    │
│ Step 2 — Which kind?     │    │
└──────────────────────────┘    │
   │      │        │      │     │
   │   "self_    "acc-  "ecom-  │
   │   managed"  ounts" merce"  │
   │      └────────┴──────┴─────┤
   │                            ▼
   │                  ┌──────────────────────┐
"showcase"            │ RESULT — QuoteCard   │
   │                  │ no figure at all     │
   ▼                  │ + ContactBanner      │
┌──────────────────────┐ └──────────────────────┘
│ RESULT — PlanBuilder │
│  base 10                     │
│  + add-on tick-boxes         │
│  + pages slider              │
│  + updates tick-box & slider │
│  = PriceTotal (live)         │
│  + ContactBanner             │
└──────────────────────────────┘
```

---

## Visibility flags

Derived in `usePricingSimulator()` from `projectType` and `websiteType`.

| Flag               | Condition                                             | Effect                      |
| ------------------ | ----------------------------------------------------- | --------------------------- |
| `showWebsiteTypes` | `projectType === 'website'`                           | Renders step 2              |
| `showPlanBuilder`  | `showWebsiteTypes && websiteType === 'showcase'`      | Renders the plan builder    |
| `showQuote`        | mobile, both, or any website type other than showcase | Renders `QuoteCard`         |
| `showQuoteHint`    | either slider sits on its top position                | Adds the "beyond this" note |

---

## Translations

Keys live under `pricing.*` in `messages/<locale>/pricing.json` (5 locales).

| Key                     | Used by                                              |
| ----------------------- | ---------------------------------------------------- |
| `free_offers.*`         | `FreeOffers`, rendered above the simulator           |
| `step1.*` / `step2.*`   | The two `OptionButton` steps                         |
| `builder.base.*`        | Base plan card                                       |
| `builder.options.*`     | Add-on tick-boxes                                    |
| `builder.pages.tiers.*` | Pages slider, keyed by `PAGE_TIER_KEYS`              |
| `builder.updates.*`     | Updates tick-box and its slider (`UPDATE_TIER_KEYS`) |
| `builder.total.*`       | `PriceTotal` and the "beyond this" note              |
| `results.custom.*`      | `QuoteCard`                                          |
| `contact.*`             | `ContactBanner`                                      |

Wording targets a non-technical reader: no "SSL", no "CMS", no "forfait" — the padlock,
editing content yourself, and plain monthly prices instead.

---

## Changing a price

1. Edit the number in `constants.ts` — nothing else hardcodes an amount.
2. If a slider position's wording changes, update its key in all 5 locale files.
3. `__tests__/components/PricingSimulator/PricingSimulator.utils.test.ts` asserts the
   composed totals; update the expected sums there.

## Adding a new add-on

1. Add the key to `AddOnKey` and to `ADD_ON_PRICES` / `ADD_ON_KEYS` in `constants.ts`.
2. Add `builder.options.<key>.label` and `.hint` to all 5 locale files.
3. `PlanBuilder` renders it automatically from `ADD_ON_KEYS`; no JSX change needed.
