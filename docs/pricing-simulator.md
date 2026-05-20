# PricingSimulator

Interactive multi-step pricing tool that guides a prospect through a series of questions and renders a tailored result card (subscription plan, daily rate, or combined rate).

---

## Architecture

```
components/PricingSimulator/
  PricingSimulator.tsx          — orchestrator: state + conditional rendering
  PricingSimulator.types.ts     — shared TypeScript types
  PricingSimulator.utils.ts     — pure helpers (color maps, item lists)
  OptionButton.tsx              — selectable pill button
  StepCard.tsx                  — animated step container
  RateCard.tsx                  — daily-rate result display
  SubscriptionCard.tsx          — monthly subscription result display
  ContactBanner.tsx             — mailto CTA banner
  index.ts                      — re-export surface
```

State lives entirely in `PricingSimulator.tsx` (3 `useState` values). All child components are stateless and receive props or a translation function `t`.

---

## Decision graph

```
┌──────────────────────────────────────────────────┐
│  Step 1 — Qu'est-ce que vous souhaitez créer ?   │
└──────────────────────────────────────────────────┘
           │              │               │
      "website"        "mobile"         "both"
           │              │               │
           ▼              ▼               ▼
   ┌────────────┐  ┌──────────────┐  ┌──────────────────────────┐
   │  Step 2    │  │ RESULT       │  │ RESULT                   │
   │ Type de    │  │ RateCard     │  │ RateCard                 │
   │ site web ? │  │ Application  │  │ Site Web +               │
   └────────────┘  │ Mobile       │  │ Application Mobile       │
        │   │  │   │ 600€/jour    │  │ 600€/jour (amber)        │
        │   │  │   └──────────────┘  └──────────────────────────┘
        │   │  │         │                       │
        │   │  │    ContactBanner           ContactBanner
        │   │  │
   "showcase" "accounts" "ecommerce"
        │         │           │
        ▼         ▼           ▼
   ┌─────────┐  ┌────────────────────────────────┐
   │ Step 3  │  │ RESULT                         │
   │ Fréq.   │  │ RateCard                       │
   │ màj     │  │ Site Web Personnalisé           │
   │ contenu │  │ 600€/jour (purple)             │
   └─────────┘  │ + mention "pas de forfait"     │
   │  │  │  │   └────────────────────────────────┘
   │  │  │  │                 │
   │  │  │  │           ContactBanner
   │  │  │  │
   │  │  │  └──── "self_managed"
   │  │  │              │
   │  │  │              ▼
   │  │  │    ┌──────────────────────────┐
   │  │  │    │ RESULT                   │
   │  │  │    │ RateCard                 │
   │  │  │    │ CMS Auto-Géré            │
   │  │  │    │ 600€/jour (yellow)       │
   │  │  │    └──────────────────────────┘
   │  │  │                 │
   │  │  │           ContactBanner
   │  │  │
   │  │  └─── "weekly"
   │  │            │
   │  │            ▼
   │  │   ┌──────────────────────────┐
   │  │   │ RESULT                   │
   │  │   │ SubscriptionCard         │
   │  │   │ Abonnement Premium       │
   │  │   │ 150€/mois                │
   │  │   │ (color: royal)           │
   │  │   └──────────────────────────┘
   │  │                  │
   │  │            ContactBanner (inline dans la section)
   │  │
   │  └──── "monthly"
   │              │
   │              ▼
   │     ┌──────────────────────────┐
   │     │ RESULT                   │
   │     │ SubscriptionCard         │
   │     │ Abonnement Standard      │
   │     │ 90€/mois (FR)            │
   │     │ (color: blue-400)        │
   │     └──────────────────────────┘
   │                    │
   │              ContactBanner (inline dans la section)
   │
   └──── "few_per_year"
               │
               ▼
      ┌──────────────────────────┐
      │ RESULT                   │
      │ SubscriptionCard         │
      │ Abonnement Essentiel     │
      │ 60€/mois (FR)            │
      │ (color: jungle)          │
      └──────────────────────────┘
                    │
              ContactBanner (inline dans la section)
```

---

## Visibility flags

All conditional rendering derives from three state values: `projectType`, `websiteType`, `updateFrequency`.

| Flag                     | Condition                                                                        | Effect                                     |
| ------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------ |
| `showStep2`              | `projectType === 'website'`                                                      | Renders Step 2                             |
| `showMobileResult`       | `projectType === 'mobile'`                                                       | Renders mobile RateCard                    |
| `showBothResult`         | `projectType === 'both'`                                                         | Renders combined RateCard, skips Steps 2/3 |
| `showComplexResult`      | `showStep2 && websiteType ∈ {accounts, ecommerce}`                               | Renders complex website RateCard           |
| `showStep3`              | `showStep2 && websiteType === 'showcase'`                                        | Renders Step 3                             |
| `showSubscriptionResult` | `showStep3 && updateFrequency ∈ {few_per_year, monthly, weekly}`                 | Renders SubscriptionCard                   |
| `showCmsResult`          | `showStep3 && updateFrequency === 'self_managed'`                                | Renders CMS RateCard                       |
| `showContactForResult`   | `showMobileResult \|\| showBothResult \|\| showComplexResult \|\| showCmsResult` | Renders shared ContactBanner at the bottom |

> Note: `showSubscriptionResult` embeds its own `ContactBanner` directly inside the section — so the shared bottom banner is intentionally excluded from that path.

---

## Translations

Keys live under `pricing.results.*` in `messages/<locale>/pricing.json` (5 locales: `en`, `fr`, `es`, `de`, `it`).

| Key                                   | Used by                                 |
| ------------------------------------- | --------------------------------------- |
| `results.both.*`                      | `showBothResult` path                   |
| `results.mobile.*`                    | `showMobileResult` path                 |
| `results.complex_website.*`           | `showComplexResult` path                |
| `results.subscription.few_per_year.*` | `showSubscriptionResult` (few_per_year) |
| `results.subscription.monthly.*`      | `showSubscriptionResult` (monthly)      |
| `results.subscription.weekly.*`       | `showSubscriptionResult` (weekly)       |
| `results.subscription.self_managed.*` | `showCmsResult` path                    |

---

## Adding a new result path

1. Add a new state value or extend an existing type in `PricingSimulator.types.ts`.
2. Derive the new visibility flag in `PricingSimulator.tsx`.
3. Add the result section JSX, reusing `RateCard`, `SubscriptionCard`, or a new sub-component.
4. Add translation keys to all 5 locale files under `messages/`.
5. Write a test case in `__tests__/pages/Pricing.test.tsx` covering the new path.
