# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

- Node.js ≥ 24 required (`corepack enable` to activate yarn on first use)
- **Never cancel long-running commands** — `yarn install` (~3.5 min), `yarn build` (~34s), `yarn coverage` (~15 min) all take time; wait them out

## Commands

```bash
yarn dev              # Start dev server on :3000 (Next.js + Turbopack)
yarn build            # Production build (~34s)
yarn lint             # ESLint with zero-warnings policy, type-aware (~16s)
yarn format           # Prettier write on all .ts/.tsx/.md
yarn check-types      # TypeScript type check via tsconfig.check.json (~9s)
yarn test             # Run all Vitest tests (~9s, ~1010 tests / 116 files)
yarn test:watch       # Vitest in watch mode
yarn coverage         # Generate coverage report (must stay ≥90% on all metrics)
yarn qa               # Local Playwright QA: axe audit of every route and the pricing page's states, both themes (CI runs it without the review screenshots)
yarn qa --ui          # Same, in Playwright's interactive UI (step-by-step timeline, DOM snapshots)
```

**Before committing**, always run: `yarn format && yarn lint && yarn check-types && yarn coverage`

To run a single test file: `yarn test __tests__/components/MyComponent.test.tsx`

## Troubleshooting

- Build failures → run `yarn check-types` first to isolate TypeScript errors
- `yarn dev` hanging → stop and restart the process
- Coverage below 90% → the CI will fail; add tests before opening a PR

## Companion docs

These hold binding rules — consult them alongside this file:

- `GUIDELINES.md` — UI, ESLint (zero-warnings), security, and the manual validation checklist.
- `DESIGN_GUIDELINE.md` — **Read before implementing any UI component or page section.** Defines the visual tokens (colors, typography, spacing), signature patterns (eyebrow, signal dot, starfield, buttons, cards), component architecture, and anti-patterns. Summary: dark `void` background, rare `aerospace` orange accent, mono labels for HUD texture, pill buttons via `buttonVariants()`, `prefers-reduced-motion` mandatory.
- `__tests__/TESTING.md` — test patterns and conventions.
- `docs/lessons.md` — persistent lessons log (commit after each correction).
- `AGENTS.md` — Codex-specific notes (defers to this file).

## Architecture

This is a single Next.js 16 app (App Router) with full internationalization via `next-intl`. Node.js ≥ 24 required; package manager is `yarn` (Corepack).

### Key directories

- `app/[locale]/` — All routes are under the dynamic `[locale]` segment. Pages export metadata and use server components by default.
  A `page.dev.tsx` (e.g. `design-system/`) is an internal route served by `yarn dev` only: `pageExtensions` in `next.config.ts` drops it from production builds.
- `components/` — App-specific components, one folder per component (`Header`, `Footer`, `LanguageSwitcher`, `JsonLd`, `Planet`, `PricingColumns`, `PricingSimulator`, `CaseStudy`, `ContactForm`, `ProjectGrid`, `Breadcrumb`, `ContentPage` (template of the service and guide pages), icons, and more).
- `design-system/` — Reusable UI primitives: `button.variants.ts` using CVA, plus `eyebrow.tsx`, `chip.tsx`, `field.tsx`, `choice-group.tsx`, `hairline-grid.tsx`, `pill.ts`, `slider.tsx`, `tabs.tsx`, `info-popover.tsx`, `accent.ts`. Sliders, tabs and info bubbles wrap the matching Radix primitives. `design-system/lib/utils.ts` exports `cn` (clsx + tailwind-merge) — **always use `cn` for conditional Tailwind classes**, never string interpolation. Prefer the object form (`cn({ 'class': condition })`) over `condition && 'class'`.
- `lib/` — Standalone helpers shared across the app (`config.ts`, `seo.ts`, `renderWithLinks.tsx`, plus `contact/`, `pricing/`, `validation/`, `hooks/`, `llms/` subfolders). Distinct from `design-system/lib/`.
- `app/llms.txt/`, `app/llms-full.txt/` — files for AI agents, built by `lib/llms/`: **every change to a page's content must be reflected there**, see [Files for AI agents](#files-for-ai-agents).
- `data/` — Static content sources (`projects.ts` exports `PROJECTS`, the ordered case-study registry backing the projects pages). **Project dates**: for a project that keeps being updated (`latestRelease`), the `/projects` card shows the year of its latest update, and the case study page shows both "since <creation year>" and "updated <latest update>"; a project without `latestRelease` shows its creation year on both. `story.ts` exports `STORY_MILESTONES`, the ordered steps of the story page (their dates, the one in progress, an optional link), read by the page and the files for AI agents. `content-pages.ts` holds what the pages published in French only quote from the rest of the site (the options of the showcase website page, the case studies backing each page, the example compositions, the sources of the redesign page and the day they were read) and the links other pages make to them, read by the pages and the files for AI agents.
- `messages/<locale>/` — Translation files split by namespace: `common`, `navigation`, `footer`, `home`, `about`, `story`, `services`, `pricing`, `pricing-page`, `projects`, `contact`, `free-mockup`, `local`, `legal`, `psc-supersprint`; `messages/fr/` also holds the files of the pages published in French only (`content-pages`…), listed in `PARTIAL_NAMESPACES`.
- `i18n/routing.ts` — Defines supported locales and all translated pathnames. `i18n/locales.ts` lists them: the five languages (`en`, `fr`, `es`, `de`, `it`) plus a Swiss variant of each (`fr-CH`…, served under `/fr-ch`…), which shares its language's messages and slugs and always shows the Swiss region, while language-only locales always show the default one (see `getRegion` in `lib/region.ts`). The visitor's country only picks the version they land on, in `proxy.ts`.
- `i18n/request.ts` — Server-side i18n setup (namespace loading per route).
- `__tests__/` — Mirrors source structure (`components/`, `pages/`). `test-utils.tsx` provides a custom `render` that wraps with `NextIntlClientProvider`.

### TypeScript configs

- `tsconfig.json` — Build config, excludes tests (`noEmit: true`).
- `tsconfig.check.json` — Stricter CI config, includes tests for type-checking.

### Internationalization

- All routes live under `app/[locale]/`.
- `i18n/routing.ts` maps canonical paths to localized slugs (e.g., `/about` → `/fr/a-propos`).
- When adding a new route:
  1. Create `app/[locale]/your-route/page.tsx`
  2. Add translated pathnames in `i18n/routing.ts`, wrapped in `localized()` so the Swiss locales get them too
  3. Declare the route's languages. A page published in some languages only (the service pages and guides of epic #142 start in French) takes a single slug and goes into `ROUTE_LANGUAGES` (`i18n/routing.ts`); `fr` covers `fr-CH` too. The page calls `assertRouteLocale(locale, routeKey)` (`lib/seo.ts`) before `setRequestLocale`, so it answers 404 in the other languages, and it stays out of their sitemap entries, hreflang links and language switchers. Show a link to it only where `hasRoute(locale, routeKey)` (`i18n/route-locales.ts`) holds
  4. Export `generateMetadata` with `alternates.canonical` set via `getCanonicalUrl` (`i18n/canonical.ts`) to the locale-agnostic path
  5. Call `setRequestLocale(locale)` at the top of the page, so it is rendered at build time (`yarn build` must list it as `●`, not `ƒ`). If a client component on it calls `useTranslations`, wrap it in a `NextIntlClientProvider` fed by `getClientMessages([...])` (`i18n/client-messages.ts`) with the keys it reads
  6. Add translation keys to all 5 locale namespace files under `messages/`. A new file also goes into `NAMESPACES` (`i18n/request.ts`), and its top-level keys must not exist in another file. A page of step 3 keeps its messages in its languages only, in a file listed in `PARTIAL_NAMESPACES` instead
  7. List the page in `lib/llms/llms-index.ts` and its content in `lib/llms/llms-full.ts`
- `proxy.ts` handles locale detection and redirects at the middleware level.

### Files for AI agents

`/llms.txt` and `/llms-full.txt` describe the site to AI assistants, in English. `lib/llms/` builds them at deployment from `messages/en`, `PROJECTS`, the price table and the routing. Their only sentence that is not site copy is `AGENT_USAGE`, worded by the owner: never change it without asking.

**Every change to a page's content must reach them in the same commit.** Check which case applies:

- **Picked up on its own** — an edited message; a new item in a list the builders read in full (an audience, a reason, a FAQ question, a zone, a free mockup step, a bullet point, a terms section); a new step of the story page added to both `STORY_MILESTONES` and the `story.steps` messages; a new project in `PROJECTS` whose case-study messages keep the `title` / `subtitle` / `for_whom` / `what_we_did` / `result` structure; a new price in the simulator constants.
- **Needs an edit in `lib/llms/`** — a new page (`llms-index.ts` and `llms-full.ts`); a section or message key added to or removed from a page; an entry added to a list the builders hard-code (`PROCESS_STEPS`, `COLUMNS`, `TRADES` in `lib/llms/full/`); a new simulator option (`OPTION_GROUPS` in `lib/pricing/price-list.ts`, which a test enforces); copy the simulator shows only with one plan or in one region.

After an edit in `lib/llms/`, update `__tests__/lib/llms/`. In both cases, read the result: `yarn build && yarn start`, then open `/llms.txt` and `/llms-full.txt`.

### Themes

- Two themes, dark (default) and light, set by `next-themes` as `data-theme` on `<html>` (`components/Theme`). Colour only with the semantic tokens of `DESIGN_GUIDELINE.md` §2.1 (`bg`, `fg`, `fg-2`, `line`, `ok`, `aerospace-ink`…); ESLint rejects the theme-dependent nominal classes (`bg-void`, `text-ghost`…).
- Theme-specific visuals use the `light:` variant first (no flash), then `useResolvedTheme()` to unmount what is hidden. A section that must stay dark sets `data-theme="dark"`.
- **Inclusive writing for trades/professions**: when copy lists or names a profession in a gendered language, write both forms. FR uses the median dot (`coiffeur·se`, `consultant·e`); ES/IT use a slash (`fontanero/a`, `parrucchiere/a`); DE uses a colon (`Berater:in`). Generic plural nouns that already read as neutral (e.g. "artisans", "indépendants", "artigiani") don't need doubling — only actual profession names do. When in doubt about which professions to list or how to phrase a specific sentence, ask for confirmation rather than guessing.

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
- Global mocks for `@/i18n/navigation` (router, `Link`, `usePathname`) and `motion/react` are configured in `test-setup.tsx`.
- Test behavior and accessibility attributes, not implementation details.

## Commit conventions

Conventional Commits are enforced via `commitlint` and Husky pre-commit hooks.

Format: `<type>(<scope>): <description>` — imperative, lowercase, no period (subject length ≤ 69 chars recommended).

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `tech`, `chore`
Common scopes: `ui`, `web`, `config`, `deps`

## PR checklist

**One version bump per PR, not per commit.** The first change on a branch bumps `version` in `package.json` (semver: patch/minor/major) and adds the matching `CHANGELOG.md` entry under `## [X.Y.Z] - YYYY-MM-DD`. Every later commit on that same branch — review follow-ups included — adds its bullets to that existing changelog entry and leaves the version untouched.

Before opening a PR:

1. Compare the branch's `package.json` version against `master`'s. If the branch is still at `master`'s version, this PR hasn't bumped yet — bump it now and create the changelog entry.
2. If the branch is already ahead of `master`, this PR already bumped — do not bump again; add new bullets to the existing entry instead (update its date to today).
3. For every PR-bound change, including review follow-ups after the PR exists, keep that single version bump and changelog entry updated before marking the work complete

### Changelog style

Write for a **non-technical reader** — a client, a stakeholder, or someone outside the project should understand every entry without any coding background.

Rules:

- Describe **what the user sees or experiences**, never what was implemented internally.
- **No file paths, component names, hook names, CSS class names, or technical jargon** of any kind.
- **No unit-test counts**, coverage numbers, or internal tooling changes unless they directly affect the user experience.
- Aim for **1–3 bullets per section** (`Added`, `Changed`, `Fixed`), each a single sentence.
- If a change is purely internal (refactor, test, tooling), omit it or fold it into a higher-level sentence.

Good: `Animated word cycling in the homepage hero with reduced-motion support`
Avoid: `Added AnimatedEndWord sub-component in components/Hero/ with useWordCycler hook`

Good: `New immersive closing section on the homepage with a star-field that accelerates on hover`
Avoid: `New CTAFinal component with useWarpEffect hook, cta-final-headline animation, and prefers-reduced-motion handling`

## Documentation language

All documentation must be written in **English**: README files, code comments, JSDoc, inline documentation, and any Markdown files added to the repository. This applies to AI-generated content as well.

## AI agent workflow

### Helper files

- `tasks/todo.md` — ephemeral planning scratch-pad (`.gitignore`d, never committed)
- `docs/lessons.md` — persistent lessons log; update it after each correction and commit it with the rest of the work

### Planning

- Enter plan mode for any non-trivial task (3+ steps or architectural decisions)
- Write detailed specs upfront; if something goes sideways, stop and re-plan instead of pushing through
- Write the plan to `tasks/todo.md` with checkable items, verify alignment before implementing

### Execution

- Track progress by marking `tasks/todo.md` items complete as you go
- After each significant step, provide a high-level summary of what changed
- One task per subagent for focused execution; offload research and parallel analysis to subagents

### Self-improvement loop

- After any correction from the user: update `docs/lessons.md` with the pattern and commit it with the rest of the work
- Review `docs/lessons.md` at the start of each session for relevant context

### Verification before done

- Never mark a task complete without proving it works — run tests, check logs, demonstrate correctness
- Ask: "Would a staff engineer approve this?"

### Core principles

- **Simplicity first** — make every change as small as possible; touch only what's necessary
- **No laziness** — find root causes, no temporary fixes
- **Autonomous bug fixing** — when given a bug report, fix it without asking for hand-holding; point at logs, errors, and failing tests, then resolve them
