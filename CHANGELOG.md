# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.3.0] - 2026-04-29

### Added

- Projects index page (`/projects`) listing all projects as clickable cards with icon and short description
- `data/projects.json` file to centrally register projects (id, slug, icon, i18nKey) — add a new entry here to have it appear on the projects page automatically
- `projectsList` translation namespace in all 5 locale files (en, fr, es, de, it) for the projects index page title, subtitle, meta, and card content
- "Projects" navigation link in the Header with translations in all locales
- Localized `/projects` route in `i18n/routing.ts` (e.g. `/projets` in French)
- `@/data/*` TypeScript path alias for clean imports from the `data/` directory
- Documentation in `CONTRIBUTING.md` with step-by-step instructions for adding a new project

### Changed

- Header now includes a Projects navigation link with `FolderOpenIcon` icon

## [1.2.3] - 2026-04-26

### Added

- PSC Supersprint project page (`/projects/psc-supersprint`) with full i18n support across all 5 locales (EN, FR, ES, DE, IT)
- AI orchestration workflow annex in `.github/copilot-instructions.md` as a complementary reference for AI agents (Workflow Orchestration, Task Management, Core Principles)
- `docs/lessons.md` persistent lessons log committed to the repository for AI agent continuity

### Changed

- `/tasks` added to `.gitignore` — ephemeral AI planning files are no longer accidentally committed

## [1.2.2] - 2026-03-05

### Removed

- Removed unused `eslint-config-expo` devDependency (Expo-specific package not used in this Next.js project)

## [1.2.1] - 2025-12-10

### Changed

- Site background color updated from `bg-gray-900` to `bg-slate-950` for improved visual appearance
- Updated background colors in Header, Footer, and Journey page loader components
- Updated test assertions to reflect new background color
- Updated Next.js from v15.5.0 to v15.5.7 for Vercel deployment compatibility

## [1.2.0] - 2025-11-03

### Added

- Contact page with 4 distinct blocks for different email addresses (contact, support, technique, prospect)
- Translation files for contact page in all 5 supported languages (EN, FR, ES, DE, IT)
- Internationalized routing for `/contact` path with localized URLs
- Contact namespace loading in i18n configuration
- Test coverage for the new contact page
- Added Choeur des Pays du Mont Blanc project page
- SEO metadata (title and description) for About, Contact, Journey, Services, and Offers pages
- `generateMetadata` functions in all main pages for dynamic SEO optimization
- Meta translations in all namespace files (about, contact, journey) across all 5 languages

### Changed

- Header navigation: Contact link now redirects to the new contact page instead of external link
- Updated navigation translations across all languages to reflect internal contact page
- Contact page: improved styling consistency using `cn()` utility for className management
- Page components: async params handling updated to comply with Next.js 15 requirements

### Fixed

- ESLint warnings: removed unused imports in test files (middleware, pages tests)
- Type safety: proper async handling of `params` prop in all `generateMetadata` functions

### Removed

- eslint-plugin-sonarjs: removed plugin and all its rules from ESLint configuration to streamline linting setup

## [1.1.2] - 2025-11-02

### Added

- Added mcomper.at project page
- Vercel Analytics

## [1.1.1] - 2025-10-31

### Added

- New localized keys for email contact subject and aria-label in About page translations (EN, FR, ES, DE, IT)

### Changed

- About, Services, and Offers pages: replace external contact links with mailto links and localized subjects
- Services page: add journey link to interactive experience
- About page: use i18n key for LinkedIn link aria-label for accessibility
- Update translations texts for offers and contact across multiple languages

## [1.1.0] - 2025-10-29

### Added

- Namespace-based organization for translation files (common, navigation, footer, home, about, services, offers, journey, projects)
- Dynamic namespace loading based on current route for optimized performance
- README_TLDR.md quick reference guide for developers
- Version and changelog management instructions in CONTRIBUTING.md and copilot-instructions.md

### Changed

- Translation files reorganized from single files per locale to namespace-based structure
- i18n configuration updated to support namespace-based loading
- Test utilities updated to merge all namespace files for testing

### Removed

- Legacy single-file translation structure

## [1.0.3] - 2025-10-28

### Added

- Daily Fortune application showcase page with multilingual support (EN, FR, ES, DE, IT)
- Internationalized routing for `/projects/daily-fortune` path

## [1.0.2] - 2025-10-15

### Added

- Remove mono repo, repo with just gocosmic website

## [1.0.1] - 2025-08-29

### Added

- Go Live /services

## [1.0.0] - 2025-08-27

### Added

- Go Live Homepage, /journey, /about
