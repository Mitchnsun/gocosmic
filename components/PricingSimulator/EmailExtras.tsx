'use client';

import { AddOnOption } from './AddOnOption';
import { MailboxCounter } from './MailboxCounter';
import type { OptionGroupProps } from './PricingSimulator.types';

/** Extra mailboxes and redirects, shown under the email address once it is ticked. */
export function EmailExtras({ plan, actions, surcharge, domain }: OptionGroupProps & { domain: string }) {
  return (
    <div className="border-line space-y-3 border-t p-4">
      <MailboxCounter value={plan.mailboxes} onChange={actions.setMailboxes} surcharge={surcharge} domain={domain} />
      <AddOnOption
        id="redirects"
        checked={plan.addOns.redirects}
        onToggle={actions.toggleAddOn}
        surcharge={surcharge}
        values={{ domain }}
        infoKey="email_extras.info"
        nested
      />
    </div>
  );
}
