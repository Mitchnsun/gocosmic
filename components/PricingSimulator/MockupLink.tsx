'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';

import { primaryPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { encodePlanCode } from '@/lib/pricing/plan-code';
import { storePlanCode } from '@/lib/pricing/plan-storage';
import type { Region } from '@/lib/region';

import type { PlanSelection } from './PricingSimulator.types';

interface MockupLinkProps {
  /** Normalised plan, carried over to the free mockup form. */
  plan: PlanSelection;
  region: Region;
  children: string;
  className?: string;
}

/** The free mockup request, carrying the simulation along: the plan code is stored before navigating. */
export function MockupLink({ plan, region, children, className }: MockupLinkProps) {
  return (
    <Link
      href="/free-mockup"
      onClick={() =>
        storePlanCode(encodePlanCode({ projectType: 'website', websiteType: 'showcase', selection: plan, region }))
      }
      className={primaryPill(className)}>
      {children}
      <ArrowRightIcon className="size-4" aria-hidden="true" />
    </Link>
  );
}
