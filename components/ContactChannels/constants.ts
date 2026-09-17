import type { AccentToken } from '@/design-system/accent';

/** A direct email channel offered on the contact page. */
export interface ContactChannelDefinition {
  /** Translation key inside `contact.blocks`. */
  id: 'general' | 'support' | 'technical' | 'commercial';
  /** Accent colour for the card. */
  accent: AccentToken;
  /** Ordered reason keys rendered as bullet points. */
  reasons: string[];
}

export const CONTACT_CHANNELS: ContactChannelDefinition[] = [
  {
    id: 'general',
    accent: 'aerospace',
    reasons: ['generalQuestion', 'partnership', 'feedback', 'suggestions', 'mission'],
  },
  { id: 'support', accent: 'jungle', reasons: ['help', 'bugs', 'access', 'technical', 'troubleshooting'] },
  { id: 'technical', accent: 'royal', reasons: ['architecture', 'documentation', 'evolution', 'collaboration', 'api'] },
  { id: 'commercial', accent: 'ghost', reasons: ['quote', 'pricing', 'demo', 'meeting', 'purchase'] },
];
