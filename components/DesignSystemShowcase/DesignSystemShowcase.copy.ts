import type { ThemeFace } from '@/design-system/tokens';

import type { RuleCard, ShowcaseMode, ShowcaseSection } from './DesignSystemShowcase.types';

/** Panel titles of the two faces of the site (DESIGN_GUIDELINE.md §1). */
export const THEME_LABELS: Record<ThemeFace, string> = { dark: 'Dark · space', light: 'Light · star' };

export const MODES: readonly { mode: ShowcaseMode; label: string }[] = [
  { mode: 'dark', label: 'Dark' },
  { mode: 'light', label: 'Light' },
  { mode: 'both', label: 'Side by side' },
];

export const SECTIONS: readonly ShowcaseSection[] = [
  {
    id: 'colors',
    title: 'Colors',
    lead: 'Semantic tokens, with each value in the theme and its WCAG ratio against the background it is read on: AA from 4.5:1, large text only from 3:1.',
  },
  {
    id: 'typography',
    title: 'Typography',
    lead: 'The expected spec, the value the browser actually computes, then the rendered style.',
  },
  {
    id: 'components',
    title: 'Components',
    lead: 'The real primitives, imported from the design system. One primary action per screen; no illustrative icons, no emoji.',
  },
  {
    id: 'layout',
    title: 'Layout & responsive',
    lead: 'Container, grids and rhythm shared by every page.',
  },
  {
    id: 'voice',
    title: 'Voice & cosmic universe',
    lead: 'The space theme, one notch down: keep the universe, never at the expense of clarity.',
  },
  {
    id: 'illustrations',
    title: 'Illustrations',
    lead: 'Stars and a glow in the dark theme, the sun in the light theme. Homepage hero, final call to action and case study heroes only.',
  },
  {
    id: 'exceptions',
    title: 'Theme exceptions',
    lead: 'What does not follow the theme, and why.',
  },
];

/** Sample texts of the component gallery. */
export const SAMPLE = {
  primary: 'Primary action',
  secondary: 'Secondary action',
  link: 'Text link',
  neutral: 'Neutral',
  eyebrow: '[ Section label ]',
  chip: 'Tag',
  chipOk: 'Included',
  available: 'Available',
  nameLabel: 'Your name',
  namePlaceholder: 'Camille Durand',
  emailLabel: 'Email address',
  emailError: 'Please enter a valid email address.',
  optional: 'Optional',
  checkbox: 'Add a monthly option',
  slider: 'Number of pages',
  tabsLabel: 'Plan',
  tabManaged: 'We take care of everything',
  tabSelfService: 'You stay in control',
  panelManaged: 'You email us your changes, we put them online.',
  panelSelfService: 'You publish your news and opening hours yourself.',
  infoOption: 'Contact form',
  infoBody: 'Your visitors write to you from your site, and each message lands in your inbox.',
  cell: 'Cell',
} as const;

export const TYPE_SPECS = {
  h1: 'Space Grotesk 600 · clamp(36px, 6vw, 80px) · lh 0.98 · ls −0.035em · <em> 300 fg-2',
  h2: 'Space Grotesk 600 · clamp(30px, 4.2vw, 56px) · lh 1 · ls −0.03em',
  h3: 'Space Grotesk 600 · 20px · ls −0.02em',
  body: 'Inter 400 · 16–18px · lh 1.625 · never below 14px',
  eyebrow: 'Space Mono 400 · 11px · uppercase · ls 0.22em · orange dot',
} as const;

export const LAYOUT_RULES: readonly RuleCard[] = [
  {
    title: 'Container',
    items: [
      '1280 px max, fluid gutters 16 → 32 px',
      'Sections 56 → 96 px top and bottom',
      'Page top 40 → 48 px under the header',
      'Hero padding under 150 px',
    ],
  },
  {
    title: 'Grids',
    items: [
      'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
      'One column under ~640 px without a dedicated media query',
      'Hairline grids: explicit columns, no empty last cell',
    ],
  },
  {
    title: 'Mobile',
    items: [
      'Header 64 px, full-screen menu below 1024 px',
      'Primary action always in view',
      'clamp() on titles, never nowrap on running text',
    ],
  },
  {
    title: 'Rhythm',
    items: [
      'Eyebrow → title with emphasis → 56ch lead → content',
      'At most one alternate section in three',
      'One immersive section per page at most',
    ],
  },
];

export const VOICE: Record<'keep' | 'stop' | 'tone', RuleCard> = {
  keep: {
    title: 'Keep',
    items: [
      '“Go Cosmic” as the call-to-action signature, with an explicit action in view',
      'Mono HUD details: status bar, Geneva coordinates, countdown labels',
      'Green signal dot for “available”',
      'One space metaphor per page, tied to being seen',
    ],
  },
  stop: {
    title: 'Stop',
    items: [
      'Stellar, mystical or cosmic in service names',
      'Superlatives: breathtaking, excellence, stratosphere',
      'Technology lists and acronyms in client-facing copy',
      'Emoji, coloured illustrative icons, cards with a left border bar',
    ],
  },
  tone: {
    title: 'Tone',
    items: [
      'Talk to the reader directly, in short sentences and everyday words',
      'Concrete: real trades as examples, visible prices, honest delays',
      'One final action per page: talk to Matthieu',
    ],
  },
};

/** The immersive moment of each face, added to the “Keep” card. */
export const IMMERSIVE: Record<ThemeFace, string> = {
  dark: 'Discreet stars in the hero and the final call to action, one immersive section per page',
  light:
    'The sun in the hero, a warm halo on the final call to action, a sunrise on case study heroes, never two suns on a page',
};

export const EXCEPTIONS = {
  button: {
    title: 'Orange button',
    reason: 'Void label and orange glow in both themes: white on orange only reaches 3.3:1.',
  },
  embed: { title: 'Booking frame', reason: 'Google’s calendar has no dark mode, so its frame stays white.' },
  covers: {
    title: 'Project covers',
    reason: 'Brand backgrounds: Daily Fortune’s deep purple, space blue behind the white CPMB logo.',
  },
  island: {
    title: 'Dark islands',
    reason: 'Case study heroes with a project image stay dark in both themes through data-theme="dark".',
  },
} as const;
