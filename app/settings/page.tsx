'use client';

import { patchCompany, useStore } from '@/lib/store';
import type { Company } from '@/lib/types';

export default function Settings() {
  const { company } = useStore();
  const text = (f: 'name' | 'phone' | 'email' | 'address' | 'license', label: string) => (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={company[f]} onChange={(e) => patchCompany({ [f]: e.target.value } as Partial<Company>)} />
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
          <input className="input" type="number" step="0.01" value={company.defaultTaxRatePct} onChange={(e) => patchCompany({ defaultTaxRatePct: +e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Default terms</label>
          <textarea className="input h-24" value={company.defaultTerms} onChange={(e) => patchCompany({ defaultTerms: e.target.value })} />
        </div>
      </div>
      <p className="text-xs text-slate-400">Changes save automatically.</p>
    </div>
  );
}
