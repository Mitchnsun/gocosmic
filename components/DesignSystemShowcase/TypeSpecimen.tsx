import { type ReactNode, useRef } from 'react';

import { useComputedType } from './DesignSystemShowcase.hooks';

interface TypeSpecimenProps {
  label: string;
  /** Expected spec, from DESIGN_GUIDELINE.md §2.2. */
  spec: string;
  /** Element measured inside the sample, e.g. `h1`. */
  measure: string;
  children: ReactNode;
}

/** One typography row: the expected spec and the computed one in mono, the rendered sample beside. */
export function TypeSpecimen({ label, spec, measure, children }: TypeSpecimenProps) {
  const sampleRef = useRef<HTMLDivElement>(null);
  const computed = useComputedType(sampleRef, measure);

  return (
    <li className="bg-bg flex flex-col gap-4 p-5">
      <div className="text-2xs flex flex-col gap-1.5 font-mono">
        <span className="text-fg tracking-[0.16em] uppercase">{label}</span>
        <span className="text-fg-2">{spec}</span>
        <span className="text-fg-3">computed: {computed ?? '…'}</span>
      </div>
      <div ref={sampleRef} className="min-w-0">
        {children}
      </div>
    </li>
  );
}
