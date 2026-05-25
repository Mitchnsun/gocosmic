# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.6.2] - 2026-05-25

### Added

- Localized keyboard skip-link in the header (`navigation.skip_to_content`) targeting a real `<main id="main-content">` region in `app/[locale]/layout.tsx`
- New `LogoOrbitalDot` component in `components/Header/` with `logoOrbitalEnabled` and `reduceMotion` guards

### Changed

- Refactored the header into a sticky adaptive navigation bar with scroll-based compact height behavior, responsive height mapping, and backdrop blur treatment
- Replaced the header orbital-dot visual effect implementation with `motion/react` animation in `LogoOrbitalDot`
- Expanded header tests to cover sticky/adaptive height behavior, reduced-motion handling, and viewport resize paths

## [1.6.1] - 2026-05-20

### Added

- New interactive pricing simulator page with an animated multi-step flow to estimate project needs (website, mobile app, or both)
- Detailed pricing logic with subscription plans and 600 EUR HT/day daily-rate options depending on project complexity and maintenance frequency
- Product integration completed with reset action, dedicated SEO metadata, and pricing entry in the main navigation
- Full internationalization support for the pricing page across EN, FR, ES, DE, and IT, including localized routes
- 19 new unit tests covering simulator interactions and decision branches

## [1.6.0] - 2026-05-15

### Added

- `components/CosmicCursor/CosmicCursor.tsx` — canvas-based custom cursor with trailing dots, orbital animation, magnetic snap, and dynamic accent colors. Respects `prefers-reduced-motion` (static dot only) and is disabled on touch devices. Renders at 60fps via RAF; `pointer-events: none` canvas overlays the page at `z-index: 9999`.
- `components/CosmicCursor/useCosmicCursor.ts` — hook that tracks mouse position, velocity, magnetic elements (`[data-magnetic]` / `data-accent`), auto-magnetic `<a>`/`<button>` detection, and `prefers-reduced-motion` media query changes.
- `components/CosmicCursor/useMagneticElements.ts` — `useMagneticElements` hook to programmatically mark elements as magnetic by CSS selector with optional accent color.
- `components/CosmicCursor/index.ts` — barrel export for the CosmicCursor component and hooks.
- Integrated `CosmicCursor` into `app/[locale]/layout.tsx` so it is active on every page.
- `__tests__/components/CosmicCursor.test.tsx` — unit tests for component mounting, prop handling, event listener cleanup, and `useMagneticElements` hook.

### Changed

- Split typography into two font roles: Space Grotesk (headings, header and footer links) and Inter (body text)

## [1.5.0] - 2026-05-14

### Added

- `CLAUDE.md` — authoritative guide for AI-agent behavior: commands, architecture, commit conventions, PR checklist, and autonomous workflow instructions
- `GUIDELINES.md` — UI principles (cosmic theme, WCAG requirements), coding standards, ESLint plugin roles, manual validation checklist, and coverage thresholds
- `AGENTS.md` — Codex-specific operating notes, project shortcuts, and development rules that complement `CLAUDE.md`
- Updated `README.md` with full project overview, setup instructions, architecture summary, and contributing guidelines
- Updated `__tests__/TESTING.md` with latest test patterns and custom render utility notes
- Condensed `.github/copilot-instructions.md` to reference `CLAUDE.md` and `GUIDELINES.md` as primary sources of truth
- HTTP security headers on all routes via `next.config.ts`: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, and `Permissions-Policy`
- `SECURITY.md` — security best practices section covering HTTP headers, API route requirements (input validation, auth, CSRF, CORS, rate limiting), and guidance for Server Actions and env variables
- `GUIDELINES.md` — Security section with a quick-reference table directing developers to `SECURITY.md` before adding API routes, Server Actions, env variables, or third-party scripts
- `components/Starfield/Starfield.tsx` — reusable canvas-based 2D starfield component with perspective warp-speed effect, zero external dependencies, 60fps via `requestAnimationFrame`, fully configurable (`starCount`, `speed`, `className`), auto-resizes with the viewport
- `components/Starfield/index.ts` — barrel export for the Starfield component
- Animated Starfield background integrated into the homepage hero section, replacing the static gradient

### Changed

- Upgraded Yarn from 4.10.3 to 4.14.1
- Upgraded `next` 16.2.4 → 16.2.6
- Upgraded `react` / `react-dom` ^19.1.1 → ^19.2.6
- Upgraded `typescript` 5.8.3 → 5.9.3
- Upgraded `tailwindcss` ^4.1.11 → ^4.3.0 and `@tailwindcss/postcss` ^4.1.11 → ^4.3.0
- Upgraded `next-intl` ^4.11.0 → ^4.12.0
- Upgraded `three` ^0.179.1 → ~0.182.0, `@react-three/fiber` ^9.3.0 → 9.6.1, `@react-three/drei` ^10.7.2 → 10.7.7
- Upgraded `eslint` ^9.34.0 → ^9.39.4 and `typescript-eslint` ^8.35.0 → ^8.59.3
- Upgraded `prettier` ^3.6.2 → ^3.8.3 and `prettier-plugin-tailwindcss` ^0.6.14 → ^0.8.0
- Upgraded `@types/react` 19.1.11 → 19.2.14 and `@types/react-dom` 19.1.7 → 19.2.3
- Upgraded `@testing-library/react` ^16.1.0 → ^16.3.2 and `@testing-library/jest-dom` ^6.6.3 → ^6.9.1
- Various other minor dev-dependency bumps (`autoprefixer`, `baseline-browser-mapping`, `eslint-plugin-*`, `globals`, `lint-staged`, `postcss`, `@types/node`, `@types/three`, `@radix-ui/react-slot`, `@vercel/analytics`, `tailwind-merge`)

## [1.4.6] - 2026-05-13

### Added

- Dedicated localized SEO landing page at `/local` for "Développeur Web & Mobile Annecy / Genève"
- New localized route mapping for the page across all supported locales
- New `local` translation namespace in EN, FR, ES, DE, and IT
- Footer internal link and Services CTA link pointing to the new local SEO page
- Unit tests for the new Local page and canonical URL coverage for `/local`

### Changed

- Redesigned footer to a 3-column layout: Brand (title + studio tagline translated in 5 languages), Studio (navigation links to Services, Projects, Offers, About, Contact), and Offers (3 offer packages linking to /offers page)
- Namespace loading in `i18n/request.ts` to load `local` messages for localized `/local` pathnames

## [1.4.5] - 2026-05-12

### Added

- Locale layout metadata now publishes hreflang alternates for all supported locales (`en`, `fr`, `es`, `de`, `it`) plus `x-default`
- Added `LocalBusinessSeo` component to publish `ProfessionalService` JSON-LD for Go Cosmic
- Injected local business JSON-LD in `app/[locale]/layout.tsx` so it is rendered site-wide
- Open Graph (`og:title`, `og:description`, `og:image`) and Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) meta tags via `generateMetadata` across all pages (layout, about, services, offers, journey, contact, projects, and all project sub-pages)
- Locale-aware OG and Twitter Card images via the `getOgImages(locale)` helper in `lib/og.ts`: each locale resolves to its own image asset (e.g. `/og-default-en.jpg`, `/twitter-card-fr.jpg`), falling back to the default locale (`en`) for unknown locales
- `summary_large_image` Twitter card type on all pages for rich social sharing previews

### Changed

- Main locale `generateMetadata` now sets `metadataBase` and locale-root canonical alternates in `app/[locale]/layout.tsx`
- Introduced shared `SITE_URL` config in `lib/config.ts` and reused it in canonical metadata helpers
- Migrated Next.js routing entry from `middleware.ts` to `proxy.ts` to align with Next.js 16 file convention deprecation
- Renamed default export from `middleware` to `proxy` while preserving `next-intl` i18n routing and `x-pathname` header behavior
- Updated related references in tests and documentation to use `proxy.ts`
- Local business JSON-LD now localizes `description`, `areaServed`, and `inLanguage` based on the active locale

## [1.4.4] - 2026-05-10

### Added

- Added localized geo-content on Home, About, and Services pages for all 5 locales (EN, FR, ES, DE, IT)
- Home: new localized "service area" section with locale-specific location labels
- About: new localized mission location callout under mission conclusion
- Services: new localized geo-availability text in CTA section
- Dynamic `robots.txt` metadata route via `app/robots.ts` allowing all crawlers (`User-agent: *`, `Allow: /`)
- Sitemap declaration in robots metadata pointing to `https://www.gocosmic.dev/sitemap.xml`
- Unit coverage for robots metadata generation in `__tests__/pages/Robots.test.ts`

## [1.4.3] - 2026-05-08

### Added

- Website structured data to publish a `WebSite` JSON-LD block
- Person JSON-LD structured data on the About page for Matthieu Compérat via `next-seo`
- Dedicated `components/JsonLd/PersonSeo.tsx` component injected in `app/[locale]/about/page.tsx`
- About page test assertions and snapshot coverage for rendered `person-jsonld` script

### Changed

- Person schema URL now resolves from locale-aware canonical routing (`getCanonicalUrl(locale, '/about')`)
- Person schema job title is localized for all supported locales (en, fr, es, de, it)

## [1.4.2] - 2026-05-06

### Changed

- Enriched all page metadata (title/description) with local geo-targeting keywords: Annecy, Genève/Geneva, Haute-Savoie
- Added dedicated `meta` blocks to `services.json` and `offers.json` to decouple SEO metadata from visible page headings
- Updated `services/page.tsx` and `offers/page.tsx` to use `meta.title`/`meta.description` translation keys
- Updated metadata for all 5 locales (EN, FR, ES, DE, IT) across: home, about, services, offers, journey, projects pages

## [1.4.1] - 2026-05-04

### Added

- Canonical tags (`<link rel="canonical">`) for all pages via Next.js `alternates.canonical` metadata
- `i18n/canonical.ts` utility module with `getCanonicalUrl(locale, routeKey)` helper that resolves localized paths from the routing configuration
- Canonical URLs use the localized pathname for each locale (e.g. `/fr/a-propos` for the About page in French)
- Dynamic `sitemap.xml` generation via `app/sitemap.ts` covering all routes and all 5 locales (en, fr, es, de, it) using `MetadataRoute.Sitemap`

## [1.4.0] - 2026-05-01

### Changed

- Upgraded Next.js from 15.5.7 to **16.2.4**
- Upgraded `next-intl` from 4.3.5 to 4.11.0 (adds Next.js 16 peer dependency support)
- Upgraded `@next/eslint-plugin-next` from 15.3.0 to 16.2.4

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
