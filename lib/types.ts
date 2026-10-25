export const ITEM_TYPES = ['Labor', 'Material', 'Equipment', 'Subcontractor', 'Other'] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export type CostItem = {
  id: string;
  name: string;
  category: string; // e.g. Demo, Framing, Drywall, Tile
  type: ItemType;
  unit: string; // EA, SF, LF, HR, LS
  unitCost: number;
  markupPct: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type LineItem = {
  id: string;
  costItemId?: string;
  name: string;
  type: ItemType;
  qty: number;
  unit: string;
  unitCost: number;
  markupPct: number;
  taxable: boolean;
};

export type Section = { id: string; name: string; items: LineItem[] };

export const ESTIMATE_STATUSES = ['Draft', 'Sent', 'Approved', 'Declined'] as const;
export type EstimateStatus = (typeof ESTIMATE_STATUSES)[number];

export type Estimate = {
  id: string;
  number: number;
  title: string;
  customerId: string;
  status: EstimateStatus;
  date: string; // YYYY-MM-DD
  sections: Section[];
  taxRatePct: number;
  discount: number;
  notes: string;
  terms: string;
};

export type Company = {
  name: string;
  phone: string;
  email: string;
  address: string;
  license: string;
  defaultTaxRatePct: number;
  defaultTerms: string;
};

export type DB = {
  company: Company;
  customers: Customer[];
  costItems: CostItem[];
  estimates: Estimate[];
  nextEstimateNumber: number;
};
