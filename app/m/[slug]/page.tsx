import { notFound } from 'next/navigation';
import { ALL_NAV } from '@/lib/nav';

export default async function ComingSoon({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = ALL_NAV.find((i) => i.href === `/m/${slug}`);
  if (!item) notFound();
  return (
    <div className="card max-w-xl">
      <h1 className="text-xl font-bold">{item.label}</h1>
      <p className="mt-2 text-sm text-slate-600">
        This module is on the roadmap. See ROADMAP.md for the build order.
      </p>
    </div>
  );
}
