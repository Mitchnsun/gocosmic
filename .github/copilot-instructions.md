# Go Cosmic — GitHub Copilot Instructions

> **Primary references**: [`CLAUDE.md`](../CLAUDE.md) is the authoritative guide for commands, architecture, and workflows. [`GUIDELINES.md`](../GUIDELINES.md) covers UI principles, coding standards, commit examples, manual validation, and coverage details. Read both before making changes.

## Critical Requirements

**NEVER CANCEL BUILDS OR LONG-RUNNING COMMANDS.** If a command appears to hang, wait at least 15 minutes before considering alternatives.

- Node.js ≥ 22 required (`.nvmrc` specifies v22; v20 works with warnings)
- Package manager: `yarn` via Corepack (`corepack enable` on first use)

## Technology Stack

- **Next.js 16** — App Router + Turbopack
- **React 19** — Server components and concurrent features
- **TypeScript 5.9** — Strict mode; dual tsconfig (build vs. type-check)
- **next-intl** — Type-safe i18n, 5 locales (EN, FR, ES, DE, IT)
- **TailwindCSS 4** — Utility classes + custom design tokens
- **Radix UI + CVA** — Accessible primitives with typed component variants
- **Vitest + Testing Library** — Unit tests, ≥90% coverage enforced

## Key Commands

See [`CLAUDE.md § Commands`](../CLAUDE.md) for the full list with runtimes.

```bash
yarn dev          # Dev server on :3000
yarn build        # Production build
yarn lint         # ESLint — zero warnings policy
yarn format       # Prettier
yarn check-types  # TypeScript via tsconfig.check.json
yarn test         # Vitest run
yarn coverage     # Coverage report + threshold validation
```

**Before committing**: `yarn format && yarn lint && yarn check-types && yarn test && yarn coverage`

## Architecture

See [`CLAUDE.md § Architecture`](../CLAUDE.md) for the full directory map.

Key points for Copilot:

- All routes live under `app/[locale]/` — every page is internationalised by default
- `i18n/routing.ts` maps canonical paths to localised slugs; update it when adding routes
- `design-system/` uses CVA for typed variants; `components/` holds app-specific pieces
- Custom test `render` is in `__tests__/test-utils.tsx` — use it for any component that calls `useTranslations`

## Adding a New Route

1. Create `app/[locale]/your-route/page.tsx`
2. Add translated pathnames in `i18n/routing.ts`
3. Export `metadata` with `alternates.canonical: '/your-route'` (locale-agnostic path)
4. Add translation keys to all 5 locale files under `messages/`
5. Update navigation components if the route needs a nav link

## Commit Conventions

Enforced by commitlint + Husky. Full examples in [`GUIDELINES.md § Commit Message Reference`](../GUIDELINES.md).

Format: `<type>(<scope>): <description>` — imperative, lowercase, no period, max 69 chars.

Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `tech` `chore`
Scopes: `ui` `web` `config` `deps`

## Before Opening a PR

1. Bump `version` in `package.json` (semver)
2. Add entry to `CHANGELOG.md` under `## [X.Y.Z] - YYYY-MM-DD`
3. For every PR-bound change, including follow-up commits after review, keep the changelog and package version updated before finishing
4. All CI checks must pass: lint, types, tests, coverage ≥ 90%

## UI & Coding Standards

See [`GUIDELINES.md`](../GUIDELINES.md) for:

- Cosmic theme principles and WCAG requirements
- ESLint plugin roles and component patterns
- Manual validation checklist (browser smoke tests for all routes and locales)
- Coverage thresholds and exclusion list

## Documentation Language

All documentation must be written in **English**: README files, code comments, JSDoc, inline documentation, and any Markdown files added to the repository. This applies to AI-generated content as well.

## AI Agent Workflow

See [`CLAUDE.md § AI agent workflow`](../CLAUDE.md) for the full planning, execution, and self-improvement loop.

Core rules:

- Plan before implementing any non-trivial task; use `tasks/todo.md` as scratch-pad (gitignored)
- After corrections, update and commit `docs/lessons.md`
- Never mark work done without running verification commands
- Autonomous bug fixing: find root cause, fix it, prove it works — no hand-holding
