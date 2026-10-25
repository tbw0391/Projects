import type { CostItem, LineItem } from './types';

export const lineFromCostItem = (c: CostItem): LineItem => ({
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
