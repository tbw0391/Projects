'use client';

import { uid, update } from './store';
import type { CostItem, Estimate, LineItem } from './types';

export function createEstimate(): string {
  const id = uid();
  update((d) => {
    const e: Estimate = {
      id,
      number: d.nextEstimateNumber,
      title: 'New estimate',
      customerId: d.customers[0]?.id ?? '',
      status: 'Draft',
      date: new Date().toISOString().slice(0, 10),
      sections: [{ id: uid(), name: 'General', items: [] }],
      taxRatePct: d.company.defaultTaxRatePct,
      discount: 0,
      notes: '',
      terms: d.company.defaultTerms,
    };
    return { ...d, estimates: [e, ...d.estimates], nextEstimateNumber: d.nextEstimateNumber + 1 };
  });
  return id;
}

export function duplicateEstimate(src: Estimate): string {
  const id = uid();
  update((d) => ({
    ...d,
    estimates: [
      {
        ...structuredClone(src),
        id,
        number: d.nextEstimateNumber,
        title: `${src.title} (copy)`,
        status: 'Draft',
        date: new Date().toISOString().slice(0, 10),
      },
      ...d.estimates,
    ],
    nextEstimateNumber: d.nextEstimateNumber + 1,
  }));
  return id;
}

export const lineFromCostItem = (c: CostItem): LineItem => ({
  id: uid(),
  costItemId: c.id,
  name: c.name,
  type: c.type,
  qty: 1,
  unit: c.unit,
  unitCost: c.unitCost,
  markupPct: c.markupPct,
  taxable: c.type === 'Material',
});

export const blankLine = (): LineItem => ({
  id: uid(),
  name: '',
  type: 'Material',
  qty: 1,
  unit: 'EA',
  unitCost: 0,
  markupPct: 25,
  taxable: true,
});

export const STATUS_COLORS: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-700',
  Sent: 'bg-blue-100 text-blue-800',
  Approved: 'bg-green-100 text-green-800',
  Declined: 'bg-red-100 text-red-800',
};
