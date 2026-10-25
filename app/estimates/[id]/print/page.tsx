'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { linePrice, money, sectionPrice, totals } from '@/lib/calc';
import { useDB } from '@/lib/store';

// Customer-facing proposal. Shows prices only — never cost or markup.
export default function Proposal() {
  const { id } = useParams<{ id: string }>();
  const db = useDB();
  const est = db.estimates.find((e) => e.id === id);
  if (!est) return <div className="card">Estimate not found.</div>;

  const c = db.company;
  const cust = db.customers.find((x) => x.id === est.customerId);
  const t = totals(est);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-4 flex gap-2">
        <Link href={`/estimates/${id}`} className="btn-ghost">← Back</Link>
        <button className="btn" onClick={() => window.print()}>Print / Save PDF</button>
      </div>
      <div className="bg-white p-8 shadow print:p-0 print:shadow-none">
        <div className="flex justify-between gap-4 border-b pb-4">
          <div>
            <div className="text-2xl font-bold text-navy">{c.name}</div>
            <div className="whitespace-pre-line text-sm text-slate-600">
              {[c.address, c.phone, c.email, c.license && `License #${c.license}`].filter(Boolean).join('\n')}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-xl font-semibold">PROPOSAL</div>
            <div>#{est.number}</div>
            <div>{est.date}</div>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <div className="label">Prepared for</div>
          <div className="font-semibold">{cust?.name}</div>
          <div className="whitespace-pre-line text-slate-600">{[cust?.address, cust?.phone, cust?.email].filter(Boolean).join('\n')}</div>
        </div>

        <h2 className="mt-6 text-lg font-semibold">{est.title}</h2>
        {est.notes && <p className="mt-1 whitespace-pre-line text-sm">{est.notes}</p>}

        {est.sections.filter((s) => s.items.length).map((s) => (
          <div key={s.id} className="mt-5 break-inside-avoid">
            <div className="flex justify-between border-b-2 border-navy pb-1 font-semibold">
              <span>{s.name}</span>
              <span className="tabular-nums">{money(sectionPrice(s))}</span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {s.items.map((i) => (
                  <tr key={i.id} className="border-b border-slate-100">
                    <td className="py-1.5">{i.name}</td>
                    <td className="w-24 py-1.5 text-right text-slate-500">{i.qty} {i.unit}</td>
                    <td className="w-28 py-1.5 text-right tabular-nums">{money(linePrice(i))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div className="ml-auto mt-6 w-64 space-y-1 text-sm tabular-nums">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(t.subtotal)}</span></div>
          {t.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>−{money(t.discount)}</span></div>}
          <div className="flex justify-between"><span>Tax</span><span>{money(t.tax)}</span></div>
          <div className="flex justify-between border-t pt-1 text-lg font-bold"><span>Total</span><span>{money(t.total)}</span></div>
        </div>

        {est.terms && (
          <div className="mt-8 text-sm">
            <div className="label">Terms</div>
            <p className="whitespace-pre-line">{est.terms}</p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-2 gap-8 text-sm">
          <div className="border-t pt-1">Customer signature / date</div>
          <div className="border-t pt-1">Contractor signature / date</div>
        </div>
      </div>
    </div>
  );
}
