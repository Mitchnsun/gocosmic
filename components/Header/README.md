# Header

Main navigation bar, sticky at the top of every page. It has a fixed 64 px height, shows three links plus a primary call-to-action from 1024 px, switches to a burger menu below that (tablets included), and disables its animations when `prefers-reduced-motion` is enabled.

## File structure

```
Header/
├── Header.tsx              # React component (rendering only)
├── DesktopNav.tsx          # Inline links, CTA pill and language switcher (≥ 1024 px)
├── HeaderCta.tsx           # "Talk about my project" pill, shared by DesktopNav and MobileMenu
├── MobileMenu.tsx          # Full-screen mobile drawer (rendering only)
├── MobileMenuButton.tsx    # Burger → ✕ toggle button (rendering only)
├── MobileLangDrawer.tsx    # Full-screen language selection drawer for mobile
├── useMobileMenu.ts        # Hook: open/close state, scroll lock, Escape, route change
├── constants.ts            # Shared types, interfaces, and numeric values
├── index.ts                # Public re-export
└── README.md
```

The `Component.tsx` / `Component.hook.ts` (or `use*.ts`) split is intentional: components only handle rendering, hooks own all logic. If you need to change a behaviour (scroll, breakpoints, animations, menu state), go to the hook. If you are touching markup or CSS classes, go to the component.

---

## What the component renders

### Logo

The logo is an `<h1>` link pointing to `/`: the studio name (`BRAND_NAME` from `lib/config.ts`, overridable with the `logo` prop) in Space Grotesk 700 with `-0.02em` tracking, followed by an `aerospace` dot. Its accessible name contains the visible text (`navigation.home`, e.g. "Cosmic Studio, home"), as WCAG 2.5.3 requires.

### Skip-to-content link (keyboard accessibility)

Just before the `<header>`, a `href="#main-content"` link is rendered invisibly (`sr-only`). It becomes visible only on keyboard focus and lets users jump directly to the page content without tabbing through the entire navigation. It targets `<main id="main-content">` defined in `app/[locale]/layout.tsx`. This is a WCAG 2.4.1 requirement — do not remove it.

### Desktop navigation (`hidden lg:flex`)

On viewports ≥ 1024 px, `DesktopNav` shows Services · Projects · Contact, the `HeaderCta` pill (`bg-aerospace text-void`, 44 px high, leads to `/contact`) and the `LanguageSwitcher`. About and Pricing live in the footer. Below `lg`, the nav is hidden and the mobile menu takes over: three links plus a CTA do not fit comfortably on a 768 px tablet.

### Active navigation link

Each link is compared against the current `pathname` (via next-intl's `usePathname`). A link is active if the pathname matches exactly or starts with its `href` (to cover sub-pages). The active link receives `aria-current="page"` and an animated `bg-aerospace` underline bar. The active state can also be forced manually via the `isActive` field on a `HeaderNavItem`.

### Internationalisation

Labels, `ariaLabel` values, and the skip link text come from the `navigation` namespace loaded via `next-intl`. To update a label, edit `messages/<locale>/navigation.json`.

---

## Mobile menu

### Overview

Below `lg` (1024 px), the desktop nav is hidden and two buttons appear in a flex row at the right of the header: a **language globe button** (`LanguageSwitcher` with `onOpen` prop) and a **burger button** (`MobileMenuButton`). They are mutually exclusive — opening one closes the other.

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
- Items: a Home link (`navigation.home_menu`) followed by the header links.
- Top spacer: `STATUS_BAR_HEIGHT + safe-area-inset-top + HEADER_HEIGHT`, so the links start below the sticky header.
- Metadata row: `menu_title` i18n key on the left, the studio coordinates (`STUDIO_BASE.coordinates`) on the right.
- Navigation links stagger in: each `motion.li` with `opacity 0→1 + y 16→0`, delay `index × MOBILE_MENU_STAGGER_MS / 1000` s.
- Footer: the full-width `HeaderCta` (closes the menu on click), then `contact@gocosmic.dev` in monospace (no `LanguageSwitcher` — language switching is handled by `MobileLangDrawer`).
- `AnimatePresence` is managed in `Header.tsx` so exit animations work correctly.

### `MobileLangDrawer`

- Props: `onClose`
- `role="dialog"`, `aria-modal="true"`, `id="lang-drawer"`.
- Same slide animation as `MobileMenu` (y: "-100%" → 0).
- Top spacer accounts for `STATUS_BAR_HEIGHT + safe-area-inset-top + HEADER_HEIGHT`.
- Lists all 5 supported locales; clicking one switches the locale via `next-intl`'s router and closes the drawer.
- Scroll lock and Escape key handler mirror `useMobileMenu` behaviour.
- `AnimatePresence` is managed in `Header.tsx`, mutually exclusive with `MobileMenu`.

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

## Height

The header height is set by an inline `style` rather than Tailwind classes, so it can include the iOS notch:

- `height`: `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top, 0px))`
- `paddingTop`: `env(safe-area-inset-top, 0px)` — pushes content below the notch.
- `--header-h`: same computed value, exposed as a CSS custom property consumed by `LanguageSwitcher`'s desktop dropdown to anchor its `top` position.

The height no longer changes on scroll: the mockup of the rebrand ([#101](https://github.com/Mitchnsun/gocosmic/issues/101)) uses a fixed 64 px bar.

---

## Constants

All numeric values are centralised in `constants.ts`:

```ts
// constants.ts
export const STATUS_BAR_HEIGHT = 32; // height of the StatusBar above the header
export const HEADER_HEIGHT = 64;
export const DEFAULT_LOGO = BRAND_NAME; // "Cosmic Studio"
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
| [`__tests__/components/Header.test.tsx`](../../__tests__/components/Header.test.tsx)                                   | Rendering, links, CTA pill, active link, skip link, fixed height, `lg` breakpoint, menus |
| [`__tests__/components/Header/MobileMenuButton.test.tsx`](../../__tests__/components/Header/MobileMenuButton.test.tsx) | Aria labels, aria-expanded, aria-controls, onClick, span count                           |
| [`__tests__/components/Header/MobileMenu.test.tsx`](../../__tests__/components/Header/MobileMenu.test.tsx)             | Dialog role, aria-modal, nav links, CTA, coordinates, onClose on click, footer           |
| [`__tests__/components/Header/MobileLangDrawer.test.tsx`](../../__tests__/components/Header/MobileLangDrawer.test.tsx) | Dialog role, aria-modal, language list, locale selection, Escape key, close button       |
| [`__tests__/components/Header/useMobileMenu.test.tsx`](../../__tests__/components/Header/useMobileMenu.test.tsx)       | open/close/toggle, scroll lock, Escape key, route change                                 |
