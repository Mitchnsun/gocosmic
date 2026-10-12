import type { ThemeFace } from '@/design-system/tokens';

import { IMMERSIVE, VOICE } from './DesignSystemShowcase.copy';
import { RuleCards } from './RuleCards';

/** Keep / stop / tone cards; the immersive moment differs per theme (stars or sun). */
export function VoiceRules({ theme }: { theme: ThemeFace }) {
  const immersive = IMMERSIVE[theme];

  return (
    <RuleCards
      cards={[
        { ...VOICE.keep, items: [...VOICE.keep.items, immersive], className: 'border-ok/35' },
        { ...VOICE.stop, className: 'border-aerospace/35' },
        VOICE.tone,
      ]}
    />
  );
}
