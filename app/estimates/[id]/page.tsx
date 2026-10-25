'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Copy, FileText, Plus, Trash2 } from 'lucide-react';
import { linePrice, money, sectionPrice, totals } from '@/lib/calc';
import { blankLine, lineFromCostItem } from '@/lib/estimates';
import { deleteEstimate, duplicateEstimate, patchEstimate, useStore } from '@/lib/store';
import { ESTIMATE_STATUSES, ITEM_TYPES, type Estimate, type LineItem, type Section } from '@/lib/types';

export default function EstimateEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const db = useStore();
  const est = db.estimates.find((e) => e.id === id);
  const [picker, setPicker] = useState<string | null>(null); // section id

  if (!est) {
    return (
      <div className="card">
        Estimate not found. <Link href="/estimates" className="text-navy underline">Back to estimates</Link>
      </div>
    );
  }

  const set = (patch: Partial<Estimate>) => patchEstimate(id, patch);
  const setSections = (fn: (s: Section[]) => Section[]) => set({ sections: fn(est.sections) });
  const setSection = (sid: string, fn: (s: Section) => Section) =>
    setSections((secs) => secs.map((s) => (s.id === sid ? fn(s) : s)));
  const setLine = (sid: string, lid: string, patch: Partial<LineItem>) =>
    setSection(sid, (s) => ({ ...s, items: s.items.map((i) => (i.id === lid ? { ...i, ...patch } : i)) }));

  const t = totals(est);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Estimate #{est.number}</h1>
        <div className="flex flex-wrap gap-2">
          <Link href={`/estimates/${id}/print`} className="btn"><FileText size={16} /> Proposal</Link>
          <button
            className="btn-ghost"
            onClick={async () => { const nid = await duplicateEstimate(est); if (nid) router.push(`/estimates/${nid}`); }}
          >
            <Copy size={16} /> Duplicate
          </button>
          <button
            className="btn-ghost text-red-600"
            onClick={() => {
              if (!confirm('Delete this estimate?')) return;
              deleteEstimate(id);
              router.push('/estimates');
            }}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="card grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="label">Title</label>
          <input className="input" value={est.title} onChange={(e) => set({ title: e.target.value })} />
        </div>
        <div>
          <label className="label">Customer</label>
          <select className="input" value={est.customerId} onChange={(e) => set({ customerId: e.target.value })}>
            <option value="">— none —</option>
            {db.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Link href="/directory" className="text-xs text-navy underline">Manage customers</Link>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={est.status} onChange={(e) => set({ status: e.target.value as Estimate['status'] })}>
            {ESTIMATE_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Date</label>
          <input className="input" type="date" value={est.date} onChange={(e) => set({ date: e.target.value })} />
        </div>
        <div>
          <label className="label">Tax rate %</label>
          <input className="input" type="number" step="0.01" value={est.taxRatePct} onChange={(e) => set({ taxRatePct: +e.target.value })} />
        </div>
        <div>
          <label className="label">Discount $</label>
          <input className="input" type="number" step="0.01" value={est.discount} onChange={(e) => set({ discount: +e.target.value })} />
        </div>
      </div>

      {est.sections.map((s) => (
        <div key={s.id} className="card p-0">
          <div className="flex items-center gap-2 border-b p-3">
            <input
              className="input max-w-xs font-semibold"
              value={s.name}
              onChange={(e) => setSection(s.id, (x) => ({ ...x, name: e.target.value }))}
            />
            <span className="ml-auto text-sm font-semibold tabular-nums">{money(sectionPrice(s))}</span>
            <button
              className="p-1 text-slate-400 hover:text-red-600"
              aria-label="Delete section"
              onClick={() =>
                (s.items.length === 0 || confirm(`Delete section "${s.name}"?`)) &&
                setSections((secs) => secs.filter((x) => x.id !== s.id))
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="th">Item</th><th className="th">Type</th><th className="th">Qty</th><th className="th">Unit</th>
                  <th className="th">Unit cost</th><th className="th">Markup %</th><th className="th">Tax</th>
                  <th className="th text-right">Price</th><th />
                </tr>
              </thead>
              <tbody>
                {s.items.map((i) => (
                  <tr key={i.id} className="border-b last:border-0">
                    <td className="td"><input className="input" value={i.name} placeholder="Description" onChange={(e) => setLine(s.id, i.id, { name: e.target.value })} /></td>
                    <td className="td w-36">
                      <select className="input" value={i.type} onChange={(e) => setLine(s.id, i.id, { type: e.target.value as LineItem['type'] })}>
                        {ITEM_TYPES.map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </td>
                    <td className="td w-20"><input className="input" type="number" step="any" value={i.qty} onChange={(e) => setLine(s.id, i.id, { qty: +e.target.value })} /></td>
                    <td className="td w-16"><input className="input" value={i.unit} onChange={(e) => setLine(s.id, i.id, { unit: e.target.value })} /></td>
                    <td className="td w-24"><input className="input" type="number" step="0.01" value={i.unitCost} onChange={(e) => setLine(s.id, i.id, { unitCost: +e.target.value })} /></td>
                    <td className="td w-20"><input className="input" type="number" value={i.markupPct} onChange={(e) => setLine(s.id, i.id, { markupPct: +e.target.value })} /></td>
                    <td className="td w-10 text-center"><input type="checkbox" checked={i.taxable} onChange={(e) => setLine(s.id, i.id, { taxable: e.target.checked })} /></td>
                    <td className="td w-28 text-right tabular-nums">{money(linePrice(i))}</td>
                    <td className="td w-8">
                      <button
                        className="text-slate-400 hover:text-red-600"
                        aria-label="Delete line"
                        onClick={() => setSection(s.id, (x) => ({ ...x, items: x.items.filter((y) => y.id !== i.id) }))}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 p-3">
            <button className="btn" onClick={() => setPicker(s.id)}><Plus size={16} /> From cost items</button>
            <button className="btn-ghost" onClick={() => setSection(s.id, (x) => ({ ...x, items: [...x.items, blankLine()] }))}>
              <Plus size={16} /> Blank line
            </button>
          </div>
        </div>
      ))}

      <button
        className="btn-ghost"
        onClick={() => setSections((secs) => [...secs, { id: crypto.randomUUID(), name: 'New section', items: [] }])}
      >
        <Plus size={16} /> Add section (e.g. Kitchen, Bath, Demo)
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-3">
          <div>
            <label className="label">Notes / scope (shown on proposal)</label>
            <textarea className="input h-28" value={est.notes} onChange={(e) => set({ notes: e.target.value })} />
          </div>
          <div>
            <label className="label">Terms</label>
            <textarea className="input h-20" value={est.terms} onChange={(e) => set({ terms: e.target.value })} />
          </div>
        </div>
        <div className="card space-y-1 text-sm">
          <Row label="Subtotal" value={money(t.subtotal)} />
          {t.discount > 0 && <Row label="Discount" value={`−${money(t.discount)}`} />}
          <Row label={`Tax (${est.taxRatePct}%)`} value={money(t.tax)} />
          <Row label="Total" value={money(t.total)} bold />
          <div className="mt-3 border-t pt-3 text-slate-500">
            <div className="label">Internal only</div>
            <Row label="Your cost" value={money(t.cost)} />
            <Row label="Gross profit" value={money(t.profit)} />
            <Row label="Margin" value={`${t.marginPct.toFixed(1)}%`} />
          </div>
        </div>
      </div>

      {picker && (
        <CostItemPicker
          onClose={() => setPicker(null)}
          onPick={(ids) => {
            const lines = db.costItems.filter((c) => ids.includes(c.id)).map(lineFromCostItem);
            setSection(picker, (x) => ({ ...x, items: [...x.items, ...lines] }));
            setPicker(null);
          }}
        />
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between tabular-nums ${bold ? 'text-lg font-bold' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function CostItemPicker({ onClose, onPick }: { onClose: () => void; onPick: (ids: string[]) => void }) {
  const { costItems } = useStore();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const shown = costItems
    .filter((c) => `${c.name} ${c.category}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.category.localeCompare(b.category));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-xl bg-white md:rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b p-3">
          <input autoFocus className="input" placeholder="Search cost items…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {shown.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-3 border-b px-3 py-2 text-sm hover:bg-slate-50">
              <input
                type="checkbox"
                checked={sel.includes(c.id)}
                onChange={(e) => setSel(e.target.checked ? [...sel, c.id] : sel.filter((x) => x !== c.id))}
              />
              <span className="flex-1">
                <span className="text-xs text-slate-500">{c.category} · </span>{c.name}
              </span>
              <span className="tabular-nums text-slate-500">{money(c.unitCost)}/{c.unit}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t p-3">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={sel.length === 0} onClick={() => onPick(sel)}>Add {sel.length || ''}</button>
        </div>
      </div>
    </div>
  );
}
