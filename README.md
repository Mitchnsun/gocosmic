# Cosmic Studio Web - Main Application

The main web application of Cosmic Studio (formerly Go Cosmic, still served from `gocosmic.dev`), serving as the public showcase and business platform of the studio. This platform is designed to **present Cosmic Studio's work, showcase its applications, introduce the team, and promote its web and mobile services** to small businesses, craftspeople, independents and associations looking for a website with human support.

## Primary Objectives

The Cosmic Studio website serves as the primary business interface with the following goals:

- **Portfolio Showcase**: Present Cosmic Studio's applications and development projects
- **Studio Presentation**: Introduce the person behind the studio and his background
- **Service Promotion**: Highlight development services offered to potential clients
- **Brand Identity**: Establish Cosmic Studio as a trusted local studio with a light space theme ("Go Cosmic" remains the call-to-action signature)
- **Client Acquisition**: Convert visitors into clients through compelling presentation

## Current Features

### Dark and Light Themes

- **Two faces of one universe**: dark ("space", the default) and light ("star"), with the same content and components
- **Theme toggle**: a sun / moon button in the header and the mobile menu; the choice is remembered in the browser and applied before the first paint, with no flash
- **Accessible in both themes**: every text colour reaches WCAG AA contrast, checked by unit tests and by an axe audit of every page (`yarn qa`)

### Internationalization (i18n)

- **5 Languages**: Complete support for English, French, Spanish, German, and Italian
- **Type-Safe Translations**: Full TypeScript integration with compile-time validation
- **SEO Optimization**: Dynamic metadata and lang attributes per locale
- **Clean URLs**: Locale-prefixed routing (`/en/`, `/fr/`, `/es/`, `/de/`, `/it/`)
- **Swiss versions**: every page also exists for Switzerland in each language (`/fr-ch/`, `/de-ch/`, `/it-ch/`, `/en-ch/`, `/es-ch/`), always with the Geneva base and prices in Swiss francs, in Swiss spelling for German (`ss` for `ß`), and linked to the other versions through `hreflang` so that search engines show it to people searching from Switzerland (see `i18n/locales.ts`). The URL decides the version: language-only pages always show the Annecy base and euros, and a footer switch moves between the two versions in the same language
- **Translated Pathnames**: Route paths are localized for better SEO and UX (e.g., `/en/about` → `/fr/a-propos`, `/en/projects` → `/de/projekte`)
- **Pages in some languages only**: a page written for French searches is published in French only (`ROUTE_LANGUAGES` in `i18n/routing.ts`, Swiss version included). Elsewhere it answers 404 and stays out of the sitemap and the `hreflang` links; the language switchers open the home page of a language it does not exist in, and links to it only show in French
- **Browser Detection**: Automatic locale detection based on user preferences; visitors located in Switzerland (detected from the Vercel country header) and browsers set to a Swiss locale (e.g. `fr-CH`) land on the Swiss version
- **Language Switcher**: Intuitive dropdown component with flag icons and current language indication
- **Namespace Organization**: Translation files are organized by namespace for better maintainability and scalability

#### Translation File Structure

Translations are organized into namespace-based files for improved organization and maintainability:

```
messages/
  ├── en/              # English translations
  │   ├── common.json        # Shared strings (404, meta, language switcher, theme toggle)
  │   ├── navigation.json    # Header navigation labels
  │   ├── footer.json        # Footer content
  │   ├── home.json          # Homepage content
  │   ├── about.json         # About page content
  │   ├── story.json         # Story page content
  │   ├── services.json      # Services page content
  │   ├── pricing.json       # Pricing columns, subscription simulator and guided mode
  │   ├── pricing-page.json  # Pricing page metadata and introduction
  │   ├── projects.json      # Projects list and case studies
  │   ├── contact.json       # Contact page content
  │   ├── free-mockup.json   # Free mockup page content
  │   ├── local.json         # Local SEO page content
  │   ├── legal.json         # Privacy policy, legal notice and terms of sale
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
- **Lean pages**: Each page sends the browser only the namespaces its interactive components read

**Loading:**

Pages are rendered at build time and served from the CDN cache:

- The server loads every namespace, so a top-level key must not appear in two files
- The browser only receives the namespaces a page declares through `getClientMessages` (`i18n/client-messages.ts`): `navigation`, `theme` and `cookieConsent` from the layout, plus those of the page's interactive components

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

- **Hero**: visibility promise ("Your business deserves to be seen / found / chosen", the last word cycling), an animated ringed planet behind the text on phones and larger alongside it on desktop, four key facts (starting monthly price, fast reply, one point of contact, area served), the "Go Cosmic" call-to-action leading to the free mockup page and a secondary link to the Pricing page
- **Audience**: who the studio works for (craftspeople, small businesses, independents and liberal professions, associations)
- **Why a studio**: four reasons to choose a studio rather than a site builder
- **Process**: four-step timeline (meeting, mockup, build, launch)
- **Pricing**: the same four pricing columns as the Services page, the subscription leading to the Pricing page
- **Projects**: the first three project cards and a link to the full list
- **Own apps**: the studio's own mobile app, Daily Fortune
- **Studio**: who is behind the studio and the areas served
- **Closing call-to-action**: link to the contact page and to the free mockup, over a star field that accelerates on hover

### Services Page (`/services`)

Replaces the former services and offers pages.

- **Introduction**: what the studio offers, a site that runs and someone who looks after it
- **Pricing columns**: four ways to work together — a monthly subscription (site, hosting and care), day-rate guidance (architecture, UX/UI and design), day-rate reinforcement (technical work on an existing site) and a custom one-off project quoted on request
- **Two plans** (`#simulator`, so older links still land there): "We take care of everything" and "You stay in control" with their starting price, and a button to the Pricing page
- **Trades**: four cards (showcase sites, shops and bookings, apps, visibility and care)
- **FAQ**: accordion answering six common questions (an existing site, ownership, editing the site, time to go live, stopping the subscription, texts and photos)
- **Closing call-to-action**: link to the contact page

### Pricing Page (`/pricing`)

The former pricing page, back as a page of its own under its former slugs (`/fr/tarifs`, `/es/precios`, `/de/preise`, `/it/prezzi`); linked from the footer, the subscription column and the homepage hero, while the header keeps its three entries.

- **Introduction**: build your subscription, the price shows up right away
- **Before we talk budget**: the two free offers (a mockup and a review of the current website), each with its button
- **Subscription simulator** (see [`docs/pricing-simulator.md`](docs/pricing-simulator.md)): a "Help me choose" guided mode that asks one question at a time and ticks the matching options, or leads to the contact page for a need outside the subscription; the two plans as radio cards with their starting price; what each plan includes; the common options (pages, contact form, booking, reviews, English version, news published by the studio, the domain question with the domain and the email address, changes to the pages), then "More options" (forwarding addresses, following your place on Google, visit statistics and detailed statistics, AI-assisted articles, Swiss hosting on the Swiss version), each with an info bubble and a one-year commitment badge where it applies; a sticky recap with the live monthly total and whether the plan commits for 12 months, a bar at the bottom of small screens, and a "Request my free mockup" button that carries the simulation over to the free mockup form
- **Quoted services**: the services quoted outside the subscription with local partners (logo, posters and flyers, photos and videos)

Prices are shown in euros, or in Swiss francs on the Swiss version of the site, with no VAT added, as the studio is not registered for VAT. The homepage, the about page and the page descriptions shown in search results follow the same rule.

### Projects Page (`/projects`)

- **Project grid**: one card per project with its visual, type, year, client, summary, tags and a link to its case study
- **Filters**: "All", "Website", "Web app" and "Mobile app" buttons; the number of matching projects is announced to screen readers
- **Shareable filter**: the active filter is kept in the `?type=` URL parameter (`site`, `webapp` or `mobile`), so a filtered list can be shared
- **Closing call-to-action**: link to the contact page

#### Case Studies

All five case studies share one template: a header with the dates (creation year, and the latest update for projects that keep being updated), client and project type, three numbered sections ("For whom", "What we did", "Result"), a link to the live project (or to the mockup) with a "Discuss a similar project" link to the contact page, and previous / next navigation between case studies.

- **Coach'n Pulse** (`/projects/coachnpulse`): the website of a triathlon and endurance sports coach in Grenoble, looked after since 2016
- **Daily Fortune** (`/projects/daily-fortune`): the studio's own mobile app, published on the App Store
- **PSC Supersprint** (`/projects/psc-supersprint`): live race results for a triathlon club, on the web and on mobile, with its own translation namespace
- **mcomper.at** (`/projects/mcomperat`): a multilingual online résumé
- **Chœur des Pays du Mont Blanc** (`/projects/choeurdespaysdumontblanc`): a website mockup proposed to the choir, with upcoming concerts, repertoire and how to join; it is not the choir's official site

### About Page (`/about`)

- **Background**: Matthieu Compérat's path, the areas served, a link to the story page and to his LinkedIn profile
- **Why a small studio**: four reasons to work with it (being found locally, a visible price, someone who answers, AI used only where it helps)
- **Closing call-to-action**: link to the contact page
- **Structured data**: a JSON-LD `Person` entry for search engines

### Story Page (`/story`)

Matthieu Compérat's path and the studio's milestones as a vertical timeline, from his start as a developer in 2012 and the creation of his first business on 17 October 2016 to the move to Chêne-Bougeries and the Swiss sole proprietorship's affiliation with FER Genève, in progress. Each step shows its date in a mono label; the step in progress carries the orange accent. Linked from the about page's background section, it ends with the same call to write to Matthieu. The steps and their dates live in `data/story.ts`, their copy in `messages/<locale>/story.json`. Search engines get its breadcrumb trail, and the studio's structured data declares the same founding date.

### Service and Audience Pages, in French only

Pages written for people looking for a studio to build their site or app (epic [#142](https://github.com/Mitchnsun/gocosmic/issues/142)), published in French first: they share the `ContentPage` template, with a breadcrumb trail (Home › Services › page, also declared to search engines), an eyebrow, a title and a standfirst, numbered sections, the case studies that back them, two related pages chosen per page (the pricing page only where a price is shown) and a closing call to action. They quote the rest of the site (plans, options, FAQ, case studies) rather than restating it, and the three service pages declare their `Service` to search engines. The audience pages price an example composition with the simulator's current prices (`PlanExample`), and a page that states outside facts lists its sources with the day they were read (`SourceList`). The footer's "Solutions & guides" column, the trade cards and the "Reinforcement" column of the Services page, the audience cards of the homepage and the "See also" block of the case studies link to them on the French version only.

- **Showcase website** (`/fr/creation-site-vitrine`): what such a site shows, what both plans include and their starting price (with a link to the simulator), the useful options, the delays, who owns what, the choir mockup and mcomper.at as examples, and the free mockup offer
- **App development** (`/fr/creation-application`): what the studio builds, on the web or on a phone, how a quoted project is paid and who owns the code, the day-rate guidance, Daily Fortune and PSC Supersprint as examples, and a quote request
- **Website redesign** (`/fr/refonte-site-internet`): the free review and mockup, keeping the site or rebuilding it, what leaving Wix or WordPress means and keeping the old addresses with redirects (sourced and dated), Coach'n Pulse as an example, and a request for the free review
- **Associations and clubs** (`/fr/site-internet-association`): what such a site gathers, the features already offered, an example composition, four questions boards ask, the choir mockup and PSC Supersprint as examples, and the free mockup offer
- **Tradespeople** (`/fr/site-internet-artisan`): what the site says, being found on Google (the Google Maps listing stays with the client), the useful options, an example composition and the steps of the free mockup; no case study yet
- **Freelancers and liberal professions** (`/fr/site-internet-independant`): what the site shows, a note for professions that regulate their communication, starting with one page, the useful options, an example composition, mcomper.at as an example, and the free mockup offer

### Contact Page (`/contact`)

- **Contact details**: general and support email addresses, the area served and the studio's current availability
- **"Write a message" tab**: contact form (name, email, phone, company, type of need, message), sent by email through Resend
- **"Book a call" tab**: Google Calendar booking page for a 20-minute call; since Google sets its own cookies, the calendar only loads once the visitor clicks to show it, and on narrow screens the booking page opens in a new tab instead. The page address comes from `NEXT_PUBLIC_GCAL_BOOKING_URL`; without it, the tab invites visitors to write a message
- **Privacy notice**: link to the privacy policy

### Free Mockup Page (`/free-mockup`)

Lead-capture page where a prospect asks for a free mockup of their future website: email, colour direction (closed list of six), current website URL and a free-text field capped at 500 characters. Submissions go through a server action that validates them with `zod` and emails them via Resend — there is no database. A hidden honeypot field silently drops bot submissions. When the visitor comes from the pricing simulator, their simulation is attached to the request. Entry points: the header button, the homepage hero, and the simulator on the Pricing page.

### Local SEO Page (`/local`)

Locale-specific landing page targeting local searches for website creation (e.g., `/en/website-design-geneva-annecy`, `/fr/creation-site-internet-geneve-annecy`; the former slugs redirect permanently). It opens with a lead that follows the region (Geneva base on the Swiss version, Annecy otherwise) and the facts line of the homepage, then lists the four areas served and the audiences, shows three recent projects and ends with a call to talk about a project, with the free mockup note.

### Legal Pages

- **Privacy policy** (`/privacy`): how personal data is handled, visitors' rights and cookies
- **Legal notice** (`/legal-notice`): publisher, hosting, intellectual property, and the statements on the use of artificial intelligence
- **Terms of sale** (`/terms`): the subscription's duration, options and cancellation terms, linked from the footer

All three share the `LegalDocument` layout: an introduction, then one card per section.

### Not Found Page

Localized 404 page with links back to the homepage and to the contact page. Unknown paths under a locale prefix are routed to it.

### Design System Page (`/design-system`, internal)

Reference of the colour tokens (with their contrast ratios), typography, components, layout rules, voice, illustrations and theme exceptions, shown in the dark theme, the light theme or side by side. Served by `yarn dev` only (open `http://localhost:3000/en/design-system`): production builds leave it out and answer 404. See [`DESIGN_GUIDELINE.md`](DESIGN_GUIDELINE.md).

### Retired Pages

The former `/journey` (3D experience) and `/offers` pages no longer exist. They permanently redirect to Services in every locale, including their former localized slugs: offers to the pricing columns (`#pricing`) and the journey to the top of the page. The pricing page is back under its former slugs; the i18n middleware sends its English slug under another language (`/fr/pricing`) to that language's slug (see `lib/redirects.ts` and `next.config.ts`).

### Files for AI Agents (`/llms.txt`, `/llms-full.txt`)

- **`/llms.txt`**: the site summarised for AI assistants and agents, in the [llmstxt.org](https://llmstxt.org) format: what the studio does, the regional and Swiss versions, the main pages, the case studies, the contact details and a note on how agents may quote the content
- **`/llms-full.txt`**: the text of every page in one file, including what the HTML only shows on interaction (the info bubbles, the second plan, every slider step and its price) and the terms of sale
- Both are in English, except the pages published in French only, given in French at their French URL, and built at deployment from the same messages, project registry and price table as the pages (`lib/llms/`): an edited text, a new project or a new price shows up on its own, but a new page, section or option must be added to `lib/llms/` in the same change (see the [Files for AI agents](CLAUDE.md#files-for-ai-agents) rules in `CLAUDE.md`). The call booking is listed only when `NEXT_PUBLIC_GCAL_BOOKING_URL` is set

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
yarn qa             # Local QA: accessibility audit of every page in both themes (Playwright)
yarn qa --ui        # Same, in Playwright's interactive UI to watch each test run
```

### Adding New Routes

When adding new routes to the application, follow this procedure to maintain internationalization consistency:

1. **Create the route**: Add the new page component in `app/[locale]/your-route/page.tsx`

2. **Configure translated pathnames**: Update `i18n/routing.ts` to add localized route paths (the Swiss versions reuse the slug of their language):

   ```typescript
   pathnames: {
     '/your-route': localized({
       en: '/your-route',
       fr: '/votre-route',
       es: '/tu-ruta',
       de: '/ihre-route',
       it: '/la-tua-route',
     }),
   }
   ```

3. **Add translations**: Include any new translation keys in all locale message files (`messages/`). A page published in some languages only is declared in `ROUTE_LANGUAGES`, under a single slug, and its messages go in a file of those languages only, listed in `PARTIAL_NAMESPACES` (see `CLAUDE.md`)

4. **Update navigation**: If the route needs navigation links, add them to relevant navigation components

5. **List it for AI agents**: add the page to `lib/llms/llms-index.ts` and, for its content, to `lib/llms/llms-full.ts`

6. **Test thoroughly**: Ensure the route works correctly in all locales and verify functionality

This approach ensures SEO-friendly URLs and consistent user experience across all supported languages.

## Technologies Used

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - Latest React with server components
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type safety and robust development
- **[next-intl](https://next-intl.dev/)** - Type-safe internationalization with 5 language support
- **[TailwindCSS 4.x](https://tailwindcss.com/)** - Styling with cosmic design system
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
│   │   ├── about/    # About page (background, why a small studio, LinkedIn)
│   │   ├── story/    # Story page (the founder's path and the studio's milestones)
│   │   ├── contact/  # Contact page (details, message form, call booking)
│   │   ├── free-mockup/ # Free mockup request page
│   │   ├── legal-notice/ # Legal notice (including AI usage statements)
│   │   ├── local/    # Local SEO landing page
│   │   ├── pricing/  # Pricing page (free offers, simulator and guided mode, quoted services)
│   │   ├── privacy/  # Privacy policy
│   │   ├── projects/ # Filterable projects list + case studies (coachnpulse, daily-fortune, psc-supersprint, mcomperat, choeurdespaysdumontblanc)
│   │   ├── services/ # Services page (pricing columns, two plans, trades, FAQ)
│   │   ├── terms/    # Terms of sale
│   │   ├── not-found.tsx # Localized 404 page
│   │   └── page.tsx  # Homepage
│   ├── actions/      # Server actions (contact form, free mockup request)
│   ├── llms.txt/     # `/llms.txt` for AI agents
│   ├── llms-full.txt/ # `/llms-full.txt`, the text of every page for AI agents
│   └── layout.tsx    # Root layout (viewport only; the i18n provider lives in `[locale]/layout.tsx`)
├── components/       # App-specific components
│   ├── AudienceGrid/ # "Who it's for" cards
│   ├── BookingEmbed/ # Google Calendar booking page, loaded on click
│   ├── CaseStudy/    # Case study template
│   ├── ContactDetails/ # Contact lines and availability
│   ├── ContactForm/  # Contact form
│   ├── ContactPanel/ # "Write a message" / "Book a call" tabs
│   ├── CTAFinal/     # Closing call-to-action with star field (warm sun halo in the light theme)
│   ├── DesignSystemShowcase/ # Internal design system reference, dark and light (/design-system, `yarn dev` only)
│   ├── Faq/          # FAQ accordion
│   ├── Footer/       # Site footer
│   ├── FreeMockupForm/ # Free mockup request form
│   ├── Header/       # Site header and navigation
│   ├── HeroSection/  # Homepage hero
│   ├── JsonLd/       # Structured data (JSON-LD)
│   ├── LanguageSwitcher/ # Multilingual navigation component
│   ├── OwnApps/      # The studio's own apps
│   ├── Planet/       # Animated ringed planet behind the homepage hero
│   ├── PricingColumns/ # The four ways to work together (subscription, guidance, reinforcement, custom)
│   ├── PricingGuide/ # "Help me choose": guided mode of the simulator
│   ├── PricingSimulator/ # Subscription simulator with sticky recap
│   ├── ProjectGrid/  # Project cards and type filters
│   ├── Reveal/       # Fade-in on scroll
│   ├── SectionHeading/ # Eyebrow, title and lead opening each section
│   ├── StoryTimeline/ # Vertical timeline of the story page
│   ├── StudioIntro/  # Who is behind the studio
│   ├── Sun/          # The light theme's sun (pure CSS disc and halo)
│   ├── Theme/        # Theme provider (next-themes), toggle and theme hooks
│   ├── WhyStudio/    # Numbered reasons to choose the studio
│   ├── ...           # Other components (ProcessTimeline, ServicesGrid, StatusBar, CookieConsent…)
│   └── icons/        # Reusable SVG icons
├── design-system/    # Reusable UI primitives
│   ├── button.variants.ts # Button styles as CVA variants (primary, ghost, link…)
│   ├── pill.ts       # Pill link styles and shared layout constants
│   ├── eyebrow.tsx   # Mono section label with the orange dot
│   ├── chip.tsx      # Bordered mono tag
│   ├── hairline-grid.tsx # Card grid with 1 px separators
│   ├── field.tsx     # Form field frame and control styles
│   ├── choice-group.tsx # A question with its answers as radio buttons, check boxes or cards
│   ├── slider.tsx    # Slider used by the pricing simulator, with a mark per step
│   ├── tabs.tsx      # Pill tabs (Radix Tabs)
│   ├── info-popover.tsx # "i" button opening a bubble of context on click or tap (Radix Popover)
│   ├── accent.ts     # `accentClasses(token)` — utilities and RGB channels of an accent token
│   └── lib/utils.ts  # `cn` helper (clsx + tailwind-merge)
├── data/             # Static content (`projects.ts` — ordered case-study registry, `story.ts` — milestones of the story page)
├── lib/              # Shared helpers
│   ├── contact/      # Contact form email + validation helpers
│   ├── llms/         # Builders of `/llms.txt` and `/llms-full.txt`
│   ├── pricing/      # Code handover delay (offers.ts), the full price list (price-list.ts) and the simulation passed to the free mockup form
│   ├── hooks/        # Shared hooks (e.g. `usePrefersReducedMotion`)
│   ├── redirects.ts  # Permanent redirects from retired pages to Services
│   ├── region.ts     # Region (France or Switzerland) and currency
│   ├── resend.ts     # Resend email client
│   └── validation/   # Form validation schemas
├── messages/         # Translation files organized by namespace
│   ├── en/           # English translations
│   │   ├── common.json        # Common UI strings (404, meta, language, theme)
│   │   ├── navigation.json    # Header navigation
│   │   ├── footer.json        # Footer content
│   │   ├── home.json          # Homepage content
│   │   ├── about.json         # About page content
│   │   ├── story.json         # Story page content
│   │   ├── services.json      # Services page content
│   │   ├── pricing.json       # Pricing columns, simulator and guided mode
│   │   ├── pricing-page.json  # Pricing page metadata and introduction
│   │   ├── projects.json      # Projects list and case studies
│   │   ├── contact.json       # Contact page content
│   │   ├── free-mockup.json   # Free mockup page content
│   │   ├── local.json         # Local SEO page content
│   │   ├── legal.json         # Privacy policy, legal notice and terms of sale
│   │   └── psc-supersprint.json # PSC Supersprint case study
│   ├── fr/           # French translations (same structure)
│   ├── es/           # Spanish translations (same structure)
│   ├── de/           # German translations (same structure)
│   └── it/           # Italian translations (same structure)
├── i18n/             # Internationalization configuration
│   ├── locales.ts    # Languages, their Swiss variants and URL prefixes
│   ├── routing.ts    # Locale routing setup with translated pathnames
│   ├── swiss-spelling.ts # Swiss German spelling of the messages
│   ├── request.ts    # Server-side i18n configuration
│   ├── navigation.ts # Client-side navigation utilities
│   └── canonical.ts  # Canonical URL helpers
├── __tests__/        # Comprehensive unit tests
│   ├── actions/      # Server action tests
│   ├── components/   # Component tests
│   ├── design-system/ # design-system primitives tests
│   ├── i18n/         # i18n utility tests (canonical, locales, messages)
│   ├── lib/          # Helper tests
│   ├── pages/        # Page tests
│   ├── proxy.test.ts # Middleware/proxy tests
│   └── test-utils.tsx # Custom render with i18n context
├── proxy.ts          # Locale detection and routing middleware
├── public/           # Static assets and icons
└── ...
```

## Documentation

- Documentation policy: [DOCS_POLICY.md](./DOCS_POLICY.md)
- Business glossary FR -> EN: [docs/glossary.md](./docs/glossary.md)
- Main agent guide: [CLAUDE.md](./CLAUDE.md)
- Codex guide: [AGENTS.md](./AGENTS.md)
- UI/code standards: [GUIDELINES.md](./GUIDELINES.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security: [SECURITY.md](./SECURITY.md)

Notes on documentation languages:

- **No mixed languages on a single page**
- **Technical/prompt/DevOps content is canonical English**
- **Onboarding and product presentation are prioritized in French**
- Keep business terms aligned with the glossary
