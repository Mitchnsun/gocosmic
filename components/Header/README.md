# Header

Main navigation bar, sticky at the top of every page. It shrinks when the user starts scrolling, adapts to mobile/tablet/desktop breakpoints, and disables its animations when `prefers-reduced-motion` is enabled.

## File structure

```
Header/
├── Header.tsx              # React component (rendering only)
├── Header.hook.ts          # useHeader — adaptive height and reduced-motion logic
├── MobileMenu.tsx          # Full-screen mobile drawer (rendering only)
├── MobileMenuButton.tsx    # Burger → ✕ toggle button (rendering only)
├── MobileLangDrawer.tsx    # Full-screen language selection drawer for mobile
├── MountainSkyline.tsx     # Decorative SVG mountain skyline rendered inside MobileMenu
├── LogoOrbitalDot.tsx      # Animated orbital dot rendered next to the logo
├── useMobileMenu.ts        # Hook: open/close state, scroll lock, Escape, route change
├── constants.ts            # Shared types, interfaces, and numeric values
├── index.ts                # Public re-export
└── README.md
```

The `Component.tsx` / `Component.hook.ts` (or `use*.ts`) split is intentional: components only handle rendering, hooks own all logic. If you need to change a behaviour (scroll, breakpoints, animations, menu state), go to the hook. If you are touching markup or CSS classes, go to the component.

---

## What the component renders

### Logo with orbital dot

The logo is an `<h1>` link pointing to `/`. A small `bg-royal` dot orbits around it, implemented in `LogoOrbitalDot.tsx` using `motion/react`. An outer `motion.span` continuously rotates 360° (`animate={{ rotate: 360 }}`), while the inner `motion.span` pulses in scale and opacity. When `reduceMotion` is `true`, `LogoOrbitalDot` returns `null` (no element is mounted at all). The dot is also omitted when `logoOrbitalEnabled={false}`.

### Skip-to-content link (keyboard accessibility)

Just before the `<header>`, a `href="#main-content"` link is rendered invisibly (`sr-only`). It becomes visible only on keyboard focus and lets users jump directly to the page content without tabbing through the entire navigation. It targets `<main id="main-content">` defined in `app/[locale]/layout.tsx`. This is a WCAG 2.4.1 requirement — do not remove it.

### Desktop navigation (`hidden md:flex`)

On viewports ≥ 768 px, the nav bar shows text labels and a `LanguageSwitcher`. Below `md`, it is hidden with `hidden md:flex` — the mobile menu takes over.

### Active navigation link

Each link is compared against the current `pathname` (via next-intl's `usePathname`). A link is active if the pathname matches exactly or starts with its `href` (to cover sub-pages). The active link receives `aria-current="page"` and an animated `bg-aerospace` underline bar. The active state can also be forced manually via the `isActive` field on a `HeaderNavItem`.

### Internationalisation

Labels, `ariaLabel` values, and the skip link text come from the `navigation` namespace loaded via `next-intl`. To update a label, edit `messages/<locale>/navigation.json`.

---

## Mobile menu

### Overview

Below `md` (768 px), the desktop nav is hidden and two buttons appear in a flex row at the right of the header: a **language globe button** (`LanguageSwitcher` with `onOpen` prop) and a **burger button** (`MobileMenuButton`). They are mutually exclusive — opening one closes the other.

- The language button opens `MobileLangDrawer`, a full-screen drawer for locale selection.
- The burger button opens `MobileMenu`, a full-screen animated drawer that slides in from the top.

### `MobileMenuButton`

- Props: `isOpen`, `onToggle`, `buttonRef`, `className`
- Two `motion.span` bars animate to form a ✕ when `isOpen` is `true` (`translateY + rotate`).
- Aria: `aria-label` switches between `menu_open` / `menu_close`, `aria-expanded`, `aria-controls="mobile-menu"`.
- Hit target: 44 × 44 px minimum.
- Respects `prefers-reduced-motion` via `useReducedMotion()` — duration drops to 0 when true.

### `MobileMenu`

- Props: `onClose`, `items`
- `role="dialog"`, `aria-modal="true"`, `id="mobile-menu"`.
- Slide animation: `y: "-100%" → 0`, ease `[0.16, 1, 0.3, 1]`, duration `MOBILE_MENU_DURATION_MS / 1000` s.
- Top spacer: 112 px area with a `MountainSkyline` SVG decoration anchored to its bottom edge.
- Metadata row: `menu_title` i18n key on the left, `ALT. 2351m` on the right.
- Navigation links stagger in: each `motion.li` with `opacity 0→1 + y 16→0`, delay `index × MOBILE_MENU_STAGGER_MS / 1000` s.
- Footer: `contact@gocosmic.dev` email in monospace (no `LanguageSwitcher` — language switching is handled by `MobileLangDrawer`).
- `AnimatePresence` is managed in `Header.tsx` so exit animations work correctly.

### `MobileLangDrawer`

- Props: `onClose`, `headerHeight` (defaults to `MOBILE_HEIGHT`)
- `role="dialog"`, `aria-modal="true"`, `id="lang-drawer"`.
- Same slide animation as `MobileMenu` (y: "-100%" → 0).
- Top spacer accounts for `STATUS_BAR_HEIGHT + safe-area-inset-top + headerHeight`.
- Lists all 5 supported locales; clicking one switches the locale via `next-intl`'s router and closes the drawer.
- Scroll lock and Escape key handler mirror `useMobileMenu` behaviour.
- `AnimatePresence` is managed in `Header.tsx`, mutually exclusive with `MobileMenu`.

### `MountainSkyline`

- Decorative, `aria-hidden="true" role="presentation"`.
- SVG polyline rendered at `viewBox="0 0 400 48"`, `preserveAspectRatio="none"` so it stretches full-width.
- Accepts a `className` prop for positioning.

### `useMobileMenu` hook

```ts
const { isOpen, open, close, toggle, buttonRef } = useMobileMenu();
```

| Behaviour    | Implementation                                                               |
| ------------ | ---------------------------------------------------------------------------- |
| Scroll lock  | `document.body.style.overflow = 'hidden'` while open, reset on close/unmount |
| Escape key   | `keydown` listener on `window`; also returns focus to `buttonRef`            |
| Route change | `useEffect` on `usePathname()` calls `close()`                               |

### Constants

```ts
// constants.ts
export const MOBILE_MENU_DURATION_MS = 420; // drawer slide duration
export const MOBILE_MENU_BURGER_DURATION_MS = 300; // burger → ✕ transition
export const MOBILE_MENU_STAGGER_MS = 50; // per-link stagger delay
```

---

## What the `useHeader` hook does

```ts
const { headerHeight, reduceMotion } = useHeader(props);
```

### Height driven by inline style

The header height is not managed by Tailwind classes but by an inline `style` object that sets three values simultaneously:

- `height`: `calc(${headerHeight}px + env(safe-area-inset-top, 0px))` — extends into the iOS status bar notch area.
- `paddingTop`: `env(safe-area-inset-top, 0px)` — pushes content below the notch.
- `--header-h`: same computed value, exposed as a CSS custom property consumed by `LanguageSwitcher`'s desktop dropdown to anchor its `top` position.

The Tailwind class `transition-[height]` handles the CSS animation for smooth transitions between precise numeric values.

### Effect 1 — `prefers-reduced-motion` detection

On mount, the hook listens to the `(prefers-reduced-motion: reduce)` media query. If it matches, `reduceMotion` becomes `true`. Transition durations and the orbital dot visibility are controlled at the CSS layer via Tailwind's `motion-reduce:duration-0` and `motion-reduce:hidden` variants, so these guards take effect before JavaScript hydration runs — no first-frame flash. Once the effect fires and `reduceMotion` is `true`, `LogoOrbitalDot` returns `null` to fully unmount the animated element and stop its animation loop. The listener is reactive: if the user changes their system setting mid-session, the header adapts immediately.

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
export const SCROLL_COMPACT_THRESHOLD = 10; // px before switching to compact
export const MOBILE_MAX_WIDTH = 600;
export const TABLET_MAX_WIDTH = 1023;
export const STATUS_BAR_HEIGHT = 32; // iOS status bar height used by MobileLangDrawer spacer
export const MOBILE_HEIGHT = 64;
export const TABLET_EXPANDED_HEIGHT = 85;
export const TABLET_COMPACT_HEIGHT = 56;
export const MOBILE_MENU_DURATION_MS = 420; // drawer slide duration (ms)
export const MOBILE_MENU_BURGER_DURATION_MS = 300; // burger → ✕ transition (ms)
export const MOBILE_MENU_STAGGER_MS = 50; // per-link stagger delay (ms)
```

---

## Adding a navigation link

1. Add `label` and `ariaLabel` keys to all 5 `messages/<locale>/navigation.json` files
2. Extend the `href` union type in `constants.ts` to include the new route
3. Add the entry to the default items array in `Header.tsx` (or pass it via `navItems`)

---

## Tests

| File                                                                                                                   | Coverage                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [`__tests__/components/Header.test.tsx`](../../__tests__/components/Header.test.tsx)                                   | Rendering, active link, skip link, MobileMenuButton presence, desktop nav `hidden` class |
| [`__tests__/components/Header/MobileMenuButton.test.tsx`](../../__tests__/components/Header/MobileMenuButton.test.tsx) | Aria labels, aria-expanded, aria-controls, onClick, span count                           |
| [`__tests__/components/Header/MobileMenu.test.tsx`](../../__tests__/components/Header/MobileMenu.test.tsx)             | Dialog role, aria-modal, nav links, onClose on click, footer                             |
| [`__tests__/components/Header/MobileLangDrawer.test.tsx`](../../__tests__/components/Header/MobileLangDrawer.test.tsx) | Dialog role, aria-modal, language list, locale selection, Escape key, close button       |
| [`__tests__/components/Header/MountainSkyline.test.tsx`](../../__tests__/components/Header/MountainSkyline.test.tsx)   | SVG rendering, aria-hidden                                                               |
| [`__tests__/components/Header/useMobileMenu.test.tsx`](../../__tests__/components/Header/useMobileMenu.test.tsx)       | open/close/toggle, scroll lock, Escape key, route change                                 |
| [`__tests__/components/Header/LogoOrbitalDot.test.tsx`](../../__tests__/components/Header/LogoOrbitalDot.test.tsx)     | Orbital dot visibility                                                                   |
