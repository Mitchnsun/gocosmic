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
yarn test             # Run all Vitest tests (~4s, ~138 tests / 33 files)
yarn test:watch       # Vitest in watch mode
yarn coverage         # Generate coverage report (must stay ≥90% on all metrics)
```

**Before committing**, always run: `yarn format && yarn lint && yarn check-types && yarn test && yarn coverage`

To run a single test file: `yarn test __tests__/components/MyComponent.test.tsx`

## Troubleshooting

- Build failures → run `yarn check-types` first to isolate TypeScript errors
- `yarn dev` hanging → stop and restart the process
- Coverage below 90% → the CI will fail; add tests before opening a PR

## Architecture

This is a single Next.js 16 app (App Router) with full internationalization via `next-intl`. Node.js ≥ 22 required; package manager is `yarn` (Corepack).

### Key directories

- `app/[locale]/` — All routes are under the dynamic `[locale]` segment. Pages export metadata and use server components by default.
- `components/` — App-specific components: `Header`, `Footer`, `LanguageSwitcher`, `Loader`, `JsonLd`, `Journey`, icons.
- `design-system/` — Reusable UI primitives: `button.tsx` + `button.variants.ts` using CVA. Components use `@radix-ui/react-slot` for polymorphism.
- `views/` — View-layer components for complex pages (e.g., Journey 3D canvas).
- `messages/<locale>/` — Translation files split by namespace: `common`, `navigation`, `footer`, `home`, `about`, `services`, `offers`, `journey`, `projects`, `contact`, `local`, `psc-supersprint`.
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

### Component architecture

- **Keep components light** — a component file should do one thing. If it exports more than one visual unit, split it.
- **Preferred file layout for a feature component `Foo`:**
  - `Foo/Foo.tsx` — the orchestrator (state, logic, composition). No inline sub-component definitions.
  - `Foo/Foo.types.ts` — shared TypeScript types and enums.
  - `Foo/Foo.utils.ts` — pure helper functions (color maps, item lists, formatters).
  - `Foo/Foo.hooks.ts` — custom React hooks if any.
  - `Foo/SubBar.tsx`, `Foo/SubBaz.tsx` — each named visual sub-component in its own file.
  - `Foo/index.ts` — re-export surface (`export { Foo } from './Foo'`).
- **When a file grows past ~100 lines**, treat it as a signal to extract: identify one cohesive unit and move it to its own file before adding more code.
- **Inline sub-component definitions** (functions returning JSX inside another component file) are only acceptable for anonymous wrappers of 5 lines or fewer that are not reused. Anything named and larger than trivial belongs in its own file.

### Testing patterns

- Write tests for components, utils, and design-system primitives — these are the primary targets for unit coverage.
- Do **not** write snapshot tests for pages or views; page-level snapshots add maintenance burden without meaningful coverage.
- Use `render` from `__tests__/test-utils.tsx` (not from `@testing-library/react` directly) for any component that uses translations — it includes the `NextIntlClientProvider`.
- Global mocks for `next/navigation` are configured in `test-setup.tsx`.
- Test behavior and accessibility attributes, not implementation details.

## Commit conventions

Conventional Commits are enforced via `commitlint` and Husky pre-commit hooks.

Format: `<type>(<scope>): <description>` — imperative, lowercase, no period (subject length ≤ 69 chars recommended).

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `tech`, `chore`
Common scopes: `ui`, `web`, `config`, `deps`

## PR checklist

Before opening a PR:

1. Bump `version` in `package.json` (semver: patch/minor/major)
2. Add a `CHANGELOG.md` entry under `## [X.Y.Z] - YYYY-MM-DD`

## Documentation language

All documentation must be written in **English**: README files, code comments, JSDoc, inline documentation, and any Markdown files added to the repository. This applies to AI-generated content as well.

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
