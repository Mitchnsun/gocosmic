'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/tabs';

import { FORMULAS } from './constants';
import type { Formula } from './PricingSimulator.types';

const isFormula = (value: string): value is Formula => (FORMULAS as readonly string[]).includes(value);

interface FormulaTabsProps {
  formula: Formula;
  onFormulaChange: (formula: Formula) => void;
  /** Builder of the active formula; only the active panel is mounted. */
  children: ReactNode;
}

/** The two formulas as tabs, each panel opening on a one-line summary of how it works. */
export function FormulaTabs({ formula, onFormulaChange, children }: FormulaTabsProps) {
  const t = useTranslations('pricing.builder.formulas');

  return (
    <Tabs value={formula} onValueChange={(value) => isFormula(value) && onFormulaChange(value)} className="space-y-4">
      <TabsList aria-label={t('label')}>
        {FORMULAS.map((key) => (
          <TabsTrigger key={key} value={key}>
            {t(`${key}.label`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {FORMULAS.map((key) => (
        <TabsContent key={key} value={key} className="space-y-6">
          <p className="text-fg-2 text-base">{t(`${key}.lead`)}</p>
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
