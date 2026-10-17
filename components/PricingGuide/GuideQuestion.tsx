'use client';

import { GlobeAltIcon, ShoppingBagIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { ChoiceGroup } from '@/components/PricingSimulator/ChoiceGroup';
import { NEWS_TIERS, PAGE_TIERS, UPDATE_TIERS } from '@/components/PricingSimulator/constants';

import type { ContactChannel, GuideAnswers, GuideStep, Situation } from './PricingGuide.types';

/** The questions with a single answer, and the values that answer can take. */
type RadioKey = Exclude<keyof GuideAnswers, 'contact'>;
type Answer<K extends RadioKey> = NonNullable<GuideAnswers[K]>;

interface GuideQuestionProps {
  step: GuideStep;
  answers: GuideAnswers;
  onAnswer: (patch: Partial<GuideAnswers>) => void;
  /** Example domain of the version, e.g. `my-business.com`. */
  domain: string;
}

const SITUATIONS = [
  ['new', SparklesIcon],
  ['existing', GlobeAltIcon],
  ['custom', ShoppingBagIcon],
] as const;

/** The guide's question for one step, alone on screen. */
export function GuideQuestion({ step, answers, onAnswer, domain }: GuideQuestionProps) {
  const t = useTranslations('pricing');
  const radio = <K extends RadioKey>(
    key: K,
    prefix: string,
    values: readonly Answer<K>[],
    extra: { legend?: string; help?: string } = {}
  ) => (
    <ChoiceGroup<Answer<K>>
      legend={extra.legend ?? t(`${prefix}.legend`)}
      help={extra.help}
      type="radio"
      choices={values.map((value) => ({ value, label: t(`${prefix}.${value as string}`) }))}
      selected={values.filter((value) => value === answers[key])}
      onChange={(value) => onAnswer({ [key]: value })}
    />
  );

  switch (step) {
    case 'situation':
      return (
        <ChoiceGroup<Situation>
          legend={t('guide.situation.legend')}
          type="radio"
          cards
          choices={SITUATIONS.map(([value, icon]) => ({ value, label: t(`guide.situation.${value}`), icon }))}
          selected={answers.situation ? [answers.situation] : []}
          onChange={(situation) => onAnswer({ situation })}
        />
      );
    case 'existing':
      return radio('existingPlan', 'guide.existing', ['redo', 'keep'] as const);
    case 'editor':
      return radio('editor', 'guide.editor', ['studio', 'self'] as const);
    case 'domain':
      return radio('ownDomain', 'builder.domain_question', ['no', 'yes'] as const, {
        help: t('builder.domain_question.help', { domain }),
      });
    case 'pages':
      return radio('pages', 'guide.pages', [...PAGE_TIERS.map((tier) => tier.key), 'unsure'] as const, {
        help: t('guide.pages.help'),
      });
    case 'email':
      return radio('email', 'guide.email', ['yes', 'team', 'no'] as const, {
        legend: t('guide.email.legend', { domain }),
      });
    case 'news':
      return radio('news', 'guide.news', ['none', ...NEWS_TIERS.map((tier) => tier.key)] as const);
    case 'updates':
      return radio('updates', 'guide.updates', ['yearly', ...UPDATE_TIERS.map((tier) => tier.key)] as const);
    case 'contact':
      return (
        <ChoiceGroup<ContactChannel>
          legend={t('guide.contact.legend')}
          type="checkbox"
          choices={(['email', 'form', 'booking'] as const).map((value) => ({
            value,
            label: t(`guide.contact.${value}`),
          }))}
          selected={answers.contact}
          onChange={(channel) =>
            onAnswer({
              contact: answers.contact.includes(channel)
                ? answers.contact.filter((value) => value !== channel)
                : [...answers.contact, channel],
            })
          }
        />
      );
  }
}
