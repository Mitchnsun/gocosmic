import { CHECKBOX_CONTROL, Field, FIELD_INPUT } from '@/design-system/field';
import { cn } from '@/design-system/lib/utils';
import { Slider } from '@/design-system/slider';

import { SAMPLE } from './DesignSystemShowcase.copy';

/** Field states (rest, error), the restyled checkbox and the slider. `idPrefix` keeps ids unique per panel. */
export function FormGallery({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${idPrefix}-name`} label={SAMPLE.nameLabel} hint={SAMPLE.optional}>
          <input id={`${idPrefix}-name`} className={FIELD_INPUT} placeholder={SAMPLE.namePlaceholder} />
        </Field>
        <Field id={`${idPrefix}-email`} label={SAMPLE.emailLabel} required error={SAMPLE.emailError}>
          <input
            id={`${idPrefix}-email`}
            type="email"
            className={FIELD_INPUT}
            aria-invalid="true"
            aria-describedby={`${idPrefix}-email-error`}
            defaultValue="camille@"
          />
        </Field>
      </div>
      <label className="text-fg flex cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" className={CHECKBOX_CONTROL} defaultChecked />
        {SAMPLE.checkbox}
      </label>
      <div className="flex flex-col gap-3">
        <p id={`${idPrefix}-slider`} className={cn('text-fg-3 text-2xs font-mono tracking-[0.16em] uppercase')}>
          {SAMPLE.slider}
        </p>
        <Slider defaultValue={[2]} min={1} max={5} step={1} aria-labelledby={`${idPrefix}-slider`} />
      </div>
    </div>
  );
}
