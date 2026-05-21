# Header

Main navigation bar, sticky at the top of every page. It shrinks when the user starts scrolling, adapts to mobile/tablet/desktop breakpoints, and disables its animations when `prefers-reduced-motion` is enabled.

## File structure

```
Header/
├── Header.tsx        # React component (rendering only)
├── Header.hook.ts    # useHeader — all state and effect logic
├── constants.ts      # Shared types, interfaces, and numeric values
├── index.ts          # Public re-export
└── README.md
```

The `Header.tsx` / `Header.hook.ts` split is intentional: the component only handles rendering, the hook owns all the logic. If you need to change a behaviour (scroll, breakpoints, animations), go to the hook. If you are touching markup or CSS classes, go to the component.

---

## What the component renders

### Logo with orbital dot

The logo is an `<h1>` link pointing to `/`. A small `bg-aerospace` dot orbits around it via `animate-orbital-dot`. The animation is removed when `reduceMotion` is `true` or when `logoOrbitalEnabled={false}`.

### Skip-to-content link (keyboard accessibility)

Just before the `<header>`, a `href="#main-content"` link is rendered invisibly (`sr-only`). It becomes visible only on keyboard focus and lets users jump directly to the page content without tabbing through the entire navigation. It targets `<main id="main-content">` defined in `app/[locale]/layout.tsx`. This is a WCAG 2.4.1 requirement — do not remove it.

### Active navigation link

Each link is compared against the current `pathname` (via next-intl's `usePathname`). A link is active if the pathname matches exactly or starts with its `href` (to cover sub-pages). The active link receives `aria-current="page"` and an animated `bg-aerospace` underline bar. The active state can also be forced manually via the `isActive` field on a `HeaderNavItem`.

### Responsive display

Below `md` (768 px), text labels are hidden (`hidden md:inline`) and replaced by Heroicons icons. Above that breakpoint, icons are hidden (`md:hidden`). `ariaLabel` attributes are always present for screen readers regardless of viewport.

### Internationalisation

Labels, `ariaLabel` values, and the skip link text come from the `navigation` namespace loaded via `next-intl`. To update a label, edit `messages/<locale>/navigation.json`.

---

## What the `useHeader` hook does

```ts
const { headerHeight, reduceMotion } = useHeader(props);
```

### Height driven by inline style

The header height is not managed by Tailwind classes but by a `style={{ height: \`${headerHeight}px\` }}`. This allows smooth transitions between precise numeric values. The Tailwind class `transition-[height]` handles the CSS animation.

### Effect 1 — `prefers-reduced-motion` detection

On mount, the hook listens to the `(prefers-reduced-motion: reduce)` media query. If it matches, `reduceMotion` becomes `true`. The component then replaces `duration-300` with `duration-0` on all transitions and removes `animate-orbital-dot` from the logo. The listener is reactive: if the user changes their system setting mid-session, the header adapts immediately.

This behaviour can be disabled by passing `respectReducedMotion={false}`, for example in tests or Storybook stories.

### Effect 2 — Adaptive height on scroll and resize

The effect listens to `scroll` (passive, non-blocking) and `resize`. On each event it computes the target height along two axes:

**Breakpoint (resize):**

| Viewport width      | Expanded height  | Compact height    |
| ------------------- | ---------------- | ----------------- |
| ≤ 600 px (mobile)   | 64 px            | 64 px (no change) |
| ≤ 1023 px (tablet)  | 85 px            | 56 px             |
| > 1023 px (desktop) | `maxHeight` prop | `minHeight` prop  |

On mobile, height never changes on scroll — it stays fixed at 64 px to preserve screen space.

**Scroll direction:**

- User scrolls **down** more than 8 px → **compact** height
- User scrolls **up** (regardless of position) → **expanded** height

The `isCompactRef` ref persists the compact state across resize events so the height is recalculated correctly after a window resize without a new scroll.

If `adaptiveHeight={false}` is passed, the effect is never registered and the header keeps its initial height (`maxHeight`).

---

## Changing breakpoints or heights

All numeric values are centralised in `constants.ts`. To change a threshold, edit the constant directly — it is used both by the hook and exported for tests.

```ts
// constants.ts
export const SCROLL_COMPACT_THRESHOLD = 8; // px before switching to compact
export const MOBILE_MAX_WIDTH = 600;
export const TABLET_MAX_WIDTH = 1023;
export const MOBILE_HEIGHT = 64;
export const TABLET_EXPANDED_HEIGHT = 85;
export const TABLET_COMPACT_HEIGHT = 56;
```

---

## Adding a navigation link

1. Add `label` and `ariaLabel` keys to all 5 `messages/<locale>/navigation.json` files
2. Extend the `href` union type in `constants.ts` to include the new route
3. Add the entry to the default items array in `Header.tsx` (or pass it via `navItems`)

---

## Tests

[`__tests__/components/Header.test.tsx`](../../__tests__/components/Header.test.tsx) — covers rendering, active link state, the skip link, and the main props.
