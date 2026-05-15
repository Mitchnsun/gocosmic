# AI Agent Lessons

This file records lessons learned from past mistakes and corrections made during AI-assisted development on this repository. It is **intentionally committed** so that lessons persist across sessions and agents.

## How to Use

- After any correction from the user, append a new entry under the relevant section below.
- Each entry should describe the mistake, the root cause, and the corrective pattern to follow.
- Review this file at the start of each session to avoid repeating known mistakes.

---

<!-- Add new lessons below, grouped by topic -->

## CSS / TailwindCSS 4

### `--font-display` and `--font-body` must be declared in `@theme`

Despite a PR review suggesting that hardcoding `--font-display` and `--font-body` inside `@theme` risks overriding the next/font-generated CSS variables (due to cascade order), **removing them from `@theme` breaks the styles**: Tailwind 4 reads font variables from `@theme` at build time and does not fall back to runtime CSS variables set by `next/font` on `<html>`.

**Root cause:** Tailwind 4's `@theme` is processed statically. If `--font-display` / `--font-body` are absent from `@theme`, the generated utility classes that reference them (e.g. `font-display`) simply don't resolve — even when `next/font` injects the same variable names at runtime via class on `<html>`.

**Correct pattern:** Keep the literal `font-family` strings in `@theme` so Tailwind can generate its utilities. Optionally add fallbacks at the consumption site (`font-family: var(--font-body, system-ui, sans-serif)`), but do **not** remove the `@theme` declarations.
