'use client';

import { useTranslations } from 'next-intl';

import { AddOnOption } from './AddOnOption';
import { ChoiceGroup } from './ChoiceGroup';
import { MailboxCounter } from './MailboxCounter';
import { OptionGroup } from './OptionGroup';
import type { Cascade } from './PricingSimulator.rules';
import type { OptionGroupProps } from './PricingSimulator.types';

type DomainAnswer = 'no' | 'yes';

/**
 * "Your address on the web": whether the visitor already has a domain name, then, without one, the
 * domain the studio manages (locked: it is part of the plan) and the email address with its extra
 * mailboxes. With one, a note offers help on a quote instead.
 */
export function AddressOptions({
  plan,
  actions,
  surcharge,
  domain,
  cascade,
}: OptionGroupProps & { domain: string; cascade: Cascade | null }) {
  const t = useTranslations('pricing.builder');
  const values = { domain };
  const answer: DomainAnswer[] = plan.ownDomain === null ? [] : [plan.ownDomain ? 'yes' : 'no'];

  return (
    <OptionGroup title={t('groups.address')}>
      <div className="border-line bg-surface rounded-xl border p-4">
        <ChoiceGroup<DomainAnswer>
          legend={t('domain_question.legend')}
          help={t('domain_question.help', values)}
          type="radio"
          choices={[
            { value: 'no', label: t('domain_question.no') },
            { value: 'yes', label: t('domain_question.yes') },
          ]}
          selected={answer}
          onChange={(value) => actions.setOwnDomain(value === 'yes')}
        />
        {/* Always rendered, even empty, so screen readers announce the note when it appears. */}
        <p aria-live="polite" className="text-fg-2 text-sm">
          {plan.ownDomain === true && <span className="mt-3 block">{t('domain_question.own_note')}</span>}
        </p>
      </div>
      {plan.ownDomain === false && (
        <>
          <AddOnOption
            id="domain"
            checked={plan.addOns.domain}
            onToggle={actions.toggleAddOn}
            surcharge={surcharge}
            values={values}
            disabled
          />
          <AddOnOption
            id="email"
            checked={plan.addOns.email}
            onToggle={actions.toggleAddOn}
            surcharge={surcharge}
            values={values}
            note={cascade === 'email_extras' ? t('cascades.email_extras') : undefined}>
            {plan.addOns.email && (
              <div className="border-line border-t p-4">
                <MailboxCounter
                  value={plan.mailboxes}
                  onChange={actions.setMailboxes}
                  surcharge={surcharge}
                  domain={domain}
                />
              </div>
            )}
          </AddOnOption>
        </>
      )}
    </OptionGroup>
  );
}
