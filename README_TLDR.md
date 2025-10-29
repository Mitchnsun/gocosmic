# Go Cosmic - TL;DR

Quick reference guide for getting started with the Go Cosmic project.

## What is Go Cosmic?

A **multilingual web application** (EN, FR, ES, DE, IT) showcasing Go Cosmic's portfolio, team, and development services. Features a cosmic theme with interactive 3D experiences.

## Quick Start

```bash
# Enable Corepack for yarn (first time only)
corepack enable

# Install dependencies (3.5 min)
yarn

# Start development server
yarn dev

# Access at http://localhost:3000
```

## Tech Stack

- **Next.js 15** + **React 19** + **TypeScript 5.8**
- **TailwindCSS 4.x** for styling
- **next-intl** for internationalization (5 languages)
- **Three.js** + **React Three Fiber** for 3D graphics
- **Vitest** + **Testing Library** for testing

## Project Structure

```
├── app/[locale]/          # Internationalized pages
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── offers/            # Offers page
│   ├── journey/           # 3D cosmic experience
│   └── projects/          # Project showcases
├── components/            # React components
├── messages/              # Translations (organized by namespace)
│   ├── en/, fr/, es/, de/, it/
│   │   ├── common.json    # Shared strings
│   │   ├── navigation.json
│   │   ├── footer.json
│   │   ├── home.json
│   │   └── [page].json
├── i18n/                  # i18n configuration
├── design-system/         # Reusable UI components
└── __tests__/             # Unit tests

```

## Essential Commands

```bash
yarn dev              # Development server
yarn build            # Production build (34 sec)
yarn test             # Run tests (4 sec)
yarn coverage         # Test coverage report
yarn lint             # Lint code (7 sec)
yarn format           # Format code (2 sec)
yarn check-types      # TypeScript validation (9 sec)
```

## Before Committing

**ALWAYS run these commands (CI will fail otherwise):**

1. `yarn format`
2. `yarn lint`
3. `yarn check-types`
4. `yarn test`
5. `yarn coverage`

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `tech`, `chore`

**Rules**:

- Imperative mood, lowercase, no period
- Max 69 characters for description
- English only

**Examples**:

```bash
feat(ui): add cosmic Button component
fix(web): resolve navigation issue on mobile
docs: update README installation instructions
tech(deps): update Next.js to version 15
```

## Before Opening a PR

**CRITICAL - Update version and changelog:**

1. **Increment version in `package.json`** ([Semantic Versioning](https://semver.org/)):
   - **PATCH** (x.y.Z) - Bug fixes: `1.0.3` → `1.0.4`
   - **MINOR** (x.Y.0) - New features: `1.0.3` → `1.1.0`
   - **MAJOR** (X.0.0) - Breaking changes: `1.0.3` → `2.0.0`

2. **Add entry to `CHANGELOG.md`**:

   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### Added

   - New features

   ### Changed

   - Changes in existing functionality

   ### Fixed

   - Bug fixes

   ### Removed

   - Removed features
   ```

3. Use current date in YYYY-MM-DD format (e.g., 2025-10-29)

## Adding New Routes

1. Create page: `app/[locale]/your-route/page.tsx`
2. Add translated pathnames in `i18n/routing.ts`:
   ```typescript
   pathnames: {
     '/your-route': {
       en: '/your-route',
       fr: '/votre-route',
       es: '/tu-ruta',
       de: '/ihre-route',
       it: '/la-tua-route',
     },
   }
   ```
3. Create or update namespace files in `messages/[locale]/[namespace].json`
4. Update `i18n/request.ts` to map route to namespace
5. Test in all locales

## Internationalization (i18n)

**Namespace Organization:**

- `common.json` - Shared strings (404, meta, language switcher)
- `navigation.json` - Header navigation
- `footer.json` - Footer content
- `[page].json` - Page-specific content

**Usage in components:**

```tsx
import { useTranslations } from 'next-intl';

export default function MyPage() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

**Adding translations:**

1. Add to `messages/en/[namespace].json` first (English is base)
2. Translate to all other locales (fr, es, de, it)

## Testing

- Components using translations need `next-intl` context
- Use custom render from `__tests__/test-utils.tsx`
- Focus on behavior, not implementation
- Validate accessibility (ARIA attributes)
- 80% coverage threshold enforced

## Key Pages

- **Homepage** (`/`) - Hero section, CTA, team link
- **About** (`/about`) - Company overview, developer profile, legal
- **Services** (`/services`) - Development, design, AI, launch
- **Offers** (`/offers`) - Solo, team, duo packages
- **Journey** (`/journey`) - 3D cosmic experience with Three.js
- **Projects** (`/projects/*`) - Project showcases (e.g., Daily Fortune)

## Coding Standards

- **TypeScript-first** with strict type checking
- **ESLint 9.x** with zero warnings (`--max-warnings 0`)
- **Prettier** for formatting
- **Conventional Commits** enforced
- **Pre-commit hooks** via Husky + lint-staged
- **80% test coverage** requirement

## Important Notes

- **NEVER cancel builds** - Wait at least 15 minutes
- Node.js >= 22 recommended (works on v20 with warnings)
- All commands listed above must complete successfully before PR
- English is the base language for translations
- Coverage threshold is 80% (lines, functions, branches, statements)

## Documentation

- **README.md** - Full project documentation
- **CONTRIBUTING.md** - Contribution guidelines and workflow
- **CHANGELOG.md** - Version history and changes
- \***\*tests**/TESTING.md\*\* - Testing guidelines

## Need Help?

1. Check `README.md` for detailed information
2. Check `CONTRIBUTING.md` for workflow details
3. Check `.github/copilot-instructions.md` for development guidance
4. Open an issue or contact maintainers
