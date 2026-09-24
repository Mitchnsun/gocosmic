# Cosmic Studio Web - Main Application

The main web application of Cosmic Studio (formerly Go Cosmic, still served from `gocosmic.dev`), serving as the public showcase and business platform of the studio. This platform is designed to **present Cosmic Studio's work, showcase its applications, introduce the team, and promote its web and mobile services** to craftspeople, associations and independents looking for a website with human support.

## Primary Objectives

The Cosmic Studio website serves as the primary business interface with the following goals:

- **Portfolio Showcase**: Present Cosmic Studio's applications and development projects
- **Studio Presentation**: Introduce the person behind the studio and his background
- **Service Promotion**: Highlight development services offered to potential clients
- **Brand Identity**: Establish Cosmic Studio as a trusted local studio with a light space theme ("Go Cosmic" remains the call-to-action signature)
- **Client Acquisition**: Convert visitors into clients through compelling presentation

## Current Features

### Internationalization (i18n)

- **5 Languages**: Complete support for English, French, Spanish, German, and Italian
- **Type-Safe Translations**: Full TypeScript integration with compile-time validation
- **SEO Optimization**: Dynamic metadata and lang attributes per locale
- **Clean URLs**: Locale-prefixed routing (`/en/`, `/fr/`, `/es/`, `/de/`, `/it/`)
- **Translated Pathnames**: Route paths are localized for better SEO and UX (e.g., `/en/about` → `/fr/a-propos`, `/en/projects` → `/de/projekte`)
- **Browser Detection**: Automatic locale detection based on user preferences
- **Language Switcher**: Intuitive dropdown component with flag icons and current language indication
- **Namespace Organization**: Translation files are organized by namespace for better maintainability and scalability

#### Translation File Structure

Translations are organized into namespace-based files for improved organization and maintainability:

```
messages/
  ├── en/              # English translations
  │   ├── common.json        # Shared strings (404, meta, language switcher)
  │   ├── navigation.json    # Header navigation labels
  │   ├── footer.json        # Footer content
  │   ├── home.json          # Homepage content
  │   ├── about.json         # About page content
  │   ├── services.json      # Services & pricing page content
  │   ├── pricing.json       # Pricing columns and subscription simulator
  │   ├── projects.json      # Projects list and case studies
  │   ├── contact.json       # Contact page content
  │   ├── free-mockup.json   # Free mockup page content
  │   ├── local.json         # Local SEO page content
  │   ├── legal.json         # Privacy policy and legal notice
  │   └── psc-supersprint.json # PSC Supersprint case study content
  ├── fr/              # French (same structure)
  ├── es/              # Spanish (same structure)
  ├── de/              # German (same structure)
  └── it/              # Italian (same structure)
```

**Benefits of namespace organization:**

- **Better maintainability**: Each namespace is self-contained and easier to manage
- **Improved scalability**: Adding new pages requires only creating/updating specific namespace files
- **Clear separation**: Shared components (navigation, footer) have dedicated namespaces
- **Easier collaboration**: Multiple developers can work on different namespaces without conflicts
- **Optimized loading**: Only necessary namespaces are loaded per route for better performance

**Dynamic Loading:**

The application uses intelligent on-demand loading:

- **Shared namespaces** (`common`, `navigation`, `footer`) are loaded on every page
- **Page-specific namespaces** are loaded only when needed based on the current route
- This reduces bundle size and improves initial load times

**Usage in components:**

Components use the `useTranslations` hook with the appropriate namespace:

```tsx
import { useTranslations } from 'next-intl';

// In a page component
export default function HomePage() {
  const t = useTranslations('homepage');
  return <h1>{t('hero.title')}</h1>;
}

// In a shared component
export default function Header() {
  const t = useTranslations('navigation');
  return <nav>{t('label')}</nav>;
}
```

### Homepage

- **Hero**: visibility promise ("Your business deserves to be seen / found / chosen", the last word cycling), four key facts (starting monthly price, reply within 24 h, one point of contact, area served), the "Go Cosmic" call-to-action leading to the free mockup page and a secondary link to the pricing
- **Audience**: who the studio works for (craftspeople, associations, independents starting out)
- **Why a studio**: four reasons to choose a studio rather than a site builder
- **Process**: four-step timeline (meeting, mockup, build, launch)
- **Pricing**: the same two pricing columns as the Services & pricing page
- **Projects**: the first three project cards and a link to the full list
- **Own apps**: the studio's own mobile app, Daily Fortune
- **Studio**: who is behind the studio and the areas served
- **Closing call-to-action**: link to the contact page and to the free mockup, over a star field that accelerates on hover

### Services & Pricing Page (`/services`)

Replaces the former services, offers and pricing pages.

- **Introduction**: what the studio offers, a site that runs and someone who looks after it
- **Pricing columns**: a monthly subscription (site, hosting and care) and a one-off project quoted on request, with indicative starting prices for a members' area, a shop and a mobile app (figures in `lib/pricing/offers.ts`)
- **Subscription simulator**: base plan plus options (number of pages, domain name, hosting in Switzerland, email address, content changes), with a sticky recap showing the live monthly total; its "Request my free mockup" button carries the simulation over to the free mockup form, and a block below it presents the two free offers (a mockup and a review of the current website)
- **Trades**: four cards (showcase sites, shops and bookings, apps, visibility and care)
- **For companies**: other ways to work with the studio (day-rate mission, developer + designer duo, full team), with a link to the contact page
- **FAQ**: accordion answering five common questions (ownership, editing the site, time to go live, stopping the subscription, texts and photos)
- **Closing call-to-action**: link to the contact page

Prices are shown in euros, or in Swiss francs for visitors located in Switzerland (detected from the Vercel country header). The homepage and the about page follow the same rule.

### Projects Page (`/projects`)

- **Project grid**: one card per project with its visual, type, year, client, summary, tags and a link to its case study
- **Filters**: "All", "Website", "Web app" and "Mobile app" buttons; the number of matching projects is announced to screen readers
- **Shareable filter**: the active filter is kept in the `?type=` URL parameter (`site`, `webapp` or `mobile`), so a filtered list can be shared
- **Closing call-to-action**: link to the contact page

#### Case Studies

All four case studies share one template: a header with the year, client and project type, three numbered sections ("For whom", "What we did", "Result"), a link to the live project with a "Discuss a similar project" link to the contact page, and previous / next navigation between case studies.

- **Chœur des Pays du Mont Blanc** (`/projects/choeurdespaysdumontblanc`): the choir's website, with upcoming concerts, repertoire and how to join
- **PSC Supersprint** (`/projects/psc-supersprint`): live race results for a triathlon club, with its own translation namespace
- **Daily Fortune** (`/projects/daily-fortune`): the studio's own mobile app, published on the App Store and Google Play
- **mcomper.at** (`/projects/mcomperat`): a multilingual online résumé

### About Page (`/about`)

- **Background**: Matthieu Compérat's path, the areas served and a link to his LinkedIn profile
- **Why craftspeople and associations**: four reasons the studio works for them (being found locally, a price that follows the business, someone who answers, AI used only where it helps)
- **Closing call-to-action**: link to the contact page
- **Structured data**: a JSON-LD `Person` entry for search engines

### Contact Page (`/contact`)

- **Contact details**: general and support email addresses, the area served and the studio's current availability
- **"Write a message" tab**: contact form (name, email, phone, company, type of need, message), sent by email through Resend
- **"Book a call" tab**: Google Calendar booking page for a 20-minute call; since Google sets its own cookies, the calendar only loads once the visitor clicks to show it, and on narrow screens the booking page opens in a new tab instead. The page address comes from `NEXT_PUBLIC_GCAL_BOOKING_URL`; without it, the tab invites visitors to write a message
- **Privacy notice**: link to the privacy policy

### Free Mockup Page (`/free-mockup`)

Lead-capture page where a prospect asks for a free mockup of their future website: email, colour direction (closed list of six), current website URL and a free-text field capped at 500 characters. Submissions go through a server action that validates them with `zod` and emails them via Resend — there is no database. A hidden honeypot field silently drops bot submissions. When the visitor comes from the pricing simulator, their simulation is attached to the request. Entry points: the header button, the homepage hero, and the simulator on the Services & pricing page.

### Local SEO Page (`/local`)

Locale-specific landing page targeting local searches (e.g., `/en/web-mobile-developer-annecy-geneva`, `/fr/developpeur-web-mobile-annecy-geneve`). It lists the areas served and links to Services & pricing, the projects and the contact page.

### Legal Pages

- **Privacy policy** (`/privacy`): how personal data is handled, visitors' rights and cookies
- **Legal notice** (`/legal-notice`): publisher, hosting, intellectual property, and the statements on the use of artificial intelligence

### Not Found Page

Localized 404 page with links back to the homepage and to the contact page. Unknown paths under a locale prefix are routed to it.

### Retired Pages

The former `/journey` (3D experience), `/offers` and `/pricing` pages no longer exist. They permanently redirect (301) to Services & pricing in every locale, including their former localized slugs (see `lib/redirects.ts` and `next.config.ts`).

### Technical Features

- **Optimal Performance**: Server-side rendering and automatic optimizations
- **Modern Architecture**: Built with Next.js 16 and React 19
- **Type Safety**: Full TypeScript implementation
- **Component System**: Reusable UI components with proper JSDoc documentation

## Future Enhancements

- **Team Profiles**: Individual developer profiles with skills and experience
- **Testimonials**: Client feedback and success stories
- **Blog/Articles**: Technical insights and company updates

## Development Setup

### Prerequisites

- Node.js >= 24
- yarn (via Corepack)

### Installation and Launch

```bash
# Enable Corepack for yarn (first time only)
corepack enable

# Install dependencies (if not already done)
yarn

# Launch web app in development
yarn dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill it in. Server-only secrets must never be prefixed with `NEXT_PUBLIC_`.

| Variable                       | Required | Purpose                                                                                                                                                                                                        |
| ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`               | Yes      | Resend API key used to email free mockup requests and contact form submissions. Without it, the free mockup form reports a send failure and the contact form logs submissions locally instead of sending them. |
| `RESEND_FROM_EMAIL`            | No       | Sender of those emails; must be verified in the Resend dashboard. Defaults to `Cosmic Studio <noreply@gocosmic.dev>`.                                                                                          |
| `NEXT_PUBLIC_GCAL_BOOKING_URL` | No       | Google Calendar appointment page embedded in the contact page's "Book a call" tab. Only `calendar.google.com` URLs are accepted; when empty the tab invites visitors to write instead.                         |

### Available Scripts

```bash
# Development
yarn dev

# Production build
yarn build

# Production launch
yarn start

# Formatting
yarn format

# Linting
yarn lint

# Type checking
yarn check-types

# Testing
yarn test           # Run unit tests
yarn test:watch     # Run tests in watch mode
yarn coverage       # Generate test coverage report
```

### Adding New Routes

When adding new routes to the application, follow this procedure to maintain internationalization consistency:

1. **Create the route**: Add the new page component in `app/[locale]/your-route/page.tsx`

2. **Configure translated pathnames**: Update `i18n/routing.ts` to add localized route paths:

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

3. **Add translations**: Include any new translation keys in all locale message files (`messages/`)

4. **Update navigation**: If the route needs navigation links, add them to relevant navigation components

5. **Test thoroughly**: Ensure the route works correctly in all locales and verify functionality

This approach ensures SEO-friendly URLs and consistent user experience across all supported languages.

## Technologies Used

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - Latest React with server components
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type safety and robust development
- **[next-intl](https://next-intl.dev/)** - Type-safe internationalization with 5 language support
- **[TailwindCSS 4.x](https://tailwindcss.com/)** - Styling with cosmic design system
- **[Three.js](https://threejs.org/)** - 3D graphics and interactive experiences
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[Heroicons](https://heroicons.com/)** - Beautiful hand-crafted SVG icons
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities

## Testing

The application includes comprehensive unit tests covering components, pages, and helpers. Tests follow accessibility-first principles and validate cosmic theme consistency.

### Test Structure

```
__tests__/
├── components/      # Component unit tests
├── design-system/   # Components from design-system unit tests
├── pages/           # Page component tests
├── test-setup.tsx   # Global test configuration
└── test-utils.tsx   # Custom render utilities with i18n context
```

### Test Utils with Internationalization

The `test-utils.tsx` file provides a custom render function that includes next-intl context for testing components that use translations. It merges all namespace files into a single messages object:

```tsx
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

// Import all namespace files
import common from '../messages/en/common.json';
import navigation from '../messages/en/navigation.json';
import footer from '../messages/en/footer.json';
// ... other namespaces

// Merge all namespaces
const messages = {
  ...common,
  ...navigation,
  ...footer,
  // ... other namespaces
};

// Custom render with i18n context
const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });

export { customRender as render };
```

### Navigation Mocking

For components using Next.js navigation hooks, global mocks are configured:

```tsx
// Mock next/navigation for testing
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en',
}));
```

### Best Practices

- **Behavior-focused testing** - Tests validate user experience, not implementation details
- **Accessibility validation** - All tests verify ARIA attributes and semantic structure
- **Cosmic theme validation** - Tests ensure consistent space-inspired styling
- **i18n Testing** - Components using translations are tested with proper context
- **Mock strategy** - External dependencies are properly mocked for isolation
- **Snapshot avoidance** - No snapshot tests: assert behaviour and accessibility attributes instead

For detailed testing guidelines, see [`__tests__/TESTING.md`](./__tests__/TESTING.md).

## Architecture

```
├── app/              # App Router (Next.js 16+)
│   ├── [locale]/     # Internationalized routes
│   │   ├── about/    # About page (background, why craftspeople and associations, LinkedIn)
│   │   ├── contact/  # Contact page (details, message form, call booking)
│   │   ├── free-mockup/ # Free mockup request page
│   │   ├── legal-notice/ # Legal notice (including AI usage statements)
│   │   ├── local/    # Local SEO landing page
│   │   ├── privacy/  # Privacy policy
│   │   ├── projects/ # Filterable projects list + case studies (daily-fortune, mcomperat, psc-supersprint, choeurdespaysdumontblanc)
│   │   ├── services/ # Services & pricing page (pricing, simulator, trades, formats, FAQ)
│   │   ├── not-found.tsx # Localized 404 page
│   │   └── page.tsx  # Homepage
│   ├── actions/      # Server actions (contact form, free mockup request)
│   ├── layout.tsx    # Root layout with i18n provider
│   └── ...
├── components/       # App-specific components
│   ├── AudienceGrid/ # "Who it's for" cards
│   ├── BookingEmbed/ # Google Calendar booking page, loaded on click
│   ├── CaseStudy/    # Case study template
│   ├── ContactDetails/ # Contact lines and availability
│   ├── ContactForm/  # Contact form
│   ├── ContactPanel/ # "Write a message" / "Book a call" tabs
│   ├── CTAFinal/     # Closing call-to-action with star field
│   ├── Faq/          # FAQ accordion
│   ├── Footer/       # Site footer
│   ├── FreeMockupForm/ # Free mockup request form
│   ├── Header/       # Site header and navigation
│   ├── HeroSection/  # Homepage hero
│   ├── JsonLd/       # Structured data (JSON-LD)
│   ├── LanguageSwitcher/ # Multilingual navigation component
│   ├── OwnApps/      # The studio's own apps
│   ├── PricingColumns/ # Subscription and one-off project columns
│   ├── PricingSimulator/ # Subscription simulator with sticky recap
│   ├── ProjectGrid/  # Project cards and type filters
│   ├── Reveal/       # Fade-in on scroll
│   ├── SectionHeading/ # Eyebrow, title and lead opening each section
│   ├── StudioIntro/  # Who is behind the studio
│   ├── WhyStudio/    # Numbered reasons to choose the studio
│   ├── WorkFormats/  # Formats for companies (mission, duo, team)
│   ├── ...           # Other components (ProcessTimeline, ServicesGrid, StatusBar, CookieConsent…)
│   └── icons/        # Reusable SVG icons
├── design-system/    # Reusable UI primitives
│   ├── button.tsx    # Button with CVA variants
│   ├── pill.ts       # Pill link styles and shared layout constants
│   ├── slider.tsx    # Slider used by the pricing simulator
│   └── lib/utils.ts  # `cn` helper (clsx + tailwind-merge)
├── data/             # Static content (list and order of case studies)
├── lib/              # Shared helpers
│   ├── pricing/      # Offer figures (offers.ts) and the simulation passed to the free mockup form
│   ├── redirects.ts  # 301 redirects from retired pages to Services & pricing
│   ├── region.ts     # Region (France or Switzerland) and currency
│   ├── resend.ts     # Resend email client
│   └── validation/   # Form validation schemas
├── messages/         # Translation files organized by namespace
│   ├── en/           # English translations
│   │   ├── common.json        # Common UI strings (404, meta, language)
│   │   ├── navigation.json    # Header navigation
│   │   ├── footer.json        # Footer content
│   │   ├── home.json          # Homepage content
│   │   ├── about.json         # About page content
│   │   ├── services.json      # Services & pricing page content
│   │   ├── pricing.json       # Pricing columns and simulator
│   │   ├── projects.json      # Projects list and case studies
│   │   ├── contact.json       # Contact page content
│   │   ├── free-mockup.json   # Free mockup page content
│   │   ├── local.json         # Local SEO page content
│   │   ├── legal.json         # Privacy policy and legal notice
│   │   └── psc-supersprint.json # PSC Supersprint case study
│   ├── fr/           # French translations (same structure)
│   ├── es/           # Spanish translations (same structure)
│   ├── de/           # German translations (same structure)
│   └── it/           # Italian translations (same structure)
├── i18n/             # Internationalization configuration
│   ├── routing.ts    # Locale routing setup with translated pathnames
│   ├── request.ts    # Server-side i18n configuration
│   ├── navigation.ts # Client-side navigation utilities
│   └── canonical.ts  # Canonical URL helpers
├── __tests__/        # Comprehensive unit tests
│   ├── components/   # Component tests
│   ├── i18n/         # i18n utility tests (canonical)
│   ├── lib/          # Helper tests
│   ├── pages/        # Page tests
│   ├── proxy.test.ts # Middleware/proxy tests
│   └── test-utils.tsx # Custom render with i18n context
├── proxy.ts          # Locale detection and routing middleware
├── public/           # Static assets and icons
└── ...
```

## Documentation

- Bilingual policy: [DOCS_POLICY.md](./DOCS_POLICY.md)
- Business glossary FR -> EN: [docs/glossary.md](./docs/glossary.md)
- Main agent guide: [CLAUDE.md](./CLAUDE.md)
- Codex guide: [AGENTS.md](./AGENTS.md)
- UI/code standards: [GUIDELINES.md](./GUIDELINES.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security: [SECURITY.md](./SECURITY.md)

Notes on the bilingual docs:

- **No mixed languages on a single page**
- **Technical/prompt/DevOps content is canonical English**
- **Onboarding and product presentation are prioritized in French**
- Keep business terms aligned with the glossary
