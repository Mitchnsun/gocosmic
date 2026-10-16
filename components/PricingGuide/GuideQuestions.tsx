'use client';

import { useTranslations } from 'next-intl';

import { ChoiceGroup } from '@/components/PricingSimulator/ChoiceGroup';
import { NEWS_TIERS, PAGE_TIERS, UPDATE_TIERS } from '@/components/PricingSimulator/constants';

import type {
  ContactChannel,
  DomainAnswer,
  Editor,
  EmailAnswer,
  GuideAnswers,
  NewsAnswer,
  PagesAnswer,
  UpdatesAnswer,
} from './PricingGuide.types';

interface GuideQuestionsProps {
  answers: GuideAnswers;
  onAnswer: (patch: Partial<GuideAnswers>) => void;
  /** Example domain of the version, e.g. `my-business.com`. */
  domain: string;
}

const one = <V extends string>(value: V | null): V[] => (value === null ? [] : [value]);

/**
 * The questions that compose a plan, once the visitor has a site to create or to redo. The email
 * question only shows without a domain name of one's own, the news question only when the studio
 * makes the changes.
 */
export function GuideQuestions({ answers, onAnswer, domain }: GuideQuestionsProps) {
  const t = useTranslations('pricing');
  const choices = <V extends string>(prefix: string, values: readonly V[]) =>
    values.map((value) => ({ value, label: t(`${prefix}.${value as string}`) }));
  const toggleContact = (channel: ContactChannel) =>
    onAnswer({
      contact: answers.contact.includes(channel)
        ? answers.contact.filter((value) => value !== channel)
        : [...answers.contact, channel],
    });

  return (
    <>
      <ChoiceGroup<Editor>
        legend={t('guide.editor.legend')}
        type="radio"
        choices={choices('guide.editor', ['studio', 'self'] as const)}
        selected={one(answers.editor)}
        onChange={(editor) => onAnswer({ editor })}
      />
      <ChoiceGroup<DomainAnswer>
        legend={t('builder.domain_question.legend')}
        help={t('builder.domain_question.help', { domain })}
        type="radio"
        choices={choices('builder.domain_question', ['no', 'yes'] as const)}
        selected={one(answers.ownDomain)}
        onChange={(ownDomain) => onAnswer({ ownDomain })}
      />
      <ChoiceGroup<PagesAnswer>
        legend={t('guide.pages.legend')}
        help={t('guide.pages.help')}
        type="radio"
        choices={choices('guide.pages', [...PAGE_TIERS.map((tier) => tier.key), 'unsure'] as const)}
        selected={one(answers.pages)}
        onChange={(pages) => onAnswer({ pages })}
      />
      <ChoiceGroup<ContactChannel>
        legend={t('guide.contact.legend')}
        type="checkbox"
        choices={choices('guide.contact', ['email', 'form', 'booking'] as const)}
        selected={answers.contact}
        onChange={toggleContact}
      />
      {answers.ownDomain === 'no' && (
        <ChoiceGroup<EmailAnswer>
          legend={t('guide.email.legend', { domain })}
          type="radio"
          choices={choices('guide.email', ['yes', 'team', 'no'] as const)}
          selected={one(answers.email)}
          onChange={(email) => onAnswer({ email })}
        />
      )}
      {answers.editor !== 'self' && (
        <ChoiceGroup<NewsAnswer>
          legend={t('guide.news.legend')}
          type="radio"
          choices={choices('guide.news', ['none', ...NEWS_TIERS.map((tier) => tier.key)] as const)}
          selected={one(answers.news)}
          onChange={(news) => onAnswer({ news })}
        />
      )}
      <ChoiceGroup<UpdatesAnswer>
        legend={t('guide.updates.legend')}
        type="radio"
        choices={choices('guide.updates', ['yearly', ...UPDATE_TIERS.map((tier) => tier.key)] as const)}
        selected={one(answers.updates)}
        onChange={(updates) => onAnswer({ updates })}
      />
    </>
  );
}
