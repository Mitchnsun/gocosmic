'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useLocale, useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { Field, FIELD_INPUT } from '@/design-system/field';
import { cn } from '@/design-system/lib/utils';

import { ColorPaletteSelect } from './ColorPaletteSelect';
import { useFreeMockupForm } from './FreeMockupForm.hooks';
import { HoneypotField } from './HoneypotField';
import { SubmitFeedback } from './SubmitFeedback';
import { WishesTextarea } from './WishesTextarea';

const EMAIL_ID = 'free-mockup-email';
const WEBSITE_ID = 'free-mockup-website';

/**
 * Free mockup request form: four fields, a honeypot and a server action that
 * emails the request to the studio.
 *
 * Validation runs twice — once in the browser to show localized errors without
 * a round trip, once in the action, which is the authoritative check.
 */
export function FreeMockupForm() {
  const t = useTranslations('freeMockup');
  const locale = useLocale();
  const { values, errors, feedback, planCode, formRef, setValue, markTouched, formAction, isPending } =
    useFreeMockupForm();

  // Both the confirmation and the form visibility read the same status, so the
  // card can never hide the form while showing nothing.
  const isSent = feedback.status === 'success';

  return (
    <div className="border-ghost/8 bg-ghost/2 flex w-full flex-col gap-6 rounded-2xl border p-6 sm:p-8">
      <SubmitFeedback status={feedback.status} hasInvalidFields={feedback.hasInvalidFields} reason={feedback.reason} />

      {!isSent && (
        <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-6">
          <input type="hidden" name="locale" value={locale} />
          {planCode && <input type="hidden" name="plan" value={planCode} />}

          <Field id={EMAIL_ID} label={t('form.email_label')} error={errors.email && t(`validation.${errors.email}`)}>
            <input
              id={EMAIL_ID}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => setValue('email', event.target.value)}
              onBlur={() => markTouched('email')}
              placeholder={t('form.email_placeholder')}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${EMAIL_ID}-error` : undefined}
              className={FIELD_INPUT}
            />
          </Field>

          <ColorPaletteSelect
            value={values.colorPalette}
            onChange={(paletteKey) => setValue('colorPalette', paletteKey)}
            onBlur={() => markTouched('colorPalette')}
            error={errors.colorPalette}
          />

          <Field
            id={WEBSITE_ID}
            label={t('form.website_label')}
            hint={t('form.optional')}
            error={errors.websiteUrl && t(`validation.${errors.websiteUrl}`)}>
            <input
              id={WEBSITE_ID}
              name="websiteUrl"
              type="text"
              inputMode="url"
              autoComplete="url"
              value={values.websiteUrl}
              onChange={(event) => setValue('websiteUrl', event.target.value)}
              onBlur={() => markTouched('websiteUrl')}
              placeholder={t('form.website_placeholder')}
              aria-invalid={errors.websiteUrl ? true : undefined}
              aria-describedby={errors.websiteUrl ? `${WEBSITE_ID}-error` : undefined}
              className={FIELD_INPUT}
            />
          </Field>

          <WishesTextarea
            value={values.wishes}
            onChange={(value) => setValue('wishes', value)}
            onBlur={() => markTouched('wishes')}
            error={errors.wishes}
          />

          <HoneypotField />

          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                buttonVariants({ variant: 'primary', size: 'lg' }),
                'focus-visible:ring-ghost focus-visible:ring-offset-void gap-2 focus-visible:ring-2 focus-visible:ring-offset-2'
              )}>
              {isPending ? t('form.submitting') : t('form.submit')}
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {planCode && <p className="text-ghost/55 text-sm">{t('form.plan_attached')}</p>}
            <p className="text-ghost/35 text-sm">{t('form.reassurance')}</p>
          </div>
        </form>
      )}
    </div>
  );
}
