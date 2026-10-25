'use client';

import { resetDB, update, useDB } from '@/lib/store';
import type { Company } from '@/lib/types';

export default function Settings() {
  const { company } = useDB();
  const set = (patch: Partial<Company>) => update((d) => ({ ...d, company: { ...d.company, ...patch } }));
  const text = (f: 'name' | 'phone' | 'email' | 'address' | 'license', label: string) => (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={company[f]} onChange={(e) => set({ [f]: e.target.value })} />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Company Settings</h1>
      <div className="card grid gap-3 md:grid-cols-2">
        {text('name', 'Company name')}
        {text('license', 'License #')}
        {text('phone', 'Phone')}
        {text('email', 'Email')}
        <div className="md:col-span-2">{text('address', 'Address')}</div>
        <div>
          <label className="label">Default tax rate %</label>
          <input className="input" type="number" step="0.01" value={company.defaultTaxRatePct} onChange={(e) => set({ defaultTaxRatePct: +e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Default terms</label>
          <textarea className="input h-24" value={company.defaultTerms} onChange={(e) => set({ defaultTerms: e.target.value })} />
        </div>
      </div>
      <button
        className="btn-ghost text-red-600"
        onClick={() => confirm('Wipe all data and reload the starter price book?') && resetDB()}
      >
        Reset all data
      </button>
    </div>
  );
}
