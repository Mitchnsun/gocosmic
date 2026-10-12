import { CONTAINER, PAGE_TOP, SECTION_Y } from '@/design-system/pill';

import { LAYOUT_RULES } from './DesignSystemShowcase.copy';
import { RuleCards } from './RuleCards';

/** Layout rules, with the live values of the shared container, section rhythm and page top. */
export function LayoutRules() {
  return (
    <>
      <RuleCards cards={LAYOUT_RULES} />
      <dl className="text-2xs grid gap-2 font-mono">
        <div className="flex flex-wrap gap-x-3">
          <dt className="text-fg-3">CONTAINER</dt>
          <dd className="text-fg-2">{CONTAINER}</dd>
        </div>
        <div className="flex flex-wrap gap-x-3">
          <dt className="text-fg-3">SECTION_Y</dt>
          <dd className="text-fg-2">{SECTION_Y}</dd>
        </div>
        <div className="flex flex-wrap gap-x-3">
          <dt className="text-fg-3">PAGE_TOP</dt>
          <dd className="text-fg-2">{PAGE_TOP}</dd>
        </div>
      </dl>
    </>
  );
}
