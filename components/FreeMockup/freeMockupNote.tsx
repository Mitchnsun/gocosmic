import type { ReactNode } from 'react';

import { Link } from '@/i18n/navigation';

/** Translator scoped to the `homepage` messages. */
interface HomepageTranslator {
  rich: (key: string, values: Record<string, (chunks: ReactNode) => ReactNode>) => ReactNode;
}

/** "Still unsure? Start with a free mockup" line under a closing call to action. */
export const freeMockupNote = (t: HomepageTranslator) =>
  t.rich('cta.freeMockup', {
    link: (chunks) => (
      <Link href="/free-mockup" className="text-fg-2 hover:text-fg underline underline-offset-4 transition">
        {chunks}
      </Link>
    ),
  });
