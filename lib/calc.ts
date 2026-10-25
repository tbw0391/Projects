import type { Estimate, LineItem, Section } from './types';

export const lineCost = (i: LineItem) => i.qty * i.unitCost;
export const linePrice = (i: LineItem) => lineCost(i) * (1 + i.markupPct / 100);

export const sectionPrice = (s: Section) => s.items.reduce((t, i) => t + linePrice(i), 0);

export function totals(e: Estimate) {
  const items = e.sections.flatMap((s) => s.items);
  const cost = items.reduce((t, i) => t + lineCost(i), 0);
  const subtotal = items.reduce((t, i) => t + linePrice(i), 0);
  const taxableBase = items.filter((i) => i.taxable).reduce((t, i) => t + linePrice(i), 0);
  // Discount comes off the top before tax, spread proportionally over taxable items.
  const discount = Math.min(e.discount || 0, subtotal);
  const taxableAfterDiscount = subtotal > 0 ? taxableBase * (1 - discount / subtotal) : 0;
  const tax = taxableAfterDiscount * (e.taxRatePct / 100);
  const total = subtotal - discount + tax;
  const profit = subtotal - discount - cost;
  const marginPct = subtotal - discount > 0 ? (profit / (subtotal - discount)) * 100 : 0;
  return { cost, subtotal, discount, tax, total, profit, marginPct };
}

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
