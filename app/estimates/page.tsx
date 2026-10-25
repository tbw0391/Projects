'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { money, totals } from '@/lib/calc';
import { createEstimate, STATUS_COLORS } from '@/lib/estimates';
import { useDB } from '@/lib/store';
import { ESTIMATE_STATUSES } from '@/lib/types';

export default function Estimates() {
  const db = useDB();
  const router = useRouter();
  const [status, setStatus] = useState('All');
  const name = (id: string) => db.customers.find((c) => c.id === id)?.name ?? '—';
  const shown = db.estimates.filter((e) => status === 'All' || e.status === status);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Estimates</h1>
        <div className="flex gap-2">
          <select className="input w-32" value={status} onChange={(e) => setStatus(e.target.value)}>
            {['All', ...ESTIMATE_STATUSES].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="btn" onClick={() => router.push(`/estimates/${createEstimate()}`)}>+ New</button>
        </div>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[600px]">
          <thead className="border-b bg-slate-50">
            <tr><th className="th">#</th><th className="th">Date</th><th className="th">Customer</th><th className="th">Title</th><th className="th">Status</th><th className="th text-right">Total</th></tr>
          </thead>
          <tbody>
            {shown.length === 0 && <tr><td className="td py-6 text-center text-slate-500" colSpan={6}>No estimates yet.</td></tr>}
            {shown.map((e) => (
              <tr key={e.id} className="cursor-pointer border-b last:border-0 hover:bg-slate-50" onClick={() => router.push(`/estimates/${e.id}`)}>
                <td className="td"><Link href={`/estimates/${e.id}`} className="text-navy underline">{e.number}</Link></td>
                <td className="td">{e.date}</td>
                <td className="td">{name(e.customerId)}</td>
                <td className="td">{e.title}</td>
                <td className="td"><span className={`rounded px-2 py-0.5 text-xs ${STATUS_COLORS[e.status]}`}>{e.status}</span></td>
                <td className="td text-right tabular-nums">{money(totals(e).total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
