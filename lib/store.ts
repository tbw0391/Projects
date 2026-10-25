'use client';

import { useSyncExternalStore } from 'react';
import { createClient } from './supabase/client';
import type { Company, CostItem, Customer, Estimate } from './types';

// Supabase-backed store. Reads come from a synchronous in-memory snapshot (so
// the UI stays instant); writes update that snapshot optimistically and are
// persisted to Postgres. Everything is scoped to the signed-in user's company
// by row-level security, so queries need no explicit company filter.

export type State = {
  ready: boolean;
  companyId: string | null;
  nextNumber: number;
  company: Company;
  customers: Customer[];
  costItems: CostItem[];
  estimates: Estimate[];
};

const EMPTY_COMPANY: Company = {
  name: '', phone: '', email: '', address: '', license: '',
  defaultTaxRatePct: 0, defaultTerms: '',
};

let state: State = {
  ready: false, companyId: null, nextNumber: 1001,
  company: EMPTY_COMPANY, customers: [], costItems: [], estimates: [],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const setState = (patch: Partial<State>) => { state = { ...state, ...patch }; emit(); };

const supabase = () => createClient();

// ---- mappers: DB row (snake_case) <-> app type (camelCase) ----
const toCompany = (r: any): Company => ({
  name: r.name, phone: r.phone, email: r.email, address: r.address,
  license: r.license, defaultTaxRatePct: Number(r.default_tax_rate_pct), defaultTerms: r.default_terms,
});
const toCostItem = (r: any): CostItem => ({
  id: r.id, category: r.category, name: r.name, type: r.type, unit: r.unit,
  unitCost: Number(r.unit_cost), markupPct: Number(r.markup_pct),
});
const toCustomer = (r: any): Customer => ({
  id: r.id, name: r.name, phone: r.phone, email: r.email, address: r.address,
});
const toEstimate = (r: any): Estimate => ({
  id: r.id, number: r.number, title: r.title, customerId: r.customer_id ?? '',
  status: r.status, date: r.date, sections: r.sections ?? [],
  taxRatePct: Number(r.tax_rate_pct), discount: Number(r.discount),
  notes: r.notes, terms: r.terms,
});

// ---- load everything for the current company ----
let loading = false;
export async function loadAll() {
  if (loading) return;
  loading = true;
  const sb = supabase();
  const [company, customers, costItems, estimates] = await Promise.all([
    sb.from('companies').select('*').single(),
    sb.from('customers').select('*').order('created_at'),
    sb.from('cost_items').select('*').order('category'),
    sb.from('estimates').select('*').order('number', { ascending: false }),
  ]);
  loading = false;
  if (company.error || !company.data) return; // not signed in / no company yet
  setState({
    ready: true,
    companyId: company.data.id,
    nextNumber: company.data.next_estimate_number,
    company: toCompany(company.data),
    customers: (customers.data ?? []).map(toCustomer),
    costItems: (costItems.data ?? []).map(toCostItem),
    estimates: (estimates.data ?? []).map(toEstimate),
  });
}

async function reload() { state = { ...state, ready: false }; await loadAll(); }
const oops = (e: unknown) => { console.error(e); reload(); };

// ---- company ----
export async function patchCompany(patch: Partial<Company>) {
  setState({ company: { ...state.company, ...patch } });
  const row: any = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.license !== undefined) row.license = patch.license;
  if (patch.defaultTaxRatePct !== undefined) row.default_tax_rate_pct = patch.defaultTaxRatePct;
  if (patch.defaultTerms !== undefined) row.default_terms = patch.defaultTerms;
  const { error } = await supabase().from('companies').update(row).eq('id', state.companyId);
  if (error) oops(error);
}

// ---- customers ----
export async function addCustomer() {
  const { data, error } = await supabase()
    .from('customers').insert({ company_id: state.companyId, name: 'New customer' }).select().single();
  if (error || !data) return oops(error);
  setState({ customers: [...state.customers, toCustomer(data)] });
}
export async function patchCustomer(id: string, patch: Partial<Customer>) {
  setState({ customers: state.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const { error } = await supabase().from('customers').update(patch).eq('id', id);
  if (error) oops(error);
}
export async function deleteCustomer(id: string) {
  setState({ customers: state.customers.filter((c) => c.id !== id) });
  const { error } = await supabase().from('customers').delete().eq('id', id);
  if (error) oops(error);
}

// ---- cost items ----
export async function addCostItem() {
  const { data, error } = await supabase().from('cost_items')
    .insert({ company_id: state.companyId, name: 'New item', category: 'General', type: 'Material', unit: 'EA', unit_cost: 0, markup_pct: 25 })
    .select().single();
  if (error || !data) return oops(error);
  setState({ costItems: [toCostItem(data), ...state.costItems] });
}
export async function patchCostItem(id: string, patch: Partial<CostItem>) {
  setState({ costItems: state.costItems.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const row: any = {};
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.unit !== undefined) row.unit = patch.unit;
  if (patch.unitCost !== undefined) row.unit_cost = patch.unitCost;
  if (patch.markupPct !== undefined) row.markup_pct = patch.markupPct;
  const { error } = await supabase().from('cost_items').update(row).eq('id', id);
  if (error) oops(error);
}
export async function deleteCostItem(id: string) {
  setState({ costItems: state.costItems.filter((c) => c.id !== id) });
  const { error } = await supabase().from('cost_items').delete().eq('id', id);
  if (error) oops(error);
}

// ---- estimates ----
const estimateRow = (e: Estimate) => ({
  number: e.number, title: e.title, customer_id: e.customerId || null, status: e.status,
  date: e.date, sections: e.sections, tax_rate_pct: e.taxRatePct, discount: e.discount,
  notes: e.notes, terms: e.terms,
});

export async function createEstimate(): Promise<string | null> {
  const number = state.nextNumber;
  const draft = {
    company_id: state.companyId, number, title: 'New estimate',
    customer_id: state.customers[0]?.id ?? null, status: 'Draft',
    date: new Date().toISOString().slice(0, 10),
    sections: [{ id: crypto.randomUUID(), name: 'General', items: [] }],
    tax_rate_pct: state.company.defaultTaxRatePct, discount: 0, notes: '',
    terms: state.company.defaultTerms,
  };
  const { data, error } = await supabase().from('estimates').insert(draft).select().single();
  if (error || !data) { oops(error); return null; }
  await supabase().from('companies').update({ next_estimate_number: number + 1 }).eq('id', state.companyId);
  setState({ estimates: [toEstimate(data), ...state.estimates], nextNumber: number + 1 });
  return data.id;
}

export async function duplicateEstimate(src: Estimate): Promise<string | null> {
  const number = state.nextNumber;
  const copy = {
    ...estimateRow({ ...src, title: `${src.title} (copy)`, status: 'Draft' }),
    company_id: state.companyId, number, date: new Date().toISOString().slice(0, 10),
    // fresh ids for sections/items so edits don't collide with the original
    sections: src.sections.map((s) => ({ ...s, id: crypto.randomUUID(), items: s.items.map((i) => ({ ...i, id: crypto.randomUUID() })) })),
  };
  const { data, error } = await supabase().from('estimates').insert(copy).select().single();
  if (error || !data) { oops(error); return null; }
  await supabase().from('companies').update({ next_estimate_number: number + 1 }).eq('id', state.companyId);
  setState({ estimates: [toEstimate(data), ...state.estimates], nextNumber: number + 1 });
  return data.id;
}

export async function deleteEstimate(id: string) {
  setState({ estimates: state.estimates.filter((e) => e.id !== id) });
  const { error } = await supabase().from('estimates').delete().eq('id', id);
  if (error) oops(error);
}

// Estimate edits fire on every keystroke; update the snapshot immediately and
// debounce the write so we aren't hitting Postgres on each character.
const timers = new Map<string, ReturnType<typeof setTimeout>>();
export function patchEstimate(id: string, patch: Partial<Estimate>) {
  const next = state.estimates.map((e) => (e.id === id ? { ...e, ...patch } : e));
  setState({ estimates: next });
  const current = next.find((e) => e.id === id);
  if (!current) return;
  clearTimeout(timers.get(id));
  timers.set(id, setTimeout(async () => {
    const { error } = await supabase().from('estimates').update(estimateRow(current)).eq('id', id);
    if (error) oops(error);
  }, 600));
}

// ---- read hook ----
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const snapshot = () => state;
export function useStore(): State {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export async function signOut() {
  await supabase().auth.signOut();
  window.location.href = '/login';
}
