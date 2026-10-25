'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createEstimate } from '@/lib/estimates';
import { totals, money } from '@/lib/calc';
import { useDB } from '@/lib/store';

export default function Dashboard() {
  const db = useDB();
  const router = useRouter();
  const name = (id: string) => db.customers.find((c) => c.id === id)?.name ?? '—';
  const approved = db.estimates.filter((e) => e.status === 'Approved');
  const open = db.estimates.filter((e) => e.status === 'Draft' || e.status === 'Sent');
  const pipeline = open.reduce((t, e) => t + totals(e).total, 0);
  const won = approved.reduce((t, e) => t + totals(e).total, 0);

  const list = (title: string, rows: typeof approved) => (
    <div className="card">
      <h2 className="mb-2 font-semibold">{title}</h2>
      {rows.length === 0 && <p className="text-sm text-slate-500">None yet.</p>}
      {rows.map((e) => (
        <Link key={e.id} href={`/estimates/${e.id}`} className="flex justify-between border-t py-2 text-sm hover:text-navy">
          <span>#{e.number} · {name(e.customerId)}</span>
          <span className="tabular-nums">{money(totals(e).total)}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="btn" onClick={() => router.push(`/estimates/${createEstimate()}`)}>+ New Estimate</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card"><div className="label">Open pipeline</div><div className="text-2xl font-bold tabular-nums">{money(pipeline)}</div></div>
        <div className="card"><div className="label">Approved</div><div className="text-2xl font-bold tabular-nums">{money(won)}</div></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list('Open Estimates', open)}
        {list('Approved Estimates', approved)}
      </div>
    </div>
  );
}
