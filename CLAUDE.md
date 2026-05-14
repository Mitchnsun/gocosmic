# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

- Node.js ≥ 22 required (`corepack enable` to activate yarn on first use)
- **Never cancel long-running commands** — `yarn install` (~3.5 min), `yarn build` (~34s), `yarn coverage` (~15 min) all take time; wait them out

## Commands

```bash
yarn dev              # Start dev server on :3000 (Next.js + Turbopack)
yarn build            # Production build (~34s)
yarn lint             # ESLint with zero-warnings policy (~7s)
yarn format           # Prettier write on all .ts/.tsx/.md
yarn check-types      # TypeScript type check via tsconfig.check.json (~9s)
yarn test             # Run all Vitest tests (~4s, ~98 tests)
yarn test:watch       # Vitest in watch mode
yarn coverage         # Generate coverage report (must stay ≥80% on all metrics)
```

**Before committing**, always run: `yarn format && yarn lint && yarn check-types && yarn test && yarn coverage`

To run a single test file: `yarn test __tests__/components/MyComponent.test.tsx`

## Troubleshooting

- Build failures → run `yarn check-types` first to isolate TypeScript errors
- `yarn dev` hanging → stop and restart the process
- Coverage below 80% → the CI will fail; add tests before opening a PR

## Architecture

This is a single Next.js 16 app (App Router) with full internationalization via `next-intl`. Node.js ≥ 22 required; package manager is `yarn` (Corepack).

### Key directories

- `app/[locale]/` — All routes are under the dynamic `[locale]` segment. Pages export metadata and use server components by default.
- `components/` — App-specific components (e.g., `LanguageSwitcher`, icons).
- `design-system/` — Reusable UI primitives: `button.tsx` + `button.variants.ts` using CVA. Components use `@radix-ui/react-slot` for polymorphism.
- `views/` — View-layer components for complex pages (e.g., Journey 3D canvas).
- `messages/<locale>/` — Translation files split by namespace: `common`, `navigation`, `footer`, `home`, `about`, `services`, `offers`, `journey`, `projects`.
- `i18n/routing.ts` — Defines supported locales (`en`, `fr`, `es`, `de`, `it`) and all translated pathnames.
- `i18n/request.ts` — Server-side i18n setup (namespace loading per route).
- `__tests__/` — Mirrors source structure (`components/`, `pages/`, `views/`). `test-utils.tsx` provides a custom `render` that wraps with `NextIntlClientProvider`.

### TypeScript configs

- `tsconfig.json` — Build config, excludes tests (`noEmit: true`).
- `tsconfig.check.json` — Stricter CI config, includes tests for type-checking.

### Internationalization

- All routes live under `app/[locale]/`.
- `i18n/routing.ts` maps canonical paths to localized slugs (e.g., `/about` → `/fr/a-propos`).
- When adding a new route:
  1. Create `app/[locale]/your-route/page.tsx`
  2. Add translated pathnames in `i18n/routing.ts`
  3. Export `metadata` with `alternates.canonical` set to the locale-agnostic path
  4. Add translation keys to all 5 locale namespace files under `messages/`
- `proxy.ts` handles locale detection and redirects at the middleware level.

### Testing patterns

- Use `render` from `__tests__/test-utils.tsx` (not from `@testing-library/react` directly) for any component that uses translations — it includes the `NextIntlClientProvider`.
- Global mocks for `next/navigation` are configured in `test-setup.tsx`.
- Avoid snapshot tests for components; snapshots are tolerated only for pages/views.
- Test behavior and accessibility attributes, not implementation details.

## Commit conventions

Conventional Commits are enforced via `commitlint` and Husky pre-commit hooks.

Format: `<type>(<scope>): <description>` — imperative, lowercase, no period, max 69 chars.

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `tech`, `chore`
Common scopes: `ui`, `web`, `config`, `deps`

## PR checklist

Before opening a PR:

1. Bump `version` in `package.json` (semver: patch/minor/major)
2. Add a `CHANGELOG.md` entry under `## [X.Y.Z] - YYYY-MM-DD`

## AI agent workflow

### Helper files

- `tasks/todo.md` — ephemeral planning scratch-pad (`.gitignore`d, never committed)
- `docs/lessons.md` — persistent lessons log that **must be committed** after each correction

### Planning

- Enter plan mode for any non-trivial task (3+ steps or architectural decisions)
- Write detailed specs upfront; if something goes sideways, stop and re-plan instead of pushing through
- Write the plan to `tasks/todo.md` with checkable items, verify alignment before implementing

### Execution

- Track progress by marking `tasks/todo.md` items complete as you go
- After each significant step, provide a high-level summary of what changed
- One task per subagent for focused execution; offload research and parallel analysis to subagents

### Self-improvement loop

- After any correction from the user: update `docs/lessons.md` with the pattern and commit it
- Review `docs/lessons.md` at the start of each session for relevant context

### Verification before done

- Never mark a task complete without proving it works — run tests, check logs, demonstrate correctness
- Ask: "Would a staff engineer approve this?"

### Core principles

- **Simplicity first** — make every change as small as possible; touch only what's necessary
- **No laziness** — find root causes, no temporary fixes
- **Autonomous bug fixing** — when given a bug report, fix it without asking for hand-holding; point at logs, errors, and failing tests, then resolve them
