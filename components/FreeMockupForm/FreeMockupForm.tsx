'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useLocale, useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { hasFieldErrors } from '@/lib/validation/free-mockup.schema';

import { ColorPaletteSelect } from './ColorPaletteSelect';
import { FormField } from './FormField';
import { useFreeMockupForm } from './FreeMockupForm.hooks';
import { HoneypotField } from './HoneypotField';
import { SubmitFeedback } from './SubmitFeedback';
import { WishesTextarea } from './WishesTextarea';

const EMAIL_ID = 'free-mockup-email';
const WEBSITE_ID = 'free-mockup-website';

const INPUT_CLASSES =
  'border-ghost/8 bg-ghost/[0.02] text-ghost placeholder:text-ghost/25 focus-visible:border-aerospace/40 focus-visible:ring-aerospace min-h-11 w-full rounded-xl border px-3 py-2.5 text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none';

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
  const { values, errors, setValue, markTouched, state, formAction, isPending } = useFreeMockupForm();

  const isSent = state.status === 'success';

  return (
    <div className="border-ghost/8 bg-ghost/[0.02] flex w-full flex-col gap-6 rounded-2xl border p-6 sm:p-8">
      <SubmitFeedback status={state.status} hasInvalidFields={hasFieldErrors(errors)} />

      {!isSent && (
        <form action={formAction} noValidate className="flex flex-col gap-6">
          <input type="hidden" name="locale" value={locale} />

          <FormField
            id={EMAIL_ID}
            label={t('form.email_label')}
            error={errors.email && t(`validation.${errors.email}`)}>
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
              className={INPUT_CLASSES}
            />
          </FormField>

          <ColorPaletteSelect
            value={values.colorPalette}
            onChange={(paletteKey) => setValue('colorPalette', paletteKey)}
            onBlur={() => markTouched('colorPalette')}
            error={errors.colorPalette}
          />

          <FormField
            id={WEBSITE_ID}
            label={t('form.website_label')}
            hint={t('form.optional')}
            error={errors.websiteUrl && t(`validation.${errors.websiteUrl}`)}>
            <input
              id={WEBSITE_ID}
              name="websiteUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              value={values.websiteUrl}
              onChange={(event) => setValue('websiteUrl', event.target.value)}
              onBlur={() => markTouched('websiteUrl')}
              placeholder={t('form.website_placeholder')}
              aria-invalid={errors.websiteUrl ? true : undefined}
              aria-describedby={errors.websiteUrl ? `${WEBSITE_ID}-error` : undefined}
              className={INPUT_CLASSES}
            />
          </FormField>

          <WishesTextarea
            value={values.wishes}
            onChange={(value) => setValue('wishes', value)}
            onBlur={() => markTouched('wishes')}
            error={errors.wishes}
          />

          <HoneypotField />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                buttonVariants({ variant: 'aerospace', size: 'lg' }),
                'focus-visible:ring-ghost focus-visible:ring-offset-void gap-2 focus-visible:ring-2 focus-visible:ring-offset-2'
              )}>
              {isPending ? t('form.submitting') : t('form.submit')}
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="text-ghost/35 text-sm">{t('form.reassurance')}</p>
          </div>
        </form>
      )}
    </div>
  );
}
