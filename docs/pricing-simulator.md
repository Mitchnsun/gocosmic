# PricingSimulator

Subscription composer shown on the Services & pricing page (`/services#simulator`). A
showcase site is **composed** by the visitor: they pick one of two formulas, then grow it with
tick-boxes, sliders and a mailbox counter, while a sticky recap shows the itemised plan and the
live monthly total. One-off projects (shop, members' area, app) are not simulated: they are
quoted personally from the "One-off project" column (`components/PricingColumns`).

---

## Formulas

| Formula                    | Key            | Price | What it adds                                                       |
| -------------------------- | -------------- | ----- | ------------------------------------------------------------------ |
| We take care of everything | `managed`      | 10    | Nothing: the studio makes every change the client emails           |
| You stay in control        | `self_service` | 20    | An editing tool (news and opening hours only) and the news section |

Both include one page, hosting, HTTPS, the legal pages (set up by the studio, approved by the
client), a "Write to us" button opening the visitor's email app, and one content change a year.
The editing tool is never an option: it comes with "You stay in control" and cannot be removed
from it; nothing the client edits themselves exists without it. The news section is an option in
`managed` and included in `self_service`.

---

## Architecture

```
components/PricingSimulator/
  PricingSimulator.tsx        — formula tabs + builder on the left, recap on the right (outside the tabs,
                                so the live total keeps being announced when the formula changes)
  PricingSimulator.hooks.ts   — usePricingSimulator (raw choices → normalised plan, total, hints, actions);
                                usePriceFormat (price / surcharge formatters for the page locale)
  PricingSimulator.rules.ts   — pure rules: visitor actions (cascades) and normalizePlan (context rules)
  PricingSimulator.utils.ts   — getPlanItems (recap and email lines), total, quote hint, formatAmount
  PricingSimulator.types.ts   — shared types (also used by lib/pricing)
  constants.ts                — the price table: formulas, add-ons, tier tables, commitments
  FormulaTabs.tsx             — the two formulas as tabs (design-system/tabs)
  PlanBuilder.tsx             — BaseCard, then the four option groups
  BaseCard.tsx                — formula price and what it includes, with info bubbles
  OptionGroup.tsx             — titled group
  SiteOptions.tsx             — pages slider, contact form, booking, reviews, English, news (managed only)
  AddressOptions.tsx          — domain, email (+ EmailExtras: MailboxCounter and redirects), Swiss hosting
  VisibilityOptions.tsx       — local search follow-up, statistics (+ detailed measurement)
  CareOptions.tsx             — content updates, AI-assisted articles, monitoring
  AddOnOption.tsx             — a tickable add-on with its copy, price, info bubble and commitment
  TieredOption.tsx            — tick-box revealing a slider of tiers
  OptionToggle.tsx            — one row: label + price, hint, commitment badge, live note, info button
  MailboxCounter.tsx          — − / + counter of extra mailboxes
  TierSlider.tsx              — slider over the tiers it is given (design-system/slider, Radix)
  PlanSummary.tsx             — sticky recap: itemised lines, total, free mockup CTA
  PriceTotal.tsx              — live monthly total (an <output> announced politely)
  FreeOffers.tsx              — the two no-commitment freebies (rendered by the page)
```

The hook keeps the visitor's **raw choices** and derives `plan = normalizePlan(choices)`. Total,
recap, plan code and studio email all read the normalised plan, so a choice that the context
cancels comes back when the context changes (the news section when returning to `managed`, the
update slider when articles are removed).

The primary action is **"Request my free mockup"**: it stores the composed plan with
`storePlanCode(encodePlanCode(...))` (sessionStorage) before navigating to `/free-mockup`, whose
form sends the simulation along with the request. The plan code still carries `projectType` /
`websiteType`; the composer always sends `website` / `showcase`.

---

## Price table

Source of truth: `constants.ts`. Amounts are monthly and shown **excl. VAT** everywhere they
appear (`pricing.builder.period`, the legal notice and the terms of sale).

| Item                                  | Price                       | Commitment         |
| ------------------------------------- | --------------------------- | ------------------ |
| Pages slider (5 positions)            | +0 / +5 / +15 / +25 / +40   | permanent          |
| Contact form                          | +5                          | one month's notice |
| Online booking (Google Calendar)      | +5                          | one month's notice |
| Customer reviews (updated monthly)    | +5                          | one month's notice |
| English version                       | +5                          | 1 year             |
| News section (`managed` only)         | +5                          | 1 year             |
| Managing the domain name              | +5                          | permanent          |
| Email address on the domain           | +15                         | permanent          |
| Extra mailboxes (0 to 5)              | +10 each                    | 1 year             |
| 5 redirects                           | +5                          | 1 year             |
| Hosting on a Swiss server             | +10                         | permanent          |
| Local search follow-up (2 positions)  | +5 / +15                    | 1 year             |
| Visit statistics (3 report rhythms)   | +5 / +15 / +50              | 1 year             |
| Detailed measurement (consent banner) | +5                          | 1 year             |
| Updates slider (5 positions)          | +5 / +20 / +30 / +60 / +200 | adjustable         |
| AI-assisted articles (3 rhythms)      | +5 / +15 / +50              | 1 year to stop     |
| Site monitoring                       | +5                          | one month's notice |

"1 year" options (`ONE_YEAR_OPTIONS`) run in 12-month periods and show a "1-year commitment"
badge; the terms of sale (`legal.terms.sections[4..6]`) spell out every rule.

### Rules the tables alone do not carry

Visitor actions (cascades, in `PricingSimulator.rules.ts`):

- ticking the email address ticks the domain; unticking the domain unticks the email address;
- unticking the email address resets the extra mailboxes and the redirects;
- unticking statistics unticks the detailed measurement.

Context rules (`normalizePlan`, idempotent):

- the news section is never charged in `self_service`;
- **each AI-assisted article counts as a content change**: articles switch the update package on,
  lock its tick-box and lift its slider to at least "once a month", "once a week" or "as often as
  needed" (`ARTICLE_TIERS[].minUpdates`); a note says so while the lift is above the visitor's own
  choice.

Other rules:

- **One content change a year is included**: the update package is opt-in, its unticked state
  reads "Once a year (included)", and its slider starts at +5.
- **The top position of a volume is still priced** (pages, updates, 5 mailboxes), and surfaces a
  note saying that anything beyond it is quoted personally. The pages slider's top position also
  reads "+40 € or more" (`pricing.builder.pages.or_more`).

Both currencies quote the same number — only the symbol changes (`formatAmount`), matching how
the rest of the site handles `eur` / `chf` (see `lib/region.ts`). Pages pass their locale so prices
follow the language's conventions (`10 €` in French, `€10` in English, `CHF 10`…); without a locale,
as in the studio's internal emails, the compact `10€` form is kept.

---

## Plan code

`lib/pricing/plan-code.ts` serialises a simulation into 11 `~`-separated segments:

```
website~showcase~managed~p2~u3~a1~s-~r-~m0~domain.email~fr
project  site    formula pages updates statistics seo articles mailboxes add-ons region
```

`-` marks an unticked tier or an empty list. `encodePlanCode` normalises the plan first, and
`decodePlanCode` only accepts canonical codes (`encode(decode(x)) === x`): a code that breaks a
rule (email without domain, news charged in `self_service`, updates below the article rhythm…)
is rejected and the request is sent without the simulation. Prices are never encoded: the studio
email (`lib/pricing/plan-email.ts`, labels in `plan-labels.ts`) recomputes them from the table.

---

## Translations

Keys live under `pricing.*` in `messages/<locale>/pricing.json` (5 locales, kept aligned by
`__tests__/i18n/messages.test.ts`).

| Key                       | Used by                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `free_offers.*`           | `FreeOffers`, rendered under the simulator                                                                           |
| `builder.formulas.*`      | `FormulaTabs`, `BaseCard` heading, recap                                                                             |
| `builder.base.*`          | `BaseCard`: what each formula includes and its info bubbles                                                          |
| `builder.groups.*`        | Option group titles                                                                                                  |
| `builder.options.<key>.*` | `label`, `hint`, `info` of each add-on; `slider_label` and `tiers` of tiered options; mailbox counter wording        |
| `builder.pages.tiers.*`   | Pages slider, keyed by `PAGE_TIERS[].key`                                                                            |
| `builder.updates.*`       | Updates tick-box (one hint per formula) and its slider (`UPDATE_TIERS[].key`)                                        |
| `builder.commitment`      | "1-year commitment" badge                                                                                            |
| `builder.total.*`         | `PlanSummary`: total, note, CTA, "beyond this" note                                                                  |
| `columns.*`               | `PricingColumns` — the four columns (subscription, guidance, reinforcement, custom), homepage and Services & pricing |

The section heading around the simulator lives in `services.simulator.*` (its lead quotes both
formula prices).

Wording targets a non-technical reader: no "SSL", no "CMS", no "forfait" — the padlock, an
editing space, and plain monthly prices instead.

---

## Changing a price

1. Edit the number in `constants.ts` — nothing else hardcodes a subscription amount.
   The code handover delay lives in `lib/pricing/offers.ts`.
2. If a tier's wording changes, update its key in all 5 locale files.
3. `__tests__/components/PricingSimulator/PricingSimulator.utils.test.ts` asserts the composed
   totals; update the expected sums there.

## Adding a new add-on

1. Add the key to `AddOnKey` (`PricingSimulator.types.ts`), `ADD_ON_PRICES`, `ADD_ON_KEYS` and
   `INITIAL_SELECTION` (`constants.ts`), and to `ONE_YEAR_OPTIONS` if it runs for a year.
2. Add `builder.options.<key>.label`, `.hint` and `.info` to all 5 locale files, and its English
   label to `ADD_ON_LABELS` (`lib/pricing/plan-labels.ts`).
3. Place it in its group component (`SiteOptions`, `AddressOptions`…) and in `ITEM_ORDER`
   (`PricingSimulator.utils.ts`) for the recap order.
4. Update the terms of sale if it changes what can be removed, and when.
