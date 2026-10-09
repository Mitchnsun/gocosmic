# AGENTS.md

Codex instructions for working in this repository.

## Canonical Instructions

- Read and follow `CLAUDE.md` first. Treat it as the shared source of truth for AI-agent behavior in this project.
- This file adds Codex-specific operating notes and project shortcuts. If anything here conflicts with `CLAUDE.md`, prefer `CLAUDE.md`.
- Also consult `GUIDELINES.md` for UI, coding, security, commit, and manual validation rules, `__tests__/TESTING.md` for test patterns, and `docs/lessons.md` for persistent agent lessons.
- **Before implementing any UI component or page section**, read `DESIGN_GUIDELINE.md`. It defines all visual tokens, signature patterns, component architecture, and anti-patterns for the Cosmic Studio design system.
- Consult `SECURITY.md` before adding or changing API routes, Server Actions, environment variables, third-party scripts, CSP/security headers, or dependency policy.

## Project Snapshot

- Single Next.js 16 App Router application using React 19, TypeScript, Tailwind CSS 4, and `next-intl`.
- Package manager is Yarn 4 via Corepack. Use `yarn`, not `npm`, for project scripts.
- Node.js must be `>=24`.
- Routes live under `app/[locale]/`; supported locales are the five languages `en`, `fr`, `es`, `de`, and `it`, plus a Swiss variant of each (`fr-CH`…, served under `/fr-ch`…) listed in `i18n/locales.ts`. A Swiss locale shares its language's messages and slugs and always shows the Swiss region, while language-only locales always show the default one (see `getRegion` in `lib/region.server.ts`). The visitor's country only picks the version they land on, in `proxy.ts`.
- Translation namespaces live in `messages/<language>/` and are loaded on demand by `i18n/request.ts`.
- Reusable primitives live in `design-system/`; app-specific components live in `components/`.

## Codex Workflow

- Start by reading the relevant files before editing. Prefer `rg` and `rg --files` for discovery.
- Keep edits scoped and small. Do not perform unrelated refactors while solving a local request.
- Preserve user changes in the worktree. Never revert files you did not intentionally change unless the user explicitly asks.
- Use `apply_patch` for manual edits.
- Do not stop long-running commands early. `yarn install`, `yarn build`, and `yarn coverage` can take several minutes.
- Review `docs/lessons.md` at the start of each session for relevant prior mistakes and corrective patterns.
- For substantial work, keep an explicit checklist and update it as work progresses. Use Codex task tracking during the session, and use `tasks/todo.md` for non-trivial plans or architectural decisions; `tasks/todo.md` is gitignored and must not be committed.
- If the user corrects an AI mistake, update `docs/lessons.md` with the reusable lesson before finishing.

## Development Rules To Remember

- Use server components by default in `app/[locale]/` pages unless client behavior is required.
- When adding or changing a route:
  - add/update the page under `app/[locale]/`;
  - update localized pathnames in `i18n/routing.ts`, wrapped in `localized()` so the Swiss locales get them too;
  - update namespace loading in `i18n/request.ts` when the route needs a new or changed translation namespace;
  - keep canonical metadata locale-agnostic;
  - add all required translation keys for all five languages;
  - add or update tests under `__tests__/`.
- When touching translated UI, check all locale files in the affected namespace, not only English or French.
- When testing components that use translations, import `render` from `__tests__/test-utils.tsx`, not directly from React Testing Library.
- Do not write snapshot tests for components, pages, or views unless the user explicitly requests it and the rendered output change is intentional.
- Keep accessibility visible in implementation and tests: semantic headings, roles, ARIA labels, focus states, and keyboard behavior where relevant.
- Use existing design-system patterns: CVA variants and `cn` from `@/design-system/lib/utils` for all conditional Tailwind class merging. Do not build conditional Tailwind classes with template literals or string concatenation.
- Keep component files focused. When a component grows past roughly 100 lines or starts exporting multiple visual units, split cohesive pieces into the established `Foo/Foo.tsx`, `Foo.types.ts`, `Foo.utils.ts`, `Foo.hooks.ts`, sub-component files, and `index.ts` layout.
- For client components that call `useTranslations`, make sure the owning page provides a page-level `NextIntlClientProvider` seeded with `getMessages()` and `getLocale()` when the namespace is route-loaded.
- Use Next.js client-side navigation for internal links: `next/link` or `@/i18n/navigation`. Raw `<a>` tags are only for external, `mailto:`, and `tel:` links.
- Write all documentation in **English**: README files, code comments, JSDoc, inline documentation, and any Markdown files. This applies to AI-generated content as well.
- `README.en.md` and `README.fr.md` are the same document in two languages. Any change to one must be applied to the other in the same commit: same sections, same heading order, same content. English is canonical if they disagree.

## Verification

Use the narrowest meaningful verification while developing, then broaden before handoff when risk justifies it.

Common commands:

```bash
yarn lint
yarn check-types
yarn test
yarn coverage
yarn build
```

Before committing or opening a PR, follow `CLAUDE.md` and run:

```bash
yarn format && yarn lint && yarn check-types && yarn coverage
```

For documentation-only edits, at minimum ensure Markdown formatting is clean. If a commit is requested, still follow the full pre-commit verification rule from `CLAUDE.md`.

For UI, routing, i18n, or animation changes, run the relevant manual validation from `GUIDELINES.md` in addition to automated checks. Prioritize affected routes, locale switching, and browser back/forward navigation.

## Release And PR Notes

- Conventional commits are enforced. Use the format documented in `CLAUDE.md` and `GUIDELINES.md`.
- Before opening a PR, bump `package.json` version and add a `CHANGELOG.md` entry under the new version heading.
- If changes are made for an existing PR, including review feedback, update the `CHANGELOG.md` entry and package version as part of the same PR-bound work before completion.
- Do not bump versions or edit the changelog for ordinary local work unless the user asks to prepare a PR or release.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
