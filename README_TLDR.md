# Cosmic Studio — TL;DR

A lightweight, quick-read version of the docs. For full detail, see
[README.en.md](./README.en.md) / [README.fr.md](./README.fr.md),
[CLAUDE.md](./CLAUDE.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).

## What is Cosmic Studio?

A single Next.js 16 app (App Router), fully internationalized (EN, FR, ES,
DE, IT), showcasing Cosmic Studio's portfolio, services and pricing to
craftspeople, associations and independents.

## Quick Start

```bash
corepack enable   # first time only
yarn              # install deps (~3.5 min)
yarn dev          # http://localhost:3000
```

## Tech Stack

- **Next.js 16** + **React 19** + **TypeScript 5.9**
- **TailwindCSS 4** for styling, **next-intl** for i18n (5 locales)
- **Vitest** + **React Testing Library** for testing

## Project Structure

```
app/[locale]/       # Internationalized pages (server components by default)
components/         # App-specific components
design-system/      # Reusable UI primitives (button, eyebrow, chip, field…)
data/projects.ts    # Case study registry
lib/                # Shared helpers
messages/<locale>/  # Translations, one JSON file per namespace
i18n/               # Routing, request config, canonical URLs
__tests__/          # Unit tests, mirrors the source structure
```

## Essential Commands

```bash
yarn dev              # Dev server
yarn build            # Production build (~34s)
yarn lint             # ESLint, zero warnings (~7s)
yarn format           # Prettier
yarn check-types      # TypeScript via tsconfig.check.json (~9s)
yarn test             # Vitest (~9s, ~690 tests / 87 files)
yarn coverage         # Coverage report, ≥90% required (~15 min)
```

**Before committing**, always run:
`yarn format && yarn lint && yarn check-types && yarn test && yarn coverage`

## Commit Messages

[Conventional Commits](https://www.conventionalcommits.org/):
`<type>(<scope>): <description>` — imperative, lowercase, no period, ≤69
chars, English only.

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `tech`, `chore`

```bash
feat(ui): add cosmic Button component
fix(web): resolve navigation issue on mobile
tech(deps): update Next.js to version 16
```

## Before Opening a PR

**One version bump per PR, not per commit.** The first change on a branch
bumps `version` in `package.json` (semver) and adds a `CHANGELOG.md` entry
under `## [X.Y.Z] - YYYY-MM-DD`; later commits on the same branch add
bullets to that same entry instead of bumping again. See
[CLAUDE.md § PR checklist](./CLAUDE.md#pr-checklist) for the full rule.

## Key Pages

- **Homepage** (`/`) — hero, audience, pricing, projects, own apps, CTA
- **About** (`/about`) — background, why craftspeople and associations
- **Services & pricing** (`/services`) — pricing columns, subscription simulator, trades, FAQ
- **Contact** (`/contact`) — details, message form, call booking
- **Free mockup** (`/free-mockup`) — lead-capture form
- **Local** (`/local`) — Geneva / Annecy landing page (localized slugs)
- **Projects** (`/projects/*`) — filterable index + case studies
- **Legal** — `/privacy`, `/legal-notice`, `/terms`

## Coding Standards

- TypeScript strict, no `any`
- ESLint zero-warnings policy, Prettier formatting
- Conventional Commits, Husky + lint-staged pre-commit hooks
- 90% test coverage threshold (lines, functions, branches, statements)

## Good to Know

- Node.js **≥ 24** required
- **Never cancel** long-running commands — install, build and coverage all take real time
- English is the base language for translations; all 5 locales are updated together

## More Docs

| File                                                            | What it covers                                 |
| --------------------------------------------------------------- | ---------------------------------------------- |
| [README.en.md](./README.en.md) / [README.fr.md](./README.fr.md) | Full project documentation                     |
| [CLAUDE.md](./CLAUDE.md)                                        | AI agent guide (setup, architecture, workflow) |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                            | Contribution workflow                          |
| [GUIDELINES.md](./GUIDELINES.md)                                | UI, ESLint, security, manual validation        |
| [DESIGN_GUIDELINE.md](./DESIGN_GUIDELINE.md)                    | Design system tokens and patterns              |
| [`__tests__/TESTING.md`](./__tests__/TESTING.md)                | Testing patterns and conventions               |
| [SECURITY.md](./SECURITY.md)                                    | Security policy                                |
| [CHANGELOG.md](./CHANGELOG.md)                                  | Version history                                |
