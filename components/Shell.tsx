'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { NAV } from '@/lib/nav';
import { loadAll, signOut, useStore } from '@/lib/store';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { company, ready } = useStore();

  useEffect(() => { loadAll(); }, []);
  useEffect(() => setOpen(false), [path]);

  // The login page renders on its own, without the app chrome.
  if (path.startsWith('/login')) return <>{children}</>;

  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto bg-white">
      <div className="border-b px-4 py-4 text-center font-bold text-navy">{company.name || 'Remodel Estimator'}</div>
      {NAV.map((g, gi) => (
        <div key={gi}>
          {g.label && <div className="bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">{g.label}</div>}
          {g.items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`flex items-center justify-between border-b border-slate-100 px-4 py-2.5 text-sm ${g.label ? 'pl-7' : ''} ${
                active(i.href) ? 'bg-navy/10 font-semibold text-navy' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {i.label}
              {!i.ready && <span className="text-[10px] uppercase text-slate-400">soon</span>}
            </Link>
          ))}
        </div>
      ))}
      <button onClick={signOut} className="mt-auto flex items-center gap-2 border-t px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
        <LogOut size={16} /> Sign out
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="no-print sticky top-0 hidden h-screen w-60 shrink-0 border-r lg:block">{nav}</aside>
      {open && (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 max-w-[85vw] shadow-xl">{nav}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 flex items-center justify-between bg-navy px-4 py-3 text-white">
          <Link href="/" className="font-semibold">Remodel Estimator</Link>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {ready ? children : <div className="p-8 text-center text-slate-400">Loading…</div>}
        </main>
      </div>
    </div>
  );
}
