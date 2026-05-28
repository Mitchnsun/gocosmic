# AGENTS.md

Codex instructions for working in this repository.

## Canonical Instructions

- Read and follow `CLAUDE.md` first. Treat it as the shared source of truth for AI-agent behavior in this project.
- This file adds Codex-specific operating notes and project shortcuts. If anything here conflicts with `CLAUDE.md`, prefer `CLAUDE.md`.
- Also consult `GUIDELINES.md` for UI, coding, commit, and manual validation rules, and `__tests__/TESTING.md` for test patterns.

## Project Snapshot

- Single Next.js 16 App Router application using React 19, TypeScript, Tailwind CSS 4, and `next-intl`.
- Package manager is Yarn 4 via Corepack. Use `yarn`, not `npm`, for project scripts.
- Node.js must be `>=22`.
- Routes live under `app/[locale]/`; supported locales are `en`, `fr`, `es`, `de`, and `it`.
- Translation namespaces live in `messages/<locale>/` and are loaded on demand by `i18n/request.ts`.
- Reusable primitives live in `design-system/`; app-specific components live in `components/`; complex view code lives in `views/`.

## Codex Workflow

- Start by reading the relevant files before editing. Prefer `rg` and `rg --files` for discovery.
- Keep edits scoped and small. Do not perform unrelated refactors while solving a local request.
- Preserve user changes in the worktree. Never revert files you did not intentionally change unless the user explicitly asks.
- Use `apply_patch` for manual edits.
- Do not stop long-running commands early. `yarn install`, `yarn build`, and `yarn coverage` can take several minutes.
- For substantial work, keep an explicit checklist and update it as work progresses.
- If the user corrects an AI mistake, update `docs/lessons.md` with the reusable lesson before finishing.

## Development Rules To Remember

- Use server components by default in `app/[locale]/` pages unless client behavior is required.
- When adding or changing a route:
  - add/update the page under `app/[locale]/`;
  - update localized pathnames in `i18n/routing.ts`;
  - keep canonical metadata locale-agnostic;
  - add all required translation keys for all five locales;
  - add or update tests under `__tests__/`.
- When touching translated UI, check all locale files in the affected namespace, not only English or French.
- When testing components that use translations, import `render` from `__tests__/test-utils.tsx`, not directly from React Testing Library.
- Avoid component snapshots. Page and view snapshots are tolerated, but update them only when the rendered output intentionally changes.
- Keep accessibility visible in implementation and tests: semantic headings, roles, ARIA labels, focus states, and keyboard behavior where relevant.
- Use existing design-system patterns: CVA variants, `@radix-ui/react-slot` for polymorphic composition, and `clsx` + `tailwind-merge` for class merging.
- Write all documentation in **English**: README files, code comments, JSDoc, inline documentation, and any Markdown files. This applies to AI-generated content as well.

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
yarn format && yarn lint && yarn check-types && yarn test && yarn coverage
```

For documentation-only edits, at minimum ensure Markdown formatting is clean. If a commit is requested, still follow the full pre-commit verification rule from `CLAUDE.md`.

## Release And PR Notes

- Conventional commits are enforced. Use the format documented in `CLAUDE.md` and `GUIDELINES.md`.
- Before opening a PR, bump `package.json` version and add a `CHANGELOG.md` entry under the new version heading.
- If changes are made for an existing PR, including review feedback, update the `CHANGELOG.md` entry and package version as part of the same PR-bound work before completion.
- Do not bump versions or edit the changelog for ordinary local work unless the user asks to prepare a PR or release.
