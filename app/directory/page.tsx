'use client';

import { Trash2 } from 'lucide-react';
import { uid, update, useDB } from '@/lib/store';
import type { Customer } from '@/lib/types';

export default function Directory() {
  const { customers, estimates } = useDB();

  const set = (id: string, patch: Partial<Customer>) =>
    update((d) => ({ ...d, customers: d.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const add = () =>
    update((d) => ({ ...d, customers: [...d.customers, { id: uid(), name: 'New customer', phone: '', email: '', address: '' }] }));
  const remove = (id: string) => {
    if (estimates.some((e) => e.customerId === id)) return alert('This customer has estimates. Delete those first.');
    update((d) => ({ ...d, customers: d.customers.filter((c) => c.id !== id) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Directory</h1>
        <button className="btn" onClick={add}>+ Customer</button>
      </div>
      {customers.map((c) => (
        <div key={c.id} className="card grid gap-3 md:grid-cols-[1fr_1fr_1fr_2fr_auto]">
          {(['name', 'phone', 'email', 'address'] as const).map((f) => (
            <div key={f}>
              <label className="label">{f}</label>
              <input className="input" value={c[f]} onChange={(e) => set(c.id, { [f]: e.target.value })} />
            </div>
          ))}
          <button className="self-end p-2 text-slate-400 hover:text-red-600" onClick={() => remove(c.id)} aria-label="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
