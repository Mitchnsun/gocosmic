'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { CONTACT_LIMITS } from '@/lib/contact/validation';

import { useContactForm } from './ContactForm.hooks';
import type { ContactFormProps } from './ContactForm.types';
import { ContactFormSuccess } from './ContactFormSuccess';
import { FormField } from './FormField';

/**
 * Contact form with client-side validation, a honeypot field, client and
 * server rate limiting, and an animated confirmation panel on success.
 *
 * Copy comes from the `contact.form` namespace; the payload is delivered
 * through the `submitContactMessage` Server Action.
 *
 * @component
 */
export const ContactForm = ({ variant = 'page', onSuccess, className, id = 'contact-form' }: ContactFormProps) => {
  const t = useTranslations('contact.form');
  const { values, errors, status, formError, invalidFocus, handleChange, handleSubmit, reset } = useContactForm({
    onSuccess,
  });

  // Move focus to the first invalid field so screen-reader and keyboard users
  // hear why the submission did not go through.
  useEffect(() => {
    if (!invalidFocus) return;
    document.getElementById(invalidFocus.field)?.focus();
  }, [invalidFocus]);

  // Fields freeze during the flight: an edit made meanwhile would be dropped
  // by the confirmation while the sent message still carried the old text.
  const isSending = status === 'submitting';

  const wrapperClassName = cn(
    'w-full',
    { 'border-ghost/8 bg-ghost/[0.02] rounded-2xl border p-6 sm:p-8 lg:p-10': variant === 'page' },
    className
  );

  if (status === 'success') {
    return (
      <div id={id} className={wrapperClassName}>
        <ContactFormSuccess
          title={t('success.title')}
          description={t('success.description')}
          backLabel={t('success.back')}
          onBack={reset}
        />
      </div>
    );
  }

  return (
    <div id={id} className={wrapperClassName}>
      <form noValidate onSubmit={handleSubmit} aria-describedby={`${id}-required-hint`} className="flex flex-col gap-6">
        <p id={`${id}-required-hint`} className="text-ghost/35 text-2xs font-mono tracking-[0.2em] uppercase">
          {t('required_hint')}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            name="name"
            label={t('fields.name.label')}
            placeholder={t('fields.name.placeholder')}
            value={values.name}
            onChange={handleChange}
            error={errors.name ? t(`errors.${errors.name}`) : undefined}
            maxLength={CONTACT_LIMITS.name.max}
            disabled={isSending}
            autoComplete="name"
            required
          />
          <FormField
            name="email"
            type="email"
            label={t('fields.email.label')}
            placeholder={t('fields.email.placeholder')}
            value={values.email}
            onChange={handleChange}
            error={errors.email ? t(`errors.${errors.email}`) : undefined}
            maxLength={CONTACT_LIMITS.email.max}
            disabled={isSending}
            autoComplete="email"
            required
          />
        </div>

        <FormField
          name="subject"
          label={`${t('fields.subject.label')} — ${t('optional')}`}
          placeholder={t('fields.subject.placeholder')}
          value={values.subject}
          onChange={handleChange}
          error={errors.subject ? t(`errors.${errors.subject}`) : undefined}
          maxLength={CONTACT_LIMITS.subject.max}
          disabled={isSending}
        />

        <FormField
          name="message"
          multiline
          label={t('fields.message.label')}
          placeholder={t('fields.message.placeholder')}
          value={values.message}
          onChange={handleChange}
          error={errors.message ? t(`errors.${errors.message}`) : undefined}
          maxLength={CONTACT_LIMITS.message.max}
          disabled={isSending}
          required
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            name="phone"
            type="tel"
            label={`${t('fields.phone.label')} — ${t('optional')}`}
            placeholder={t('fields.phone.placeholder')}
            value={values.phone}
            onChange={handleChange}
            error={errors.phone ? t(`errors.${errors.phone}`) : undefined}
            maxLength={CONTACT_LIMITS.phone.max}
            disabled={isSending}
            autoComplete="tel"
          />
          <FormField
            name="company"
            label={`${t('fields.company.label')} — ${t('optional')}`}
            placeholder={t('fields.company.placeholder')}
            value={values.company}
            onChange={handleChange}
            error={errors.company ? t(`errors.${errors.company}`) : undefined}
            maxLength={CONTACT_LIMITS.company.max}
            disabled={isSending}
            autoComplete="organization"
          />
        </div>

        {/* Anti-spam honeypot — hidden from humans and assistive technology. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">{t('honeypot_label')}</label>
          <input
            id="honeypot"
            name="honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.honeypot}
            onChange={handleChange}
          />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-red-400">
            {t(`errors.${formError}`)}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSending}
            className={cn(
              buttonVariants({ variant: 'aerospace' }),
              'focus-visible:ring-ghost focus-visible:ring-offset-void w-fit gap-2 py-3 transition-transform duration-300 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:scale-100! motion-reduce:transition-none!'
            )}>
            {isSending ? t('submitting') : t('submit')}
            <PaperAirplaneIcon className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={isSending}
            className="text-ghost/55 hover:text-ghost focus-visible:ring-ghost font-display w-fit cursor-pointer rounded-full px-4 py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            {t('clear')}
          </button>
        </div>
      </form>
    </div>
  );
};
