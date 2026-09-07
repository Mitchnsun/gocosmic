# DESIGN_GUIDELINE.md — Go Cosmic

> Single design reference for building new components and pages **consistent with the homepage**.
> Sources: `app/globals.css` (implemented tokens), shipped components (`Header`, `StatusBar`, `ProcessTimeline`, `CTAFinal`, `HeroSection`…), and the EPIC redesign ticket [#58](https://github.com/Mitchnsun/gocosmic/issues/58).
>
> **For an AI agent:** read this file **before** writing any JSX. The golden rule: never **reinvent** colors, fonts, or spacing — **reuse** the tokens and patterns described here. When in doubt, copy the nearest existing component.

---

## 1. Essence & principles

Go Cosmic is a web/mobile dev studio. The visual universe is **spatial / mission-control**: deep near-black background, starfield, orange "ignition" accents, technical mono labels, and a touch of immersion (parallax, warp, reveals). Yet the overall feel stays **sober and premium** — never gimmicky.

Four principles that resolve every design decision:

1. **Dark by default.** The background is the `void`. Light comes from stars, accent glows, and `ghost` text. No large bright surfaces.
2. **Accent is rare.** `aerospace` orange is a spotlight, not a paint bucket. One strong accent point per zone (a CTA, a gradient heading, a signal dot). Too much orange kills the orange.
3. **Mono speaks "technical".** Eyebrows, coordinates, metadata, statuses use uppercase mono with wide letter-spacing — the site's "HUD" signature.
4. **Restraint > decoration.** Every element must earn its place. No filler, no emoji, no made-up stats. See §7 (anti-slop).

---

## 2. Foundations

### 2.1 Colors

Official tokens declared in `app/globals.css` under `@theme` (Tailwind v4 → available as utilities `bg-void`, `text-ghost`, `text-aerospace`, `border-royal`, …).

| Token          | Hex       | Role                                                          |
| -------------- | --------- | ------------------------------------------------------------- |
| `void`         | `#020617` | **Main background** of the entire site                        |
| `space`        | `#1E2952` | Alternate background / lighter section variant, midnight blue |
| `ghost`        | `#F8F8FF` | **Primary text** on dark backgrounds                          |
| `aerospace`    | `#FF4F00` | **Primary accent** — CTA, attention signal, heading gradients |
| `royal`        | `#7851A9` | Secondary accent — planet, glows, variants                    |
| `jungle`       | `#29AB87` | "System" accent — **availability / online / success**         |
| `cosmic-latte` | `#FFF8E7` | Soft accent / warm off-white (rare)                           |
| `chocolate`    | `#58111A` | Deep brown, orange gradient support (rare)                    |
| `misty-rose`   | `#FFE4E1` | Decorative pale pink (rare)                                   |
| `outer-space`  | `#414A4C` | Neutral slate grey                                            |

**Derived scales** (used everywhere via Tailwind opacity modifiers on `ghost`). Prefer these over raw greys:

| Usage                    | Value                   | Tailwind          |
| ------------------------ | ----------------------- | ----------------- |
| Subtle border / hairline | `rgba(248,248,255,.08)` | `border-ghost/8`  |
| Stronger border          | `rgba(248,248,255,.16)` | `border-ghost/15` |
| Secondary text           | `rgba(248,248,255,.55)` | `text-ghost/55`   |
| Tertiary / meta text     | `rgba(248,248,255,.35)` | `text-ghost/35`   |
| Card surface on void     | `rgba(248,248,255,.02)` | `bg-ghost/[0.02]` |

> ❌ **Never** use `text-blue-300`, `text-gray-400`, raw `slate-*` for brand text. The only tolerated `slate` is the legacy `text-slate-400` on sub-headings; migrate to `text-ghost/55` over time.

**Accent glows** (radial-gradient, layered behind content):

```css
--glow-aerospace: radial-gradient(circle at center, rgb(255 79 0 / 0.35), transparent 60%);
--glow-royal: radial-gradient(circle at center, rgb(120 81 169 / 0.45), transparent 60%);
--glow-jungle: radial-gradient(circle at center, rgb(41 171 135 / 0.4), transparent 60%);
```

Real CTA pattern: `radial-gradient(circle at 50% 60%, rgb(var(--cta-accent-rgb) / 0.22), transparent 60%)`.

### 2.2 Typography

| Font                                       | Variable                          | Usage                                                     |
| ------------------------------------------ | --------------------------------- | --------------------------------------------------------- |
| **Space Grotesk**                          | `--font-display`                  | Headings, names, navigation, buttons, key numbers         |
| **Inter**                                  | `--font-body`                     | Body text, paragraphs                                     |
| **Mono** (`Space Mono` / `JetBrains Mono`) | `--font-mono` → class `font-mono` | Eyebrows, coordinates, statuses, metadata, technical tags |

> `globals.css` currently only declares `--font-display` and `--font-body`. The `font-mono` used in components falls back to the default monospace stack. **Recommendation**: formalize `--font-mono: 'Space Mono', ui-monospace, monospace;` in `@theme` to lock HUD label rendering.

**Characteristics:**

- Headings: weight 500–700, tight negative `tracking` (`-0.02em` to `-0.04em`), `line-height` ~0.95–1.05, `text-wrap: balance` / `pretty`.
- Light italic (weight 300, `font-style: italic`, often `text-ghost/55`) serves as **editorial emphasis** in headings ("Apps _that_ launch").
- Mono: `text-3xs`–`text-2xs`, `uppercase`, `tracking-widest` (≈ `.12em`–`.28em`).

**Indicative scale (clamp, responsive):**

```
Hero h1     clamp(2.5rem, 11vw, 11.25rem)   /* giant, immersive */
Section h2  clamp(2.5rem, 5.5vw, 5.5rem)
CTA h2      clamp(2.25rem, 8vw, 6rem)
Card title  1.5rem – 1.75rem (text-2xl/3xl)
Body        1rem – 1.0625rem ; lead 1.125rem
Mono label  0.625rem – 0.6875rem
```

Minimum readable size: **14px** for body text.

### 2.3 Spacing, layout, radii

- **Container**: `max-w-7xl` centered (`m-auto`), horizontal padding `px-4 sm:px-6 lg:px-8`.
- **Vertical section rhythm**: generous — `py-16` to `py-24` (prototype goes up to 140px on desktop). Sections need room to breathe.
- **Radii**: pills `rounded-full` (buttons, chips, badges); cards/containers `rounded-xl` → `rounded-2xl` (12–24px). No sharp corners on interactive surfaces.
- **Borders**: always via `ghost` opacity (see §2.1), never an opaque grey.
- **Card grids**: "1px gap" pattern — grid with `gap: 1px` on a `line` background, producing thin separators between cards (`ServicesGrid`).

### 2.4 Motion

| Token           | Curve                          | Usage                             |
| --------------- | ------------------------------ | --------------------------------- |
| `--ease-out`    | `cubic-bezier(.16, 1, .3, 1)`  | Enters, reveals, hovers (default) |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | Loops, symmetric transitions      |

- **Durations**: micro-interactions 200–300ms; enters 400–900ms; stagger **50ms** per item (see `MOBILE_MENU_STAGGER_MS`).
- **Signature patterns**: reveal-on-scroll (`opacity 0→1` + `translateY(28px→0)`), list stagger, soft pointer parallax, starfield warp on CTA hover, magnetic buttons, pulsing glow.
- **`prefers-reduced-motion` is mandatory.** Every animated component exposes `respectReducedMotion` (default `true`) and disables animations when requested. Repo pattern: `useState` + `matchMedia('(prefers-reduced-motion: reduce)')` (see `StatusBar`, `ProcessTimeline`) or `usePrefersReducedMotion()`. The data attribute `[data-reduced-motion='true']` disables keyframes in CSS.

---

## 3. Visual vocabulary (signature elements)

These elements **define** the Go Cosmic style. Reuse them as-is to stay consistent.

### 3.1 Eyebrow / `tag`

Section label: luminous `aerospace` dot + uppercase spaced mono text.

```tsx
<p className="text-aerospace mb-4 flex items-center gap-2 font-mono text-sm font-medium tracking-widest uppercase">
  <span className="bg-aerospace h-2 w-2 rounded-full" aria-hidden="true" />[ Services · 04 ]
</p>
```

Common text format: `[ NAME · NN ]` or `SECTOR — STUDIO`.

### 3.2 Signal dot (availability / status)

`jungle` dot with pulsing `animate-ping` halo = "online / available". Strong semantic meaning, reused from `StatusBar`.

```tsx
<span className="relative flex h-2 w-2" aria-hidden="true">
  <span className="bg-jungle absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
  <span className="bg-jungle relative inline-flex h-2 w-2 rounded-full" />
</span>
```

> Cut `animate-ping` under reduced-motion. Meaning is carried by **visible text**, not the dot (which is `aria-hidden`).

### 3.3 HUD labels / coordinates

Ambient mono metadata: coordinates (`48.7°N · 6.2°E`), versions (`v2.026.05`), counters (`[ 01 / 04 ]`), statuses (`SIGNAL · STABLE`). Color `text-ghost/35`, discreet, placed in corners or at the bottom of blocks. Use sparingly for "mission-control" texture.

### 3.4 Starfield background + glow

Immersive sections (hero, CTA): `<Starfield>` at layer `-z-20` + a radial accent gradient at `-z-10`, content at `z-10`. Density/speed are configurable; the CTA shifts to "warp" on hover. Outside these zones, keep a flat `bg-void`.

### 3.5 Buttons

**Pill** shape (`rounded-full`), `font-display` 500, optional arrow icon (`→`).

- **Primary**: `bg-aerospace text-void` + glow (`box-shadow` orange), `hover:scale-[1.08]`.
- **Ghost**: `border-ghost/15 text-ghost`, `hover:border-ghost hover:bg-ghost/5`.
- Always via `buttonVariants()` (`design-system/button.variants`) + `cn()`. Available accent variants: `aerospace` / `royal` / `jungle`.

### 3.6 Gradient accent heading

CTA heading: animated gradient `from-{accent} via-ghost to-{accent}` with `bg-clip-text text-transparent` (class `cta-final-headline`, 8s shift — disabled under reduced-motion).

### 3.7 Glyphs — no emoji

To mark a location, category, or action: **geometric SVGs** (crosshair, diamond `◇`, stars `✶ ✦`, arrows) in `currentColor`, tinted by token. Emoji 📍/🚀/✨ are **forbidden**.

### 3.8 Cards

Background `void` slightly lifted (`bg-ghost/[0.02]` or `void-2`), border `ghost/8`, `rounded-2xl`, hover that lightens the background and/or shifts an accent arrow. Card number in mono `ghost/35`, title `font-display`, tags as bordered mono chips.

---

## 4. Architecture conventions (required for every new component)

Drawn from `CLAUDE.md` and `GUIDELINES.md`.

**Folder structure** — `components/<Name>/`:

```
<Name>.tsx          ← rendering (presentation). 'use client' if interactive.
<Name>.hook.ts      ← single hook; <Name>.hooks.ts if the file exports multiple hooks
constants.ts        ← typed constants (durations, lists…) if needed
index.ts            ← re-export surface
README.md           ← (optional) props, design, a11y, reduced-motion notes
```

- **Strict rendering / logic separation**: no complex `useState`/`useEffect` in the `.tsx` → that lives in `.hooks.ts`. A purely static component has no hook file (see `ZoneIntervention`).
- **i18n**: all text goes through `next-intl` (`useTranslations`), keys in `messages/{en,fr,es,de,it}/<namespace>.json`. **All 5 locales** are updated together.
- **Styling**: Tailwind v4 + `@theme` tokens. Compose classes with `cn()` (`design-system/lib/utils`). No raw CSS except global keyframes in `globals.css`.
- **Accessibility**: semantic HTML (`section[aria-labelledby]`, lists for collections), complete `aria-*` on interactives (`aria-expanded`, `aria-controls`, `role="dialog"` + `aria-modal`…), touch targets **≥ 44×44px**, visible focus (`focus-visible:ring`), decorative elements as `aria-hidden`.
- **Animation**: `motion/react` for rich animations (`AnimatePresence`, variants, stagger); CSS for simple ones. Always handle reduced-motion.
- **Tests**: `__tests__/components/<Name>.test.tsx`, **coverage ≥ 90%**. Verify rendering, i18n content, a11y, states, reduced-motion.
- **Quality before commit**: `yarn format && yarn lint && yarn check-types && yarn test && yarn coverage` — zero errors, zero warnings. For PR/release preparation only: bump `package.json` (semver) and add a `CHANGELOG.md` entry; local commits do not require a version bump. Follow conventional commits for all PRs: `feat(ui): …`.

**Recurring props to plan for**: `className?`, `id?`, `respectReducedMotion?` (default `true`), and pre-localized content props (pass translated strings, not keys).

---

## 5. Recipe: creating a new page section

1. **Background**: `bg-void` (flat) or starfield+glow if it's an immersive moment (hero/CTA).
2. **Eyebrow** `tag` (§3.1) to announce the section.
3. **Heading** `h2` Space Grotesk, responsive clamp, tight tracking, optional italic emphasis.
4. **Sub-heading** `text-ghost/55`, `max-w-2xl`.
5. **Content** inside `max-w-7xl`, grid with `gap` (never inline flow for element alignment).
6. **Accent**: one strong point only (CTA pill, number, `aerospace` glyph).
7. **Motion**: scroll reveal + 50ms stagger, `--ease-out`, reduced-motion handled.
8. **HUD metadata** mono optionally for texture.

---

## 6. Quick reference (cheat-sheet)

```
Background ........ bg-void
Text .............. text-ghost / secondary text-ghost/55 / meta text-ghost/35
Accent ............ text-aerospace · bg-aerospace (rare, 1 per zone)
Availability ...... jungle + pulsing signal dot
Border ............ border-ghost/8 (subtle) · /15 (strong)
Heading ........... font-display, font-medium/bold, tracking-[-.03em], clamp()
Eyebrow / meta .... font-mono, uppercase, tracking-widest, + aerospace dot
Body .............. font-body (Inter), ≥14px
Button ............ rounded-full, buttonVariants(), pill primary/ghost
Card .............. bg-ghost/[0.02], border-ghost/8, rounded-2xl, hover lift
Radii ............. pill rounded-full · card rounded-xl/2xl
Easing ............ cubic-bezier(.16,1,.3,1)
Stagger ........... 50ms / item
Container ......... max-w-7xl, px-4 sm:px-6 lg:px-8
Glyph ............. geometric SVG currentColor — NO emoji
```

---

## 7. Do / Don't

**✅ Do**

- Reuse the tokens and patterns above; copy the nearest existing component.
- Keep the background dark, accent rare, mono for technical labels.
- Handle `prefers-reduced-motion` and accessibility from the start.
- Update all 5 locales and tests in the same batch.
- Prefer flex/grid + `gap` for all element alignment.

**❌ Don't (anti-slop)**

- **Emoji** (📍🚀✨…) → geometric SVGs.
- Raw Tailwind colors outside the palette: `blue-*`, `gray-*`, `slate-*` for brand text.
- Stacking **decorative gradients**, neons everywhere, multiple accents in one zone.
- Generic "left-colored-border + rounded corners" cards, heavy shadows.
- **Filler content**: fake stats, empty sections, gratuitous icons. Ask before adding content.
- State logic in the `.tsx` (it belongs in `.hooks.ts`).
- Fonts outside the system (Roboto, Arial…) or invented new colors.

---

_Any evolution of this guideline must reflect code that has actually shipped. When this file and `app/globals.css` disagree, `globals.css` is the source of truth for tokens — and this file must be corrected._
