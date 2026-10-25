'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { money } from '@/lib/calc';
import { uid, update, useDB } from '@/lib/store';
import { ITEM_TYPES, type CostItem } from '@/lib/types';

export default function CostItems() {
  const { costItems } = useDB();
  const [q, setQ] = useState('');

  const set = (id: string, patch: Partial<CostItem>) =>
    update((d) => ({ ...d, costItems: d.costItems.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const add = () =>
    update((d) => ({
      ...d,
      costItems: [{ id: uid(), name: 'New item', category: 'General', type: 'Material', unit: 'EA', unitCost: 0, markupPct: 25 }, ...d.costItems],
    }));
  const remove = (id: string) => update((d) => ({ ...d, costItems: d.costItems.filter((c) => c.id !== id) }));

  const shown = costItems
    .filter((c) => `${c.name} ${c.category} ${c.type}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.category.localeCompare(b.category));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Cost Items Database</h1>
        <div className="flex gap-2">
          <input className="input w-48" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn" onClick={add}>+ Item</button>
        </div>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[760px]">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="th">Category</th><th className="th">Name</th><th className="th">Type</th>
              <th className="th">Unit</th><th className="th">Unit cost</th><th className="th">Markup %</th>
              <th className="th">Unit price</th><th />
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="td w-32"><input className="input" value={c.category} onChange={(e) => set(c.id, { category: e.target.value })} /></td>
                <td className="td"><input className="input" value={c.name} onChange={(e) => set(c.id, { name: e.target.value })} /></td>
                <td className="td w-36">
                  <select className="input" value={c.type} onChange={(e) => set(c.id, { type: e.target.value as CostItem['type'] })}>
                    {ITEM_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </td>
                <td className="td w-20"><input className="input" value={c.unit} onChange={(e) => set(c.id, { unit: e.target.value })} /></td>
                <td className="td w-28"><input className="input" type="number" step="0.01" value={c.unitCost} onChange={(e) => set(c.id, { unitCost: +e.target.value })} /></td>
                <td className="td w-24"><input className="input" type="number" value={c.markupPct} onChange={(e) => set(c.id, { markupPct: +e.target.value })} /></td>
                <td className="td w-28 tabular-nums">{money(c.unitCost * (1 + c.markupPct / 100))}</td>
                <td className="td w-10">
                  <button className="text-slate-400 hover:text-red-600" onClick={() => remove(c.id)} aria-label="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
