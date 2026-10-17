# PricingSimulator

Subscription composer shown on the Pricing page (`/pricing`: `/fr/tarifs`, `/es/precios`,
`/de/preise`, `/it/prezzi`). A showcase site is **composed** by the visitor: they pick one of two
formulas, then grow it with tick-boxes, sliders and a mailbox counter, while a sticky recap shows the
itemised plan, the live monthly total and whether the plan commits for 12 months. A guided mode
("Help me choose", `components/PricingGuide`) can tick the options from a few answers. One-off
projects (shop, members' area, app) are not simulated: they are quoted personally from the
"One-off project" column (`components/PricingColumns`) and from the guided mode.

The Services page (`/services`) only summarises the two formulas in its `#simulator` section, with a
button to the Pricing page; older links to `/services#simulator` still land there.

---

## Formulas

| Formula                    | Key            | Price | What it adds                                                       |
| -------------------------- | -------------- | ----- | ------------------------------------------------------------------ |
| We take care of everything | `managed`      | 10    | Nothing: the studio makes every change the client emails           |
| You stay in control        | `self_service` | 20    | An editing tool (news and opening hours only) and the news section |

Both include one page, hosting, HTTPS, the settings to be found on Google (metadata, structured
data, Search Console, sitemap, robots.txt, llms.txt), the legal pages (set up by the studio,
approved by the client), a "Write to us" button opening the visitor's email app, and one content
change a year. The editing tool is never an option: it comes with "You stay in control" and cannot
be removed from it; nothing the client edits themselves exists without it. News published by the
studio are an option in `managed`; `self_service` includes a news section the client publishes in.

The formulas are native radio buttons (`FormulaPicker`), each naming its starting price: choosing
one changes the price, it does not navigate.

---

## Architecture

`components/PricingSimulator/` holds the composer, `components/PricingGuide/` the guided mode; each
file opens with a JSDoc saying what it does, so the code is the map. The entry points:

- `PricingSimulator.tsx` — the guided mode above, the formulas and option groups on the left, the
  recap on the right; it formats the prices once for the visitor's region.
- `PricingSimulator.hooks.ts` — `usePricingSimulator` (raw choices → normalised plan, total, hints,
  the last cascade, actions) and `usePriceFormat`.
- `PricingSimulator.rules.ts` — pure rules: visitor actions (cascades), `getCascade`, `normalizePlan`.
- `PricingSimulator.utils.ts` — `getPlanItems` (recap and email lines), `getCommittedItems`, totals.
- `constants.ts` — the price table: formulas, add-ons, tier tables, one-year sets.
- `lib/pricing/` — what the rest of the site shares: the option list and price lines
  (`price-list.ts`), the plan code, the studio email and its labels.

The hook keeps the visitor's **raw choices** and derives `plan = normalizePlan(choices)`. Total,
recap, plan code and studio email all read the normalised plan, so a choice that the context
cancels comes back when the context changes (the news when returning to `managed`, the email
address when answering again that there is no domain name yet).

The primary action is **"Request my free mockup"**: it stores the composed plan with
`storePlanCode(encodePlanCode(...))` (sessionStorage) before navigating to `/free-mockup`, whose
form sends the simulation along with the request. The plan code still carries `projectType` /
`websiteType`; the composer always sends `website` / `showcase`. The guided mode's answers are never
sent: only the simulation goes along with the request.

---

## Price table

Source of truth: `constants.ts`. Amounts are monthly and **net**: Cosmic Studio is not
registered for VAT, so no VAT is mentioned next to them (`pricing.builder.period` reads
"/ month"); the legal notice and the terms of sale state it.

| Item                                   | Price                       | Commitment             |
| -------------------------------------- | --------------------------- | ---------------------- |
| Pages slider (5 positions)             | +0 / +5 / +15 / +25 / +40   | permanent              |
| Contact form                           | +5                          | one month's notice     |
| Online booking (Google Calendar)       | +5                          | one month's notice     |
| Customer reviews (updated monthly)     | +5                          | one month's notice     |
| English version                        | +5                          | 1 year                 |
| News published for you (`managed`)     | +10 / +25 / +100            | 1 year, rhythm lowered |
| Domain name (required without one)     | +5                          | 1 year                 |
| Email address on the domain            | +15                         | 1 year                 |
| Extra mailboxes (0 to 5)               | +10 each                    | 1 year                 |
| Forwarding addresses (up to 5)         | +5                          | 1 year                 |
| Hosting on a Swiss server (Swiss only) | +10                         | permanent              |
| Following your place on Google         | +5 / +15                    | 1 year                 |
| Visit statistics (3 report rhythms)    | +5 / +15 / +50              | 1 year                 |
| Detailed statistics (consent banner)   | +5                          | 1 year                 |
| Changes to the pages (5 positions)     | +5 / +20 / +50 / +75 / +250 | adjustable             |
| AI-assisted articles (4 rhythms)       | +10 / +25 / +100 / +250     | 1 year, rhythm lowered |

"1 year" options (`ONE_YEAR_OPTIONS` in `constants.ts`, the domain name and the email address
included) run in 12-month periods and can be removed at the end of a period. Together with "You stay
in control" (`ONE_YEAR_FORMULAS`), they turn the whole subscription into 12-month periods, wear the
"1-year commitment" badge and are named in the recap's commitment line. The number of pages and
Swiss hosting stay in the subscription once enabled; the other options stop with one month's notice.
The terms of sale (`legal.terms.sections[3..5]`) spell out every rule.

### Rules the tables alone do not carry

Visitor actions (cascades, in `PricingSimulator.rules.ts`):

- unticking the email address resets the extra mailboxes and the forwarding addresses;
- unticking statistics unticks the detailed statistics.

Both are announced in the row's live note while nothing else happens (`getCascade`, `cascades.*`).

Context rules (`normalizePlan`, idempotent):

- **the domain follows the answer to "Do you already have a domain name?"**: "No" (`ownDomain:
false`) ticks and locks the domain, which counts in the total; "Yes" (`true`) leaves the domain,
  the email address and its extras out, and shows a note offering help on a quote; no answer
  (`null`, the initial state) leaves them out too, so the simulator starts at the cheapest plan;
- the email address only exists with the domain, its extras only with the email address;
- news are never charged in `self_service`;
- news and AI-assisted articles **do not count as content changes**: they never touch the changes
  slider.

Other rules:

- **One content change a year is included**: the changes package is opt-in, its unticked state
  reads "Once a year (included)", its slider says how to enable it, and it starts at +5.
- **The top position of a volume is still priced** (pages, updates, 5 mailboxes), and surfaces a
  note saying that anything beyond it is quoted personally. The pages slider's top position also
  reads "+40 € or more" (`pricing.builder.pages.or_more`).
- **"More options"** (`ADVANCED_OPTIONS`, next to `OPTION_GROUPS` in `lib/pricing/price-list.ts`)
  folds the options for precise needs. The sentence under its button, shown even when closed, gives
  examples rather than a list, as some options only show in one region or with another one. The
  button counts the ticked ones, and the recap keeps listing them while the section is closed.
  Forwarding addresses only show once the email address is ticked.

Both currencies quote the same number — only the symbol changes (`formatAmount`), matching how
the rest of the site handles `eur` / `chf` (see `lib/region.ts`). Pages pass their locale so prices
follow the language's conventions (`10 €` in French, `€10` in English, `CHF 10`…); without a locale,
as in the studio's internal emails, the compact `10€` form is kept.

### One list of options

`OPTION_GROUPS` (`lib/pricing/price-list.ts`) lists every priced option once, in display order:
the recap (`ITEM_ORDER` in `PricingSimulator.utils.ts`) is derived from it, the price list of
`/llms-full.txt` and the structured data read it, and a test checks that a plan with everything
ticked bills each of its options. The group components must show the options of their group.

---

## Guided mode

"Help me choose" sits above the simulator and asks **one question at a time**; the simulator stays
visible below, with its prices. The first question decides where it goes:

- no site yet, or a site to redo → the questions below, then "See my plan";
- a site to keep, with help → a sentence and a link to the contact page;
- an online shop, a members' area or an app → a sentence and a quote link to the contact page.

| Question                                  | Choice it sets                                                     |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Who will make the changes on your site?   | Formula                                                            |
| Do you already have a domain name?        | `ownDomain`                                                        |
| How many pages do you want?               | Pages ("I don't know yet" → one page)                              |
| How do your customers reach you?          | Contact form, booking (several answers)                            |
| Do you want an email address in your own… | Email, plus one extra mailbox for "…for my team" (no domain only)  |
| Do you publish news?                      | News rhythm (`managed` only)                                       |
| How often does your information change?   | Changes slider ("Once a year is enough" → the yearly one included) |

`getSteps(answers)` (`PricingGuide.utils.ts`) lists the questions to ask given the answers so far:
the email question only without a domain name, the news question only when the studio makes the
changes. "Question n of N", "Back" and "Next" follow that list.

- **Pointer or keyboard**: an answer clicked or tapped moves on to the next question; with the
  keyboard, the arrows only change the answer and "Next" moves on. The contact question (several
  answers) never moves on by itself. Focus follows the question shown.
- **Enter** only submits on the last question; on the others it does nothing.
- **Endings**: the contact and quote endings appear in a live region, announced when they show.
- **Replace warning**: when options are already ticked, "See my plan" first asks before replacing
  them; focus goes to "Replace", and back to "See my plan" on "Cancel".

`answersToChoices()` turns the answers into a normalised `PlanSelection`, which the hook's
`replaceChoices` action puts in place. The visitor then lands in the simulator, its options ticked,
focus on the chosen formula, everything adjustable.

The state lives in `usePricingGuide` (`PricingGuide.hooks.ts`); `PricingGuide.tsx` only lays it out,
and `GuideQuestion.tsx` renders the current question with `ChoiceGroup` (`design-system/choice-group.tsx`).
The answers that are steps of a slider (pages, changes) reuse the simulator's wording
(`builder.pages.tiers.*`, `builder.updates.tiers.*`).

---

## Plan code

`lib/pricing/plan-code.ts` serialises a simulation into 14 `~`-separated segments, behind a version:

```
v2~website~showcase~managed~d0~p2~u3~n-~a1~s-~r-~m0~domain.email~fr
version project site formula domain pages updates news statistics seo articles mailboxes add-ons region
```

`d-` is an unanswered domain question, `d0` no domain of one's own, `d1` one already. `-` marks an
unticked tier or an empty list. `encodePlanCode` normalises the plan first and keeps Swiss hosting
for the Swiss version only; `decodePlanCode` only accepts canonical codes of the current version
(`encode(decode(x)) === x`): a code of another version, or one that breaks a rule (email without
domain, news charged in `self_service`, a domain alongside one of the client's own…), is rejected and
the request is sent without the simulation. **Bump `PLAN_CODE_VERSION` whenever the segments, the
add-on list or a tier table changes** (a tier is stored by its position). Prices are never encoded:
the studio email (`lib/pricing/plan-email.ts`, labels in `plan-labels.ts`, typed by tier key)
recomputes them from the table.

---

## Translations

Keys live under `pricing.*` in `messages/<locale>/pricing.json` (5 locales, kept aligned by
`__tests__/i18n/messages.test.ts`). The Pricing page's own copy (meta, intro) lives under
`pricingPage.*` in `pricing-page.json`, kept apart because the whole `pricing` namespace is sent to
the browser.

| Key                         | Used by                                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `free_offers.*`             | `FreeOffers`, above the simulator                                                                              |
| `quoted_services.*`         | `QuotedServices`, under the simulator                                                                          |
| `builder.formulas.*`        | `FormulaPicker`, `BaseCard` heading, recap                                                                     |
| `builder.base.*`            | `BaseCard`: what each formula includes and its info bubbles                                                    |
| `builder.groups.*`          | Option group titles; `more` names the "More options" button                                                    |
| `builder.more.*`            | "More options": ticked count and intro, shown even when closed                                                 |
| `builder.domain_question.*` | The domain question, in the simulator and the guided mode                                                      |
| `builder.options.<key>.*`   | `label`, `hint`, `info` of each add-on; `slider_label` and `tiers` of tiered options; mailbox counter wording  |
| `builder.pages.tiers.*`     | Pages slider, keyed by `PAGE_TIERS[].key`                                                                      |
| `builder.updates.*`         | Changes tick-box (one hint per formula), its info, its disabled hint and its slider (`UPDATE_TIERS[].key`)     |
| `builder.commitment`        | "1-year commitment" badge                                                                                      |
| `builder.commitment_line.*` | Recap: no commitment, or 12-month periods with `{items}`, named by `builder.commitment_items.*`                |
| `builder.cascades.*`        | What unticking an option removed along with it                                                                 |
| `builder.total.*`           | `PlanSummary`: total, note (`<link>` to the terms), CTA, mobile CTA, "beyond this" note                        |
| `guide.*`                   | `PricingGuide`: title, intro, progress, back / next / submit, questions and answers, outcomes, replace warning |
| `columns.*`                 | `PricingColumns` — the four columns (subscription, guidance, reinforcement, custom), homepage and Services     |

The two-formula section of the Services page lives in `services.simulator.*` (its lead quotes both
formula prices); its button reads `pricing.columns.subscription.cta`.

Wording targets a non-technical reader: no "SSL", no "CMS", no "forfait" — the padlock, an
editing space, and plain monthly prices instead.

---

## Changing a price

1. Edit the number in `constants.ts` — nothing else hardcodes a subscription amount.
   The code handover delay lives in `lib/pricing/offers.ts`.
2. If a tier's wording changes, update its key in all 5 locale files and in `TIER_LABELS`. If a tier
   table gains, loses or reorders a step, bump `PLAN_CODE_VERSION`.
3. Search `__tests__` for the old amount: the simulator, price list, plan email and `/llms-full.txt`
   tests assert prices and composed totals.

## Adding a new add-on

1. Add the key to `ADD_ON_PRICES` (`constants.ts`, appended) and bump `PLAN_CODE_VERSION`
   (`lib/pricing/plan-code.ts`); `AddOnKey`, `ADD_ON_KEYS` and `INITIAL_SELECTION` follow. Add it to
   `ONE_YEAR_OPTIONS` if it runs for a year.
2. Add `builder.options.<key>.label`, `.hint` and `.info` to all 5 locale files, its English label
   to `ADD_ON_LABELS` (`lib/pricing/plan-labels.ts`), and, if it commits for a year, its name to
   `builder.commitment_items`.
3. Place it in `OPTION_GROUPS` (`lib/pricing/price-list.ts`, and `ADVANCED_OPTIONS` if it belongs
   under "More options") and in the matching group component (`SiteOptions`, `AddressOptions`,
   `CareOptions`, `MoreOptions`); the recap order follows `OPTION_GROUPS`.
4. `/llms-full.txt` and the structured data pick it up from `OPTION_GROUPS`; check `lib/llms/full/pricing.ts`
   if the simulator shows it only with one plan, in one region or under a condition.
5. Update the terms of sale ("Options", "Duration and commitment") if it changes what can be removed,
   and when, in the same change.
