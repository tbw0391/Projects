'use client';

import { Trash2 } from 'lucide-react';
import { addCustomer, deleteCustomer, patchCustomer, useStore } from '@/lib/store';

export default function Directory() {
  const { customers, estimates } = useStore();

  const remove = (id: string) => {
    if (estimates.some((e) => e.customerId === id)) return alert('This customer has estimates. Delete those first.');
    deleteCustomer(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Directory</h1>
        <button className="btn" onClick={addCustomer}>+ Customer</button>
      </div>
      {customers.map((c) => (
        <div key={c.id} className="card grid gap-3 md:grid-cols-[1fr_1fr_1fr_2fr_auto]">
          {(['name', 'phone', 'email', 'address'] as const).map((f) => (
            <div key={f}>
              <label className="label">{f}</label>
              <input className="input" value={c[f]} onChange={(e) => patchCustomer(c.id, { [f]: e.target.value })} />
            </div>
          ))}
          <button className="self-end p-2 text-slate-400 hover:text-red-600" onClick={() => remove(c.id)} aria-label="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {customers.length === 0 && <p className="text-sm text-slate-500">No customers yet.</p>}
    </div>
  );
}
