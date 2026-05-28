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

## CSS / TailwindCSS 4

### `--font-display` and `--font-body` must be declared in `@theme`

Despite a PR review suggesting that hardcoding `--font-display` and `--font-body` inside `@theme` risks overriding the next/font-generated CSS variables (due to cascade order), **removing them from `@theme` breaks the styles**: Tailwind 4 reads font variables from `@theme` at build time and does not fall back to runtime CSS variables set by `next/font` on `<html>`.

**Root cause:** Tailwind 4's `@theme` is processed statically. If `--font-display` / `--font-body` are absent from `@theme`, the generated utility classes that reference them (e.g. `font-display`) simply don't resolve — even when `next/font` injects the same variable names at runtime via class on `<html>`.

**Correct pattern:** Keep the literal `font-family` strings in `@theme` so Tailwind can generate its utilities. Optionally add fallbacks at the consumption site (`font-family: var(--font-body, system-ui, sans-serif)`), but do **not** remove the `@theme` declarations.

## Internationalization (next-intl)

### Client components and useTranslations — per-page NextIntlClientProvider pattern

**Mistake**: Using `useTranslations` directly in a `'use client'` component assumes the namespace was already loaded by the global `NextIntlClientProvider` in the layout. Because `i18n/request.ts` uses per-route lazy-loading, navigating to a page client-side (layout preserved, no re-render) leaves the provider with the initial page's namespaces only — causing `MISSING_MESSAGE` errors.

**Root cause**: `i18n/request.ts` loads only the namespaces needed for the current route. On client-side navigation, Next.js re-renders page RSCs but preserves the layout, so `NextIntlClientProvider` retains the messages from the initial request.

**Correct pattern**: Any page that contains a `'use client'` component calling `useTranslations` must wrap that component with its own `NextIntlClientProvider` seeded with `getMessages()` and `getLocale()`:

```tsx
// app/[locale]/your-page/page.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { YourClientComponent } from '@/components/YourClientComponent';

export default async function YourPage() {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <YourClientComponent />
    </NextIntlClientProvider>
  );
}
```

The client component itself just calls `useTranslations('namespace')` normally — no props needed.

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

**Do NOT**:

- Pass translations as props to client components (verbose, fragile, misses the root cause)
- Disable the per-route lazy-loading in `i18n/request.ts` (defeats the performance optimisation)
- Rely on the global layout `NextIntlClientProvider` for page-specific namespaces

**Test pattern**: In tests for async page components, mock `getLocale` and `getMessages` in the `next-intl/server` mock and `await` the page component:

```ts
vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  const { default: messages } = await import('../../messages/en/your-namespace.json');
  return {
    ...actual,
    getLocale: vi.fn().mockResolvedValue('en'),
    getMessages: vi.fn().mockResolvedValue(messages),
  };
});

it('renders correctly', async () => {
  render(await YourPage());
  // ...
});
```

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

## Documentation

### Keep policy docs aligned with actual repository entry points and package metadata

**Mistake**: Writing documentation rules too generically caused `DOCS_POLICY.md` to conflict with the repository's real entry-point files (`README.md`, `README.en.md`, `README.fr.md`, `DOCS_POLICY.md`) and allowed duplicated version/script details in README files to drift from `package.json`.

**Root cause**: Repository-level policy documents need explicit exceptions for established root files, and any duplicated technical metadata becomes stale unless it is checked against the source of truth.

**Correct pattern**: When documenting naming or language rules, explicitly carve out root-level documentation entry points if they intentionally break the general convention. When listing scripts or dependency versions in README files, verify them against `package.json` (or reference the canonical source directly) before merging.
