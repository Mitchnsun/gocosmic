import type { AccentToken } from '@/design-system/accent';

/** Static description of one service block on the services page.
 *  Only translation key fragments live here — the copy itself comes from the
 *  `services` namespace. */
export interface ServiceDetailDefinition {
  /** Anchor id used by the homepage services grid links. */
  anchor: string;
  /** Translation key prefix inside the `services` namespace. */
  key: string;
  /** Accent colour for the block. */
  accent: AccentToken;
  /** Bullet groups: translation sub-key plus the ordered item keys. */
  groups: { key: string; items: string[] }[];
}

export const SERVICE_DETAIL_DEFINITIONS: ServiceDetailDefinition[] = [
  {
    anchor: 'development',
    key: 'stellar_development',
    accent: 'jungle',
    groups: [
      { key: 'technologies', items: ['frontend', 'architecture', 'quality', 'performance'] },
      { key: 'expertise', items: ['workflow', 'scalability', 'security', 'apis'] },
      { key: 'features', items: ['quality', 'performance', 'maintainability', 'reliability'] },
    ],
  },
  {
    anchor: 'design',
    key: 'mystical_design',
    accent: 'royal',
    groups: [
      { key: 'approach', items: ['systems', 'accessibility', 'responsive', 'performance'] },
      { key: 'tools', items: ['components', 'styling', 'testing', 'prototyping'] },
      { key: 'outcomes', items: ['engagement', 'conversion', 'brand', 'satisfaction'] },
    ],
  },
  {
    anchor: 'ai',
    key: 'ai_powered',
    accent: 'aerospace',
    groups: [
      { key: 'capabilities', items: ['recommendations', 'automation', 'analytics', 'nlp'] },
      { key: 'implementation', items: ['apis', 'privacy', 'scalability', 'monitoring'] },
      { key: 'use_cases', items: ['personalization', 'support', 'optimization', 'insights'] },
    ],
  },
  {
    anchor: 'launch',
    key: 'cosmic_launch',
    accent: 'ghost',
    groups: [
      { key: 'process', items: ['testing', 'staging', 'deployment', 'monitoring'] },
      { key: 'infrastructure', items: ['cloud', 'cicd', 'security', 'scaling'] },
      { key: 'support', items: ['monitoring', 'optimization', 'updates', 'consultation'] },
    ],
  },
];
