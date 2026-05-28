# GUIDELINES.md

Reference for contributors and AI agents. Covers UI principles, coding standards, commit conventions, manual validation, and coverage details.

## UI Design Guidelines

The project uses a distinctive **cosmic theme** throughout all interfaces:

- **Modern & Minimalist** — Clean layouts with generous whitespace, subtle shadows, smooth transitions
- **Cosmic Theme** — Space-inspired palette: deep blacks, cosmic blues, stellar accents
- **Accessibility First** — All components must meet WCAG standards; use Radix UI primitives for accessible primitives
- **Responsive Design** — Mobile-first with fluid layouts and adaptive components
- **Dark Mode Ready** — Components designed for both light and dark themes
- **Smooth Interactions** — Micro-interactions and animations that enhance the cosmic feel without hurting performance

All UI components should evoke exploration and wonder while staying professionally usable.

## Coding Standards

### TypeScript

- Strict type checking across all code via `tsconfig.check.json`
- No `any`; prefer explicit interfaces over type inference where clarity matters
- JSDoc on exported component props interfaces

### ESLint (flat config, zero warnings)

Active plugins and their roles:

| Plugin                             | Purpose                          |
| ---------------------------------- | -------------------------------- |
| `typescript-eslint`                | TypeScript-specific rules        |
| `eslint-plugin-security`           | Vulnerability detection          |
| `eslint-plugin-unicorn`            | Modern JS/TS best practices      |
| `eslint-plugin-import`             | Import/export validation         |
| `eslint-plugin-simple-import-sort` | Automatic import ordering        |
| `eslint-plugin-unused-imports`     | Remove unused imports            |
| `eslint-plugin-jsx-a11y`           | Accessibility enforcement in JSX |
| `eslint-plugin-prettier`           | Formatting via Prettier          |

### Component patterns

- Use CVA (`class-variance-authority`) for variant-based components (see `design-system/button.variants.ts`)
- Use `@radix-ui/react-slot` for polymorphic element composition
- Use `cn` from `@/design-system/lib/utils` for all conditional class merging — **never** use template literals or string concatenation for conditional Tailwind classes; `cn` wraps `clsx` + `tailwind-merge` and is the single authoritative helper

## Documentation Language

All documentation must be written in **English**: README files, code comments, JSDoc, inline documentation, and any Markdown files added to the repository. This applies to AI-generated content as well.

## Security

`eslint-plugin-security` catches common patterns at lint time. For anything beyond that, consult [`SECURITY.md`](./SECURITY.md) — it documents every decision and constraint for this project.

**Check SECURITY.md before:**

| Situation                               | What to check                                 |
| --------------------------------------- | --------------------------------------------- |
| Adding an API route (`app/**/route.ts`) | Input validation, auth, CORS, rate limiting   |
| Adding a Server Action (`"use server"`) | Input schema (zod), privilege scope           |
| Adding an env variable                  | Never prefix secrets with `NEXT_PUBLIC_`      |
| Adding a third-party script             | Update `script-src` in `next.config.ts` + CSP |

## Commit Message Reference

Format: `<type>(<scope>): <description>`

- Imperative mood, lowercase, no period, max 69 chars, English only
- Body (optional): blank line after description, wrap at 72 chars, explain **what and why** not how
- Footer: `Fixes #123` / `BREAKING CHANGE: ...` / `Co-authored-by: ...`

### Types

| Type       | Use                                      |
| ---------- | ---------------------------------------- |
| `feat`     | New feature for the user                 |
| `fix`      | Bug fix for the user                     |
| `docs`     | Documentation only                       |
| `style`    | Formatting, whitespace — no logic change |
| `refactor` | Code change, neither feature nor fix     |
| `perf`     | Performance improvement                  |
| `test`     | Adding or correcting tests               |
| `tech`     | Dependency upgrades, tooling             |
| `chore`    | Build process or auxiliary tools         |

### Scopes

`ui` (design-system), `web` (app), `config` (ESLint/TS config), `deps` (dependencies)

### Good examples

```
feat(ui): add cosmic Button component with variants
fix(web): resolve button focus styles in dark mode
tech(deps): update Next.js to version 16
refactor(web): simplify navigation state management
```

### Bad examples

```
Added new feature          ← not imperative, not conventional
fix(ui): Fix the button.   ← wrong case + trailing period
FEAT(ui): Add button       ← type must be lowercase
feat(ui): add a very long description that exceeds the sixty-nine character limit
```

### Breaking changes

```
feat(ui)!: remove deprecated Button props
# or in footer:
BREAKING CHANGE: remove deprecated Button API
```

## Manual Validation Checklist

After making changes, validate the app manually:

1. `yarn dev` → open http://localhost:3000
2. Verify the "Go Cosmic" heading renders
3. Click "Try me" button → alert should appear
4. Click "Cosmic developer" link → opens external link
5. Switch languages (EN → FR → ES → DE → IT):
   - URL should update to locale-prefixed format (`/fr/`, `/de/`, etc.)
   - Content should be fully translated
   - Browser back/forward navigation should work
6. Navigate to each route and verify it renders:
   - `/about` — company overview and developer profile
   - `/services` — all four service sections
   - `/offers` — all three offer packages
   - `/journey` — 3D starfield loads (WebGL)
   - `/contact` — contact form renders
   - `/local` (locale-specific slug, e.g. `/en/web-mobile-developer-annecy-geneva`) — local SEO page
   - `/projects` — project index renders
   - `/projects/daily-fortune` — Daily Fortune showcase
   - `/projects/mcomperat` — mcomperat showcase
   - `/projects/psc-supersprint` — PSC Supersprint showcase
   - `/projects/choeurdespaysdumontblanc` — Choeur des Pays du Mont Blanc showcase
7. `yarn test` — all tests must pass

## Coverage System

`yarn coverage` generates reports in three formats: terminal, HTML (`coverage/index.html`), and JSON.

**Thresholds (all must stay ≥ 90%)**: lines, functions, branches, statements.

**Excluded from coverage** (configured in `vitest.config.ts`):

- `node_modules/`, `.next/`, `.yarn/`, `dist/` — build artifacts
- `__tests__/`, `**/*.test.*`, `**/*.spec.*`, `**/*.d.ts` — test files
- `**/*.config.*` — configuration files
- `i18n/*.ts` — i18n routing/request configuration
- `app/**` — server-component pages and layouts; unit-testing Next.js server components adds negligible value and the project guidance explicitly discourages page/view snapshots. App-level utilities (`app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx`) are **not** excluded and must maintain coverage.
- `views/**` — complex view-layer files (e.g. the Journey 3D canvas) that are intentionally outside unit-test scope per project conventions.

CI fails if any threshold drops below 90%. Add tests for any new code before opening a PR.
