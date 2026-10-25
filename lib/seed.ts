import type { CostItem, DB } from './types';

let n = 0;
const ci = (
  category: string,
  name: string,
  type: CostItem['type'],
  unit: string,
  unitCost: number,
  markupPct = 25,
): CostItem => ({ id: `seed-${++n}`, category, name, type, unit, unitCost, markupPct });

// Starter remodeling price book. Numbers are placeholders; edit them in the
// Cost Items Database to match your market.
export const SEED_COST_ITEMS: CostItem[] = [
  ci('Demo', 'Demo labor', 'Labor', 'HR', 45),
  ci('Demo', 'Dumpster 20yd', 'Equipment', 'EA', 450, 15),
  ci('Framing', 'Framing labor', 'Labor', 'HR', 55),
  ci('Framing', '2x4x8 stud', 'Material', 'EA', 4.25),
  ci('Drywall', 'Drywall hang & finish', 'Subcontractor', 'SF', 2.1, 20),
  ci('Drywall', '1/2" drywall sheet 4x8', 'Material', 'EA', 16),
  ci('Plumbing', 'Plumbing rough-in', 'Subcontractor', 'LS', 2800, 20),
  ci('Plumbing', 'Toilet install', 'Labor', 'EA', 225),
  ci('Electrical', 'Electrical rough-in', 'Subcontractor', 'LS', 2400, 20),
  ci('Electrical', 'Recessed light (supply & install)', 'Subcontractor', 'EA', 165, 20),
  ci('Tile', 'Floor tile install', 'Labor', 'SF', 7.5),
  ci('Tile', 'Porcelain tile', 'Material', 'SF', 4.5),
  ci('Tile', 'Shower wall tile install', 'Labor', 'SF', 12),
  ci('Cabinets', 'Cabinet install', 'Labor', 'LF', 65),
  ci('Cabinets', 'Stock cabinets', 'Material', 'LF', 210),
  ci('Countertops', 'Quartz countertop (fab & install)', 'Subcontractor', 'SF', 70, 20),
  ci('Flooring', 'LVP flooring', 'Material', 'SF', 3.25),
  ci('Flooring', 'LVP install', 'Labor', 'SF', 2.5),
  ci('Paint', 'Interior paint (walls)', 'Labor', 'SF', 1.6),
  ci('General', 'Project management', 'Labor', 'HR', 75),
  ci('General', 'Permit', 'Other', 'LS', 350, 0),
];

export const seedDB = (): DB => ({
  company: {
    name: 'Your Remodeling Co.',
    phone: '',
    email: '',
    address: '',
    license: '',
    defaultTaxRatePct: 0,
    defaultTerms:
      '50% deposit due at signing, 40% at rough-in, 10% at completion. Estimate valid for 30 days.',
  },
  customers: [
    { id: 'cust-1', name: 'Jane Doe', phone: '', email: '', address: '' },
  ],
  costItems: SEED_COST_ITEMS,
  estimates: [],
  nextEstimateNumber: 1001,
});
