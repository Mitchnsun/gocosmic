# AI Agent Lessons

This file records lessons learned from past mistakes and corrections made during AI-assisted development on this repository. It is **intentionally committed** so that lessons persist across sessions and agents.

## How to Use

- After any correction from the user, append a new entry under the relevant section below.
- Each entry should describe the mistake, the root cause, and the corrective pattern to follow.
- Review this file at the start of each session to avoid repeating known mistakes.

---

<!-- Add new lessons below, grouped by topic -->

## Release Process

### PR-bound changes must update the changelog

**Mistake**: A PR with implementation commits was submitted without the matching `CHANGELOG.md` entry.

**Root cause**: The release checklist was treated as only a pre-opening step, so follow-up work and review-fix commits did not re-check the changelog requirement.

**Correct pattern**: Any change that is intended to land through a PR, including review feedback after the PR already exists, must include a package version bump and a dated `CHANGELOG.md` entry before the work is marked complete.

### A small fix on the day of a release may not get its own version

**Mistake**: A one-file sitemap fix opened right after the 2.1.0 release (same day) was given its own 2.1.1 bump; the user asked not to bump.

**Correct pattern**: When the current version was released that same day and the change is a small fix, ask before bumping, or add the bullet to the existing entry and leave `version` untouched. If the user says not to bump, add the bullet to the latest entry in `CHANGELOG.md`.

**Recurrence (2026-10-09)**: The Next.js 16.4 upgrade, rebased onto a `master` that had just merged 2.4.0, was bumped to 2.4.1 on the grounds that a security upgrade is not a small fix. The owner had not created the 2.4.0 release yet and asked to reuse it. A version merged on `master` is not necessarily released: when `master`'s latest changelog entry is dated today, check whether it has been released (a `v2.4.0` tag or GitHub release) or ask. If it hasn't, fold the change into that entry and keep `master`'s version, whatever the size of the change.

## CSS / TailwindCSS 4

### `--font-display` and `--font-body` must be declared in `@theme`

Despite a PR review suggesting that hardcoding `--font-display` and `--font-body` inside `@theme` risks overriding the next/font-generated CSS variables (due to cascade order), **removing them from `@theme` breaks the styles**: Tailwind 4 reads font variables from `@theme` at build time and does not fall back to runtime CSS variables set by `next/font` on `<html>`.

**Root cause:** Tailwind 4's `@theme` is processed statically. If `--font-display` / `--font-body` are absent from `@theme`, the generated utility classes that reference them (e.g. `font-display`) simply don't resolve — even when `next/font` injects the same variable names at runtime via class on `<html>`.

**Correct pattern:** Keep the literal `font-family` strings in `@theme` so Tailwind can generate its utilities. Optionally add fallbacks at the consumption site (`font-family: var(--font-body, system-ui, sans-serif)`), but do **not** remove the `@theme` declarations.

## Internationalization (next-intl)

### Client components and useTranslations — each page declares the messages it sends to the browser

**Mistake**: A `'use client'` component calling `useTranslations` relied on the layout's `NextIntlClientProvider` for a page namespace. After a client-side navigation, Next.js keeps the layout, so the provider still held the first page's messages and the component raised `MISSING_MESSAGE` (reported on 2026-09-07 for the homepage's `ServicesGrid`, only after navigating from another route; a hard reload masked it).

**Root cause**: The layout's provider is not re-rendered on client-side navigation, so it can only hold messages shared by every page.

**Correct pattern**: Pages are rendered at build time, so the server loads every namespace (`i18n/request.ts`) and each provider declares what reaches the browser through `getClientMessages` (`i18n/client-messages.ts`). The layout sends `navigation`, `theme` and `cookieConsent` (header, footer, theme switch, cookie banner). A page whose client component calls `useTranslations` wraps it in its own provider, with the top-level keys that component reads:

```tsx
// app/[locale]/your-page/page.tsx
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { YourClientComponent } from '@/components/YourClientComponent';
import { getClientMessages } from '@/i18n/client-messages';

export default async function YourPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getClientMessages(['yourNamespace']);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <YourClientComponent />
    </NextIntlClientProvider>
  );
}
```

A nested provider replaces its parent's messages, it does not add to them. A key left out shows as its raw path in the page, and `yarn build` logs `MISSING_MESSAGE` while prerendering.

**Do NOT**:

- Pass `getMessages()` to a provider: it sends every namespace to the browser.
- Add a page namespace to the layout provider's list.
- Call `headers()` or `cookies()` while rendering a page, or skip `setRequestLocale`: the route turns dynamic again (`ƒ` instead of `●` in the `yarn build` output).
- Reuse a top-level key in two message files: the server merges them and the last one wins. `meta` once sat in four files; `__tests__/i18n/messages.test.ts` now rejects it.

## Animations / Reduced Motion

### Prefer Tailwind `motion-reduce:` variants over `useEffect` + JS state for reduced-motion guards

**Mistake**: Initialising a `reduceMotion` state to `false` and updating it via `useEffect` with `window.matchMedia('(prefers-reduced-motion: reduce)')` to drive CSS transition durations and component visibility. Because effects run after hydration, users with `prefers-reduced-motion: reduce` see a brief flash of animation before the JS state catches up.

**Root cause**: React effects are post-paint. Any animation that is visible in the initial render — including CSS transitions triggered by interaction and `motion/react` JS animations mounted on first render — can fire during the hydration window before the effect sets the state.

**Correct pattern**: Use Tailwind's `motion-reduce:` variant as a **CSS-first guard**. CSS media queries are applied by the browser before any JS executes, so there is no flash.

```tsx
// ✅ CSS-first — no flash, no JS needed for transitions
<header className="transition-[height] duration-300 motion-reduce:duration-0" />

// For JS-animated elements (e.g. motion/react), add motion-reduce:hidden on the wrapper
<motion.span className="... motion-reduce:hidden" animate={{ rotate: 360 }} />
```

**Two-layer pattern for `motion/react` components:**

1. **CSS layer** — add `motion-reduce:hidden` to the outermost element. This hides the component immediately, before JS hydration.
2. **JS layer** — keep `if (reduceMotion) return null` (driven by the `useEffect` listener) to fully unmount the element after hydration, stopping the animation loop and freeing memory.

The `useEffect`-based listener is still useful for **reacting to mid-session changes** to the OS preference, and for the JS unmount optimization — but it must never be the sole guard against the initial flash.

**Do NOT**:

- Use `const [reduceMotion, setReduceMotion] = useState(false)` as the only guard for CSS transition durations or initial animation visibility.
- Replace `duration-300` with `duration-0` purely via JS state — the state won't be set until after the first render.

## CSS / TailwindCSS 4 — Conditional Classes

### Always use `cn` for conditional Tailwind class application

**Mistake**: Applying Tailwind classes conditionally with template literals or ternary string concatenation (e.g. `` `base-class ${condition ? 'foo' : ''}` ``) instead of the `cn` utility.

**Root cause**: Inline string interpolation bypasses `tailwind-merge`, which means conflicting utilities (e.g. `bg-blue-500` vs `bg-red-500`) are not resolved correctly, and falsy values can leave trailing whitespace or empty strings in the class attribute. It also makes the intent harder to read.

**Correct pattern**: Always import `cn` from `@/design-system/lib/utils` and pass conditional classes as additional arguments:

```tsx
import { cn } from '@/design-system/lib/utils';

// ✅ correct
<div className={cn('base-class other-class', condition && 'conditional-class')} />

// ❌ wrong — bypasses tailwind-merge, fragile string building
<div className={`base-class other-class ${condition ? 'conditional-class' : ''}`} />
```

**This applies everywhere**: component files, view files, design-system primitives. There are no exceptions — even single conditional classes must go through `cn`.

---

### `CosmicCursor`'s injected `!important` stylesheet silently overrides every `cursor-*` utility

**Mistake**: The pricing page's checkbox and range input had `cursor-pointer` Tailwind classes but showed a text I-beam on hover instead of a hand — the classes looked correct, so the bug looked like it had to be elsewhere.

**Root cause**: `components/CosmicCursor/CosmicCursor.tsx` injects a global `<style data-cosmic-cursor>` tag with `* { cursor: none !important; } input, textarea, select, [contenteditable] { cursor: text !important; }` to hide the native cursor everywhere except text-like fields. Because the selector matched _every_ `<input>` regardless of `type`, it also caught checkboxes, radios and ranges — and `!important` beats any Tailwind `cursor-*` utility on the element itself.

**Correct pattern**: When a cursor (or any element-styling bug) doesn't respond to the classes you'd expect, check for a globally injected `<style>` tag first — `document.head.querySelector('style[data-cosmic-cursor]')` in devtools, or grep for `!important` in the repo. Fix the selector at the source (split clickable form controls from text-like ones in the injected CSS) rather than trying to out-specificity it from the component.

---

## Next.js Navigation

### Use `<Link>` for all internal navigation — plain `<a href>` triggers bfcache and breaks animations on back navigation

**Mistake**: Using a plain `<a href="/internal-path">` for internal navigation inside a client component (e.g. a card with a stretched-link pattern).

**Root cause**: A native `<a>` tag causes a full-page (hard) navigation. When the user presses the browser back button after a hard navigation, the browser restores the previous page from the **Back-Forward Cache (bfcache)**: the JavaScript is frozen in its pre-navigation state, React effects do not re-run, and all IntersectionObserver-based animations (planet, timeline, service cards, etc.) remain invisible because `setVisible(true)` is never called.

This does **not** affect links created with Next.js `<Link>` because those trigger client-side navigation; the back button returns through the Next.js router, effects re-run, and animations work normally.

**Correct pattern**: Every internal link — including those inside design-system or generic components — must use `<Link>` from `next/link` (or `@/i18n/navigation` when i18n-aware routing is needed):

```tsx
// ✅ client-side navigation — bfcache not involved, animations survive back navigation
import Link from 'next/link';
<Link href="/services#development">En savoir plus</Link>

// ❌ hard navigation — bfcache freezes the page on back, all animations break
<a href="/services#development">En savoir plus</a>
```

**Audit rule**: When reviewing a component that renders links, grep for `<a href` and verify every internal path (starting with `/`) is converted to `<Link>`. `mailto:`, `tel:`, and external `http` links are the only legitimate uses of a raw `<a>` tag.

**Companion fix — React StrictMode + IntersectionObserver**: In dev mode, StrictMode double-invokes effects (setup → cleanup → setup). If the IntersectionObserver fires and sets a `setTimeout` in the first setup, the cleanup cancels the timer before it fires. Guard against this with a `useRef` that tracks whether the element has already intersected within the current mount:

```tsx
const hasIntersected = useRef(false);

useEffect(() => {
  if (reducedMotion || hasIntersected.current) {
    setVisible(true);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          hasIntersected.current = true;
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(el);
  return () => observer.disconnect();
}, [delay, reducedMotion]);
```

The `useRef` persists across StrictMode's simulated unmount/remount but resets on a real unmount, so the animation re-plays correctly on full page reload.

---

## Custom cursor / Radix primitives

### `CosmicCursor`'s injected stylesheet must be updated when a native control is replaced by a Radix primitive

**Mistake**: Migrating `TierSlider` from a native `<input type="range">` to Radix `Slider` (a `div`/`span` with `role="slider"`) without noticing that `CosmicCursor.tsx` hides the OS cursor everywhere and re-enables it only on a hardcoded list of native selectors, including `input[type="range"]` for the grab/grabbing cursor. Once the range input disappears, that selector stops matching and the slider falls back to the custom canvas dot, which also doesn't get suppressed because `useCosmicCursor.ts`'s `usesNativeCursor` detection checks `tagName` (`input`/`textarea`/`select`) rather than ARIA role.

**Root cause**: `CosmicCursor` couples its cursor rules to native HTML tag/type selectors, so any component that swaps a native form control for a Radix (or other ARIA-role-based) primitive silently breaks both the visible cursor icon and the "don't draw the canvas dot on top of a native cursor" logic — nothing fails loudly, the mismatch only shows up visually.

**Correct pattern**: When replacing a native `input`/`select`/`textarea` with a Radix primitive that carries an ARIA role (`role="slider"`, `role="checkbox"`, `role="switch"`, …), update **both** halves of `CosmicCursor` together:

1. The injected `<style data-cosmic-cursor>` carve-out (`CosmicCursor.tsx`) — add the `[role="…"]` selector alongside the native one it replaces.
2. The `usesNativeCursor` detection in `useCosmicCursor.ts` — extend the tag check with `target.closest('[role="…"]') !== null` so the canvas dot stops drawing over the primitive's own cursor.

Grep `components/CosmicCursor/` for the native selector being replaced (`input[type=`, tag names) before shipping any migration off a native form control.

---

## Documentation

### Keep policy docs aligned with actual repository entry points and package metadata

**Mistake**: Writing documentation rules too generically caused `DOCS_POLICY.md` to conflict with the repository's real entry-point files (`README.md`, `README.en.md`, `README.fr.md`, `DOCS_POLICY.md`) and allowed duplicated version/script details in README files to drift from `package.json`.

**Root cause**: Repository-level policy documents need explicit exceptions for established root files, and any duplicated technical metadata becomes stale unless it is checked against the source of truth.

**Correct pattern**: When documenting naming or language rules, explicitly carve out root-level documentation entry points if they intentionally break the general convention. When listing scripts or dependency versions in README files, verify them against `package.json` (or reference the canonical source directly) before merging.

### Replacing a document with a pointer: check every rule, one by one

**Mistake**: `AGENTS.md` was cut down to a pointer to `CLAUDE.md` after checking only a few of its rules. Four of them existed nowhere else (API routes and CSP in the `SECURITY.md` reminder, preserving user changes, no version bump for local work) and were lost until a review caught it.

**Correct pattern**: Before deleting a duplicated document, grep each of its rules in the documents meant to replace it, and move the ones that are missing. Likewise, moving server-only strings into the `common` messages ships them to the browser on every page: keep data read only by server components out of the client messages.

---

## CSS / Animation

### A global `!important` transition override silently kills component transitions

**Mistake**: The theme switch thumb did not slide because `.theme-fade *` forces `transition-property` (colours only) with `!important` during a switch. A first fix listed `transform`, but Tailwind v4 moves elements with the `translate` property, so the thumb still jumped.

**Correct pattern**: When an element must animate during `theme-fade`, give it a hook class and override `transition-property` with higher specificity, listing the exact properties Tailwind v4 uses (`translate`, `scale`, `rotate`, `transform`). Check the emitted CSS, not the assumed property.

---

## Accessibility

### The axe audit only sees each page as it loads

**Mistake**: `yarn qa` passed on `/services`, yet a ticked option of the pricing simulator showed its orange price at 4.48:1 on the light theme's tinted row, below the 4.5:1 AA threshold. The audit loads each route and analyses it without any interaction, so ticked rows, nested rows and open bubbles were never checked.

**Correct pattern**: When a component changes colours or reveals content on interaction (ticked rows, tabs, popovers, nested options), run an axe check on those states too (a short Playwright script ticking the options and opening a bubble before `AxeBuilder.analyze()`), in both themes. Stacked translucent tints (a nested ticked row inside a ticked parent) lower contrast further: avoid tinting nested rows.

---

## Pull requests

### A follow-up PR of leftovers does not always get its own version bump

**Mistake**: A small PR carrying two leftovers of an already released change (a restored anchor decoding and a test wording fix) was bumped to a patch version with its own changelog entry, as the PR checklist asks for every PR. The owner did not want a version bump for it.

**Correct pattern**: For a follow-up PR that only tidies up a change already released, ask the owner before bumping the version and adding a changelog entry, instead of applying the one-bump-per-PR rule automatically.

### A new case study is a patch, not a minor version

**Mistake**: Adding the Coach'n Pulse case study page was bumped as a minor version (2.4.1 → 2.5.0). The owner wanted a patch (2.4.2).

**Correct pattern**: New content on the existing structure (another case study, more copy) gets a patch bump. Keep minor bumps for new features or sections of the site.

---

## Issues

### Keep the `[CS-xx]` prefix for tickets attached to an epic

**Mistake**: A standalone ticket (a new case study page) was titled `[CS-08] …` to continue the numbering of the latest case-study tickets.

**Correct pattern**: Only tickets that belong to an epic get a `[XX-nn]` prefix. A standalone ticket gets a plain descriptive title.

---

## Legal and business facts

### Ask what is changing before treating a legal page as the source of truth

**Mistake**: The legal notice (Duingt, SIRET, French law) and the structured data (Chêne-Bougeries) disagreed. The two options offered were to switch everything to one existing address or the other, and the studio was moved to Duingt. In fact the owner is registering a new Swiss sole proprietorship in Chêne-Bougeries, and the French registration was the one to remove.

**Correct pattern**: When legal pages and other declarations disagree, ask which one reflects the current situation, or whether it is changing (new registration, move), before offering to align on the existing text. Legal pages can be the outdated side.

---

## Testing

### Check the exit code of `yarn coverage`, not just its summary line

**Mistake**: Three new tests mocked `next-intl/server` with a template-string `import()` of message files. Vite turned it into a `\0vite` helper module, and the coverage HTML report crashed on that path after every test had passed. Grepping only for the "All files" line hid the failure locally, so CI was the first to catch it.

**Correct pattern**: In tests, import message files statically (see `__tests__/messages-by-locale.ts`), never through `import(`…${locale}…`)`. After `yarn coverage`, check its exit code (`echo $?`) as well as the thresholds.

---

## Performance

### A server-rendered banner fixed to the bottom can shift while the page is still parsing

**Mistake**: The cookie banner was moved from a client-only render to the server HTML so it would paint with the page. On a loaded CPU, Lighthouse caught a 0.13 layout shift: the browser painted the banner after parsing only its opening tags (42 px of padding), then the rest of its HTML arrived and the banner, anchored with `bottom-4`, grew upwards to 336 px.

**Correct pattern**: Render such an element `hidden` on the server and reveal it with an inline script placed right after it (it runs once the element is fully parsed), as `CookieConsentBoot` does. Check a layout change with Lighthouse under artificial CPU load (busy loops on every core) and `--save-assets`, then read the `LayoutShift` events' `old_rect` / `new_rect` in the trace: an idle machine rarely reproduces it.

### Do not retry a failed dynamic import with Turbopack

**Mistake**: A `.catch(() => import(...))` retry was added for the header's lazy animation features. Turbopack's chunk loader caches the failed chunk, so the second import rejects at once without any request (checked by aborting the chunk in Playwright).

**Correct pattern**: Verify a fallback by actually failing the request before shipping it. A retry needs another mechanism (a reload, or a fallback that does not depend on the chunk).

---

## Layout

### Aligning one page with the others: ask which side is the reference, value by value

**Mistake**: Asked to align the free mockup page with the other pages, its tight top margin (40–48 px) was replaced by the larger fluid one the other pages used. The owner wanted the opposite: the other pages had too much space under the header on desktop, and the free mockup value was the one to spread.

**Correct pattern**: When two layouts differ, do not assume the majority is right. List each differing value and confirm which side wins before editing. Page intros use `PAGE_TOP` from `design-system/pill.ts`, never `SECTION_Y`.
